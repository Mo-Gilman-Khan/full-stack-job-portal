import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User as UserIcon, LogOut, PlusSquare, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <Briefcase size={28} className="gradient-text" style={{ stroke: 'url(#blue-purple-grad)' }} />
          {/* Fallback SVG gradient definition helper inside logo link */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <linearGradient id="blue-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </svg>
          <span className="gradient-text">NextHire</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/jobs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Search size={16} /> Browse Jobs
              </span>
            </NavLink>
          </li>

          {user ? (
            <>
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <LayoutDashboard size={16} /> Dashboard
                  </span>
                </NavLink>
              </li>
              
              {user.role === 'recruiter' && (
                <li>
                  <NavLink 
                    to="/post-job" 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <PlusSquare size={16} /> Post Job
                    </span>
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <UserIcon size={16} /> Profile
                  </span>
                </NavLink>
              </li>

              <li>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/auth" state={{ isLogin: true }} className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/auth" state={{ isLogin: false }} className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
