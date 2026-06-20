import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, DollarSign, Briefcase, ChevronLeft, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Application form state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch job and check if seeker already applied
  useEffect(() => {
    const fetchJobAndApplicationStatus = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch Job Details
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve job details');
        }
        const jobData = await res.json();
        setJob(jobData);

        // Pre-fill resume details from seeker profile if logged in
        if (user && user.role === 'seeker') {
          setResumeName(user.profile?.resumeName || '');
          setResumeUrl(user.profile?.resumeUrl || '');

          // Check if seeker already applied
          const appsRes = await fetch('http://localhost:5000/api/applications/seeker', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (appsRes.ok) {
            const apps = await appsRes.json();
            const applied = apps.some(app => app.jobId && (app.jobId._id === id || app.jobId === id));
            setIsApplied(applied);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Error loading job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicationStatus();
  }, [id, user, token]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: id,
          coverLetter,
          resumeName,
          resumeUrl
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setIsApplied(true);
      setShowApplyForm(false);
      setSuccessMessage('Your application has been submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading job specifications...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '2rem', borderRadius: '10px', textAlign: 'center' }}>
          <p>{error}</p>
          <Link to="/jobs" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>Back to Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Back button */}
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition-smooth)' }} className="nav-link">
        <ChevronLeft size={16} /> Back to Job Search
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }} className="grid-2">
        {/* Main Job details */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header info */}
            <div>
              <span className="badge badge-type" style={{ marginBottom: '0.75rem' }}>{job.jobType}</span>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{job.title}</h1>
              <p style={{ color: 'var(--primary-color)', fontSize: '1.2rem', fontWeight: 600 }}>{job.company}</p>
            </div>

            {/* Quick Metadata */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              borderTop: '1px solid var(--panel-border)',
              borderBottom: '1px solid var(--panel-border)',
              padding: '1rem 0',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</p>
                  <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{job.location}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Salary Offer</p>
                  <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{job.salaryRange}</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700 }}>Job Description</h2>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {job.description}
              </p>
            </div>

            {/* Job Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700 }}>Key Requirements</h2>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.6 }}>
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Actions Card */}
        <aside>
          <div className="glass-card" style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>Application Hub</h3>
            
            {successMessage && (
              <div style={{
                background: 'var(--success-bg)',
                color: 'var(--success-color)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger-color)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem'
              }}>
                {error}
              </div>
            )}

            {!user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Interested in this position? Log in to your seeker account to submit your application immediately.
                </p>
                <Link to="/auth" state={{ isLogin: true }} className="btn btn-primary" style={{ width: '100%' }}>
                  Login to Apply <ArrowRight size={16} />
                </Link>
              </div>
            ) : user.role === 'recruiter' ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  You are logged in as a <strong>Recruiter</strong>. Recruiters cannot apply for job postings.
                </p>
                {user.id === job.recruiterId && (
                  <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '1.25rem' }}>
                    Manage this Post
                  </Link>
                )}
              </div>
            ) : isApplied ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--primary-color)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '10px',
                  padding: '1rem'
                }}>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Application Submitted</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    You have already applied for this job listing. You can track status on your dashboard.
                  </p>
                </div>
                <Link to="/dashboard" className="btn btn-secondary" style={{ width: '100%' }}>
                  Go to Dashboard
                </Link>
              </div>
            ) : !showApplyForm ? (
              <button onClick={() => setShowApplyForm(true)} className="btn btn-primary" style={{ width: '100%' }}>
                Apply for Job
              </button>
            ) : (
              // Apply Form
              <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
                <div className="form-group">
                  <label className="form-label">Resume Filename</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="e.g. My_CV.pdf"
                      value={resumeName}
                      onChange={(e) => setResumeName(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Resume Link / URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/my-resume"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Provide a link to Google Drive, Dropbox, or Portfolio</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Letter / Pitch</label>
                  <textarea
                    placeholder="Briefly state why you're a great fit for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.85rem', minHeight: '120px' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn btn-secondary btn-sm" disabled={isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetailsPage;
