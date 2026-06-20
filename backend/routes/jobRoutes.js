import express from 'express';
import { Job } from '../models/Job.js';
import { getDbType } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filters
router.get('/', async (req, res) => {
  const { search, location, jobType } = req.query;

  try {
    if (getDbType() === 'mongodb') {
      let query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      if (jobType) {
        query.jobType = jobType;
      }
      // Import the actual Mongo model dynamically or query it via Job wrapper
      const jobs = await Job.find(query);
      
      // Mongoose find returns a query builder which supports sorting. For simplicity:
      // If we use Mongoose, we sort them.
      let sortedJobs = jobs;
      if (typeof jobs.sort === 'function' && !Array.isArray(jobs)) {
        sortedJobs = await jobs.sort({ createdAt: -1 });
      } else if (Array.isArray(jobs)) {
        sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      res.json(sortedJobs);
    } else {
      // Mock Fallback Filtering
      let jobs = await Job.find({});
      
      if (search) {
        const s = search.toLowerCase();
        jobs = jobs.filter(job => 
          (job.title && job.title.toLowerCase().includes(s)) ||
          (job.company && job.company.toLowerCase().includes(s)) ||
          (job.description && job.description.toLowerCase().includes(s))
        );
      }
      
      if (location) {
        const loc = location.toLowerCase();
        jobs = jobs.filter(job => job.location && job.location.toLowerCase().includes(loc));
      }
      
      if (jobType) {
        jobs = jobs.filter(job => job.jobType === jobType);
      }

      // Sort newest first
      jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json(jobs);
    }
  } catch (error) {
    console.error('Fetch jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// @route   GET /api/jobs/recruiter
// @desc    Get jobs posted by the logged-in recruiter
router.get('/recruiter', authenticate, authorize(['recruiter']), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id });
    
    // Sort newest first
    const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedJobs);
  } catch (error) {
    console.error('Fetch recruiter jobs error:', error);
    res.status(500).json({ message: 'Server error fetching recruiter jobs' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.target || req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Fetch job details error:', error);
    res.status(500).json({ message: 'Server error fetching job details' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job post
router.post('/', authenticate, authorize(['recruiter']), async (req, res) => {
  const { title, company, description, requirements, location, salaryRange, jobType } = req.body;

  try {
    if (!title || !company || !description || !location || !salaryRange || !jobType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Requirements is passed as an array or a comma-separated string
    let reqArray = [];
    if (Array.isArray(requirements)) {
      reqArray = requirements;
    } else if (typeof requirements === 'string') {
      reqArray = requirements.split(',').map(r => r.trim()).filter(r => r);
    }

    const newJob = await Job.create({
      title,
      company,
      description,
      requirements: reqArray,
      location,
      salaryRange,
      jobType,
      recruiterId: req.user.id
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error creating job post' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job listing
router.put('/:id', authenticate, authorize(['recruiter']), async (req, res) => {
  const { title, company, description, requirements, location, salaryRange, jobType } = req.body;

  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    // Check ownership
    const recruiterId = job.recruiterId.toString ? job.recruiterId.toString() : job.recruiterId;
    if (recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (company) updateData.company = company;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (salaryRange) updateData.salaryRange = salaryRange;
    if (jobType) updateData.jobType = jobType;
    if (requirements) {
      updateData.requirements = Array.isArray(requirements) 
        ? requirements 
        : requirements.split(',').map(r => r.trim()).filter(r => r);
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });
    res.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error updating job listing' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job listing
router.delete('/:id', authenticate, authorize(['recruiter']), async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    // Check ownership
    const recruiterId = job.recruiterId.toString ? job.recruiterId.toString() : job.recruiterId;
    if (recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Job.findByIdAndDelete(jobId);
    res.json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error deleting job listing' });
  }
});

export default router;
