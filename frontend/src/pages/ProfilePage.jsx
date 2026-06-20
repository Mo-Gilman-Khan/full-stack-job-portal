import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Award, GraduationCap, FileText, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setName(user.name || '');
    if (user.profile) {
      setBio(user.profile.bio || '');
      setSkills(user.profile.skills ? user.profile.skills.join(', ') : '');
      setExperience(user.profile.experience || '');
      setEducation(user.profile.education || '');
      setResumeName(user.profile.resumeName || '');
      setResumeUrl(user.profile.resumeUrl || '');
      setCompanyName(user.profile.companyName || '');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const skillsArray = skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill);

      const profilePayload = {
        bio,
        companyName: user.role === 'recruiter' ? companyName : ''
      };

      if (user.role === 'seeker') {
        profilePayload.skills = skillsArray;
        profilePayload.experience = experience;
        profilePayload.education = education;
        profilePayload.resumeName = resumeName;
        profilePayload.resumeUrl = resumeUrl;
      }

      await updateProfile(name, profilePayload);
      setSuccessMsg('Your profile has been updated successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>
          Manage <span className="gradient-text">My Profile</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Keep your professional details updated so employers or candidates can connect with you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }} className="grid-2">
        {/* User Card Showcase */}
        <aside>
          <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{user.name}</h3>
              <span className="badge badge-type" style={{ marginTop: '0.25rem' }}>{user.role}</span>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--panel-border)', paddingTop: '1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Mail size={16} /> <span>{user.email}</span>
              </div>
              {user.role === 'recruiter' && companyName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Briefcase size={16} /> <span>Company: {companyName}</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Edit Profile Form */}
        <main>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
              Profile Details
            </h3>

            {successMsg && (
              <div style={{
                background: 'var(--success-bg)',
                color: 'var(--success-color)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger-color)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.9rem',
                marginBottom: '1.5rem'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Professional Summary / Bio</label>
                <textarea
                  placeholder="Introduce yourself, your background or hiring goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '100px' }}
                />
              </div>

              {/* Seeker Fields */}
              {user.role === 'seeker' && (
                <>
                  {/* Skills */}
                  <div className="form-group">
                    <label className="form-label">Skills (Comma-separated)</label>
                    <div style={{ position: 'relative' }}>
                      <Award size={16} style={{ position: 'absolute', left: '0.75rem', top: '0.9rem', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="React, Express, Python, Design System"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Separate multiple skills with commas.</span>
                  </div>

                  {/* Experience */}
                  <div className="form-group">
                    <label className="form-label">Work Experience</label>
                    <textarea
                      placeholder="e.g. Senior Developer at TechCorp (2 years)&#10;Software Intern at Startup (6 months)"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="form-control"
                      style={{ minHeight: '120px' }}
                    />
                  </div>

                  {/* Education */}
                  <div className="form-group">
                    <label className="form-label">Education</label>
                    <div style={{ position: 'relative' }}>
                      <GraduationCap size={16} style={{ position: 'absolute', left: '0.75rem', top: '0.9rem', color: 'var(--text-muted)' }} />
                      <textarea
                        placeholder="e.g. B.S. in Computer Science - State University (2020-2024)"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="form-control"
                        style={{ paddingLeft: '2.5rem', minHeight: '80px' }}
                      />
                    </div>
                  </div>

                  {/* Resume Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }} className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Resume Name</label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="e.g. Resume_Name.pdf"
                          value={resumeName}
                          onChange={(e) => setResumeName(e.target.value)}
                          className="form-control"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Resume Link / URL</label>
                      <input
                        type="url"
                        placeholder="https://gdrive.com/myresume.pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Recruiter Fields */}
              {user.role === 'recruiter' && (
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Stripe Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ marginTop: '1rem', minWidth: '150px' }}
              >
                {isSubmitting ? 'Updating...' : 'Save Profile'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
