import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, ListChecks, AlignLeft, ChevronLeft } from 'lucide-react';

const PostJobPage = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'recruiter') {
      navigate('/dashboard');
      return;
    }

    if (isEditMode) {
      const fetchJobDetails = async () => {
        setFetchingJob(true);
        setError('');
        try {
          const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
          if (!res.ok) throw new Error('Job post not found');
          
          const job = await res.json();
          
          // Verify owner
          const jobRecruiterId = job.recruiterId.toString ? job.recruiterId.toString() : job.recruiterId;
          if (jobRecruiterId !== user.id) {
            setError('You are not authorized to edit this job posting');
            return;
          }

          setTitle(job.title || '');
          setCompany(job.company || '');
          setJobType(job.jobType || 'Full-time');
          setLocation(job.location || '');
          setSalaryRange(job.salaryRange || '');
          setDescription(job.description || '');
          setRequirements(job.requirements ? job.requirements.join('\n') : '');
        } catch (err) {
          console.error(err);
          setError(err.message || 'Error fetching job details');
        } finally {
          setFetchingJob(false);
        }
      };

      fetchJobDetails();
    } else {
      // In create mode, prefill company name from recruiter profile if available
      if (user.profile && user.profile.companyName) {
        setCompany(user.profile.companyName);
      }
    }
  }, [id, isEditMode, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title || !company || !location || !salaryRange || !description || !requirements) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Split requirements by newline and clean empty lines
    const reqArray = requirements
      .split('\n')
      .map(r => r.trim())
      .filter(r => r);

    try {
      const url = isEditMode 
        ? `http://localhost:5000/api/jobs/${id}`
        : 'http://localhost:5000/api/jobs';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          company,
          jobType,
          location,
          salaryRange,
          description,
          requirements: reqArray
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error saving job post');
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error saving job post');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving listing details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem' }} className="nav-link">
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>
          {isEditMode ? 'Modify' : 'Post a New'} <span className="gradient-text">Job Opportunity</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Provide the technical requirements, benefits, and descriptions to attract qualified candidates.
        </p>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger-color)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Senior Fullstack Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Stripe, Vercel"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="grid-3">
            {/* Job Type */}
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="form-control form-select"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Remote / New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            {/* Salary Range */}
            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. $120k - $150k"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Job Description</label>
            <div style={{ position: 'relative' }}>
              <AlignLeft size={16} style={{ position: 'absolute', left: '0.75rem', top: '0.9rem', color: 'var(--text-muted)' }} />
              <textarea
                placeholder="Detail the role responsibilities, team dynamics, benefits, and projects..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem', minHeight: '180px' }}
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="form-group">
            <label className="form-label">Candidate Requirements (One per line)</label>
            <div style={{ position: 'relative' }}>
              <ListChecks size={16} style={{ position: 'absolute', left: '0.75rem', top: '0.9rem', color: 'var(--text-muted)' }} />
              <textarea
                placeholder="e.g.&#10;3+ years React experience&#10;Proficient in Node.js&#10;Excellent communication skills"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem', minHeight: '130px' }}
                required
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (isEditMode && error)}
              style={{ minWidth: '150px' }}
            >
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
