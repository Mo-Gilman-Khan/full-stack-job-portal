import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Building, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, user, error: authError } = useAuth();

  // Determine initial mode from redirect state
  const isLoginFromState = location.state?.isLogin !== false;
  const isRecruiterFromState = location.state?.isRecruiter === true;

  const [isLogin, setIsLogin] = useState(isLoginFromState);
  const [role, setRole] = useState(isRecruiterFromState ? 'recruiter' : 'seeker');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Reset state errors when changing tab modes
    setError('');
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }

    if (!isLogin && role === 'recruiter' && !companyName) {
      setError('Please enter your company name');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, role, companyName);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '75vh',
      animation: 'fadeIn 0.5s ease-out',
      paddingTop: '2rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '460px',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
        border: '1px solid var(--panel-border)'
      }}>
        {/* Title */}
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Sign in to access your jobs and listings' : 'Get started with NextHire today'}
        </p>

        {/* Errors */}
        {(error || authError) && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger-color)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Register-Only: Name Field */}
          {!isLogin && (
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          {/* Register-Only: Role Selector */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Select Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`btn ${role === 'seeker' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.6rem 0.5rem', fontSize: '0.9rem' }}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`btn ${role === 'recruiter' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.6rem 0.5rem', fontSize: '0.9rem' }}
                >
                  Recruiter
                </button>
              </div>
            </div>
          )}

          {/* Register-Only & Recruiter: Company Name Field */}
          {!isLogin && role === 'recruiter' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <label className="form-label">Company Name</label>
              <div style={{ position: 'relative' }}>
                <Building size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. NextHire Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.9rem 1.5rem', fontSize: '1rem', marginTop: '1.5rem', gap: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Login to NextHire' : 'Create Free Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                marginLeft: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
