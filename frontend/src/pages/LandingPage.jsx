import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Award, Users, Building, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = [];
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
    
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    navigate(`/jobs${queryString}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/jobs?search=${encodeURIComponent(category)}`);
  };

  const categories = [
    { name: 'Frontend Developer', icon: Briefcase, count: '140+ jobs' },
    { name: 'Backend Developer', icon: Award, count: '90+ jobs' },
    { name: 'UI/UX Designer', icon: Users, count: '65+ jobs' },
    { name: 'Full Stack Engineer', icon: Building, count: '110+ jobs' },
  ];

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Hero Section */}
      <header style={{
        padding: '5rem 0 3rem 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          lineHeight: 1.1,
          maxWidth: '800px',
          marginBottom: '1.5rem',
          fontWeight: 800
        }}>
          Find the Next Step in Your <span className="gradient-text">Career Journey</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1.15rem',
          maxWidth: '600px',
          lineHeight: 1.6,
          marginBottom: '3rem'
        }}>
          NextHire connects the world's most talented developers and designers with high-growth startups and tech giants. Start your search today.
        </p>

        {/* Search Bar Panel */}
        <form onSubmit={handleSearchSubmit} className="glass-card" style={{
          width: '100%',
          maxWidth: '850px',
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: '200px',
            position: 'relative'
          }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Job title, keywords, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '3rem', background: '#f1f5f9', border: '1px solid var(--panel-border)' }}
            />
          </div>

          <div style={{
            height: '30px',
            width: '1px',
            backgroundColor: 'var(--panel-border)',
            display: 'none' /* Will show on desktop */
          }} className="search-divider" />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: '200px',
            position: 'relative'
          }}>
            <MapPin size={20} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="City, state, or remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '3rem', background: '#f1f5f9', border: '1px solid var(--panel-border)' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2rem', minWidth: '130px' }}>
            Search Jobs
          </button>
        </form>
      </header>

      {/* Stats Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        margin: '2rem 0 5rem 0'
      }} className="grid-3">
        {[
          { value: '1,200+', label: 'Active Job Openings' },
          { value: '450+', label: 'Hiring Companies' },
          { value: '15,000+', label: 'Successful Placements' }
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(124, 58, 237, 0.04) 100%)'
          }}>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{stat.value}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Popular Categories */}
      <section style={{ marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem', fontWeight: 700 }}>
          Explore Popular <span className="gradient-text">Categories</span>
        </h2>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => handleCategoryClick(cat.name)}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '2rem 1.5rem',
                  gap: '1rem'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <Icon size={24} style={{ color: 'var(--primary-color)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{cat.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cat.count}</p>
                </div>
                <span className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem', gap: '0.25rem', marginTop: '0.5rem', width: '100%' }}>
                  View jobs <ArrowRight size={14} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recruiter Call to Action */}
      <section className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '3.5rem 3rem',
        borderRadius: '24px',
        gap: '2rem'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: 700 }}>Are you hiring technical talent?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Reach thousands of pre-screened developers, engineers, and designers. Create an employer account to post open positions, manage applications, and make your next hire.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/auth', { state: { isLogin: false, isRecruiter: true } })} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            Post a Job Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
