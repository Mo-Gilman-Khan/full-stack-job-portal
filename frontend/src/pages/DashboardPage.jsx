import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, FileText, CheckCircle2, User, Eye, Edit3, Trash2, ChevronRight, X } from 'lucide-react';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Seeker State
  const [seekerApplications, setSeekerApplications] = useState([]);

  // Recruiter State
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        if (user.role === 'seeker') {
          // Fetch seeker applications
          const res = await fetch('/api/applications/seeker', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) throw new Error('Failed to load applications');
          const data = await res.json();
          setSeekerApplications(data);
        } else {
          // Fetch recruiter posted jobs
          const res = await fetch('/api/jobs/recruiter', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) throw new Error('Failed to load jobs');
          const data = await res.json();
          setRecruiterJobs(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token, navigate]);

  // Recruiter: Fetch applicants for a specific job listing
  const handleViewApplicants = async (jobId, jobTitle) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setApplicantsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/applications/job/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to retrieve applicants');
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve candidate applications');
    } finally {
      setApplicantsLoading(false);
    }
  };

  // Recruiter: Update application status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      // Update local applicants state
      setApplicants(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error(err);
      alert('Error updating application status');
    }
  };

  // Recruiter: Delete job listing
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing? All applicant history for this job will be lost.')) {
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete job');
      
      setRecruiterJobs(prev => prev.filter(job => job._id !== jobId));
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
        setApplicants([]);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting job listing');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {user.role === 'seeker' ? 'Candidate' : 'Employer'} <span className="gradient-text">Control Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Welcome back, {user.name}. You are logged in as a {user.role === 'seeker' ? 'Job Seeker' : 'Recruiter'}.
          </p>
        </div>
        {user.role === 'recruiter' && (
          <Link to="/post-job" className="btn btn-primary">
            Create Job Post
          </Link>
        )}
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-bg)',
          color: 'var(--danger-color)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          {error}
        </div>
      )}

      {/* ==================== JOB SEEKER DASHBOARD ==================== */}
      {user.role === 'seeker' && (
        <div>
          {/* Seeker Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }} className="grid-2">
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center' }}>
                <Briefcase size={22} style={{ color: 'var(--primary-color)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{seekerApplications.length}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Applications Submitted</p>
              </div>
            </div>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} style={{ color: 'var(--success-color)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {seekerApplications.filter(app => ['shortlisted', 'accepted'].includes(app.status)).length}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Shortlisted or Accepted</p>
              </div>
            </div>
          </div>

          {/* Seeker Application List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>My Job Applications</h3>
            
            {seekerApplications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>You haven't applied for any jobs yet.</p>
                <Link to="/jobs" className="btn btn-secondary btn-sm">Find Jobs</Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Position</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Company</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Applied Date</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seekerApplications.map((app) => (
                      <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>{app.jobId?.title || 'Job Listing Deleted'}</td>
                        <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{app.jobId?.company || 'N/A'}</td>
                        <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <span className={`badge badge-${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                          {app.jobId?._id ? (
                            <Link to={`/jobs/${app.jobId._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem' }}>
                              View Post
                            </Link>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== RECRUITER DASHBOARD ==================== */}
      {user.role === 'recruiter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Recruiter Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }} className="grid-2">
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center' }}>
                <Briefcase size={22} style={{ color: 'var(--primary-color)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{recruiterJobs.length}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Posted Listings</p>
              </div>
            </div>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center' }}>
                <User size={22} style={{ color: 'var(--secondary-color)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>NextHire</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage and Update Candidates</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="grid-2">
            {/* Posted Jobs Panel */}
            <div className="glass-card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>My Posted Job Listings</h3>

              {recruiterJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <Briefcase size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>You have not posted any jobs yet.</p>
                  <Link to="/post-job" className="btn btn-secondary btn-sm">Create First Job Post</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recruiterJobs.map((job) => (
                    <div
                      key={job._id}
                      style={{
                        padding: '1.25rem',
                        background: selectedJobId === job._id ? 'rgba(37, 99, 235, 0.05)' : 'rgba(0, 0, 0, 0.015)',
                        border: `1px solid ${selectedJobId === job._id ? 'var(--primary-color)' : 'var(--panel-border)'}`,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{job.title}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="badge badge-type" style={{ fontSize: '0.7rem' }}>{job.jobType}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--panel-border)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleViewApplicants(job._id, job.title)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Eye size={14} /> Applicants
                          </button>
                          <button
                            onClick={() => navigate(`/edit-job/${job._id}`)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                            title="Edit Listing"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Candidate Applications / Applicants Manager */}
            <div className="glass-card" style={{ height: 'fit-content', minHeight: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>
                  {selectedJobId ? 'Applicants Manager' : 'Select a Job'}
                </h3>
                {selectedJobId && (
                  <button onClick={() => setSelectedJobId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                )}
              </div>

              {!selectedJobId ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem', textAlign: 'center' }}>
                  <User size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.4 }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px' }}>
                    Click on the <strong>Applicants</strong> button of any job listing to manage candidate resumes and cover letters.
                  </p>
                </div>
              ) : applicantsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Retrieving candidates...</p>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Showing candidates for: "{selectedJobTitle}"
                  </p>

                  {applicants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No applications received for this job yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {applicants.map((app) => (
                        <div
                          key={app._id}
                          style={{
                            padding: '1.25rem',
                            background: 'rgba(0, 0, 0, 0.015)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                          }}
                        >
                          {/* Candidate Meta */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{app.seekerId?.name || 'Candidate'}</h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.seekerId?.email}</p>
                            </div>
                            <span className={`badge badge-${app.status}`}>{app.status}</span>
                          </div>

                          {/* Seeker profile snippet */}
                          {app.seekerId?.profile && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0, 0, 0, 0.03)', padding: '0.75rem', borderRadius: '8px' }}>
                              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Skills & Experience:</p>
                              <p style={{ marginBottom: '0.5rem' }}>
                                {app.seekerId.profile.skills && app.seekerId.profile.skills.length > 0
                                  ? app.seekerId.profile.skills.join(', ')
                                  : 'No skills listed'}
                              </p>
                              {app.seekerId.profile.experience && (
                                <p style={{ whiteSpace: 'pre-line', fontSize: '0.8rem' }}>{app.seekerId.profile.experience}</p>
                              )}
                            </div>
                          )}

                          {/* Cover Letter */}
                          {app.coverLetter && (
                            <div>
                              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cover Letter / Note:</p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', fontStyle: 'italic', background: 'rgba(0, 0, 0, 0.02)', padding: '0.5rem', borderRadius: '6px', borderLeft: '3px solid var(--primary-color)' }}>
                                "{app.coverLetter}"
                              </p>
                            </div>
                          )}

                          {/* Resume Link */}
                          {app.resumeName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                              <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                              <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
                                {app.resumeName}
                              </a>
                            </div>
                          )}

                          {/* Status Action Buttons */}
                          <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            borderTop: '1px solid var(--panel-border)',
                            paddingTop: '0.75rem',
                            marginTop: '0.25rem',
                            flexWrap: 'wrap'
                          }}>
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                              className="btn btn-secondary btn-sm"
                              style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem', background: app.status === 'shortlisted' ? 'var(--info-bg)' : '', color: app.status === 'shortlisted' ? 'var(--info-color)' : '' }}
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'accepted')}
                              className="btn btn-secondary btn-sm"
                              style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem', background: app.status === 'accepted' ? 'var(--success-bg)' : '', color: app.status === 'accepted' ? 'var(--success-color)' : '' }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'rejected')}
                              className="btn btn-danger btn-sm"
                              style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem', background: app.status === 'rejected' ? 'var(--danger-bg)' : '', color: app.status === 'rejected' ? 'var(--danger-color)' : '', border: 'none' }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
