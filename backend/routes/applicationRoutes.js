import express from 'express';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { User } from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { getDbType } from '../config/db.js';

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for a job
router.post('/', authenticate, authorize(['seeker']), async (req, res) => {
  const { jobId, coverLetter, resumeName, resumeUrl } = req.body;

  try {
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const alreadyApplied = await Application.findOne({
      jobId,
      seekerId: req.user.id
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // If seeker didn't provide resume details, try fetching from their profile
    let appResumeName = resumeName;
    let appResumeUrl = resumeUrl;
    
    if (!appResumeName || !appResumeUrl) {
      const user = await User.findById(req.user.id);
      if (user && user.profile) {
        appResumeName = appResumeName || user.profile.resumeName || '';
        appResumeUrl = appResumeUrl || user.profile.resumeUrl || '';
      }
    }

    const application = await Application.create({
      jobId,
      seekerId: req.user.id,
      resumeName: appResumeName || 'Profile Resume',
      resumeUrl: appResumeUrl || '#',
      coverLetter: coverLetter || '',
      status: 'pending'
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Server error processing application' });
  }
});

// @route   GET /api/applications/seeker
// @desc    Get all applications submitted by logged-in seeker
router.get('/seeker', authenticate, authorize(['seeker']), async (req, res) => {
  try {
    let apps = await Application.find({ seekerId: req.user.id });

    // Populate Job details manually to support both Mongoose & Mock fallback
    const populatedApps = [];
    for (const app of apps) {
      // Handle model structure differences (object vs mongoose document)
      const appObj = app.toObject ? app.toObject() : { ...app };
      const job = await Job.findById(appObj.jobId);
      
      appObj.jobId = job || { title: 'Unknown Job', company: 'Unknown Company' };
      populatedApps.push(appObj);
    }

    // Sort newest applications first
    populatedApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(populatedApps);
  } catch (error) {
    console.error('Fetch seeker applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job (Recruiter view)
router.get('/job/:jobId', authenticate, authorize(['recruiter']), async (req, res) => {
  const { jobId } = req.params;

  try {
    // Verify job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const recruiterId = job.recruiterId.toString ? job.recruiterId.toString() : job.recruiterId;
    if (recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const apps = await Application.find({ jobId });

    // Populate Seeker details manually
    const populatedApps = [];
    for (const app of apps) {
      const appObj = app.toObject ? app.toObject() : { ...app };
      const seeker = await User.findById(appObj.seekerId);
      
      if (seeker) {
        const seekerObj = seeker.toObject ? seeker.toObject() : { ...seeker };
        if (seekerObj.password) delete seekerObj.password;
        appObj.seekerId = seekerObj;
      } else {
        appObj.seekerId = { name: 'Unknown Candidate', email: 'N/A' };
      }
      populatedApps.push(appObj);
    }

    populatedApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(populatedApps);
  } catch (error) {
    console.error('Fetch job applicants error:', error);
    res.status(500).json({ message: 'Server error fetching applicants' });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status (Shortlist/Reject/Accept)
router.put('/:id', authenticate, authorize(['recruiter']), async (req, res) => {
  const { status } = req.body;
  const appId = req.params.id;

  try {
    if (!status || !['pending', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status value' });
    }

    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify job belongs to recruiter
    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job listing associated with application not found' });
    }

    const recruiterId = job.recruiterId.toString ? job.recruiterId.toString() : job.recruiterId;
    if (recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      appId,
      { status },
      { new: true }
    );

    res.json(updatedApp);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
});

export default router;
