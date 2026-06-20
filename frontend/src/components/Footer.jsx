import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <Link to="/" className="footer-logo nav-logo" style={{ margin: 0 }}>
          <span className="gradient-text">NextHire</span>
        </Link>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          Connect with top-tier jobs and recruiters instantly. A MERN stack platform.
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '1rem' }}>
          &copy; {new Date().getFullYear()} NextHire. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
