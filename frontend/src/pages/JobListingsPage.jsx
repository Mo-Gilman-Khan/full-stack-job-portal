import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Calendar, Filter, X } from 'lucide-react';

const JobListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from search parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch jobs whenever search parameters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const queryParams = [];
        const s = searchParams.get('search');
        const l = searchParams.get('location');
        const jt = searchParams.get('jobType');

        if (s) queryParams.push(`search=${encodeURIComponent(s)}`);
        if (l) queryParams.push(`location=${encodeURIComponent(l)}`);
        if (jt) queryParams.push(`jobType=${encodeURIComponent(jt)}`);

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
        const res = await fetch(`/api/jobs${queryString}`);
        
        if (!res.ok) {
          throw new Error('Failed to load jobs');
        }
        
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to retrieve jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (jobType) params.jobType = jobType;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>
          Available <span className="gradient-text">Job Openings</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse open listings or use the filters below to refine your search.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }} className="grid-2">
        {/* Sidebar Filters */}
        <aside>
          <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
                <Filter size={18} style={{ color: 'var(--primary-color)' }} /> Filters
              </h3>
              {(search || location || jobType) && (
                <button 
                  onClick={handleClearFilters} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-color)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            <form onSubmit={handleApplyFilters}>
              {/* Search Keyword */}
              <div className="form-group">
                <label className="form-label">Search Keyword</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Title, skills, company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Location filter */}
              <div className="form-group">
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="City, country or remote..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Job Type dropdown */}
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="form-control form-select"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Listings Section */}
        <main>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading jobs...</p>
            </div>
          ) : error ? (
            <div style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger-color)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <p>{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No job listings found</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                We couldn't find any job posts matching your criteria. Try adjusting your filters or search keywords.
              </p>
              <button onClick={handleClearFilters} className="btn btn-secondary btn-sm">
                Reset Search
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map((job) => (
                <div key={job._id} className="glass-card" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>{job.title}</h2>
                      <p style={{ color: 'var(--primary-color)', fontSize: '0.95rem', fontWeight: 600 }}>{job.company}</p>
                    </div>
                    <span className="badge badge-type">{job.jobType}</span>
                  </div>

                  {/* Description preview */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {job.description && job.description.length > 180
                      ? `${job.description.substring(0, 180)}...`
                      : job.description}
                  </p>

                  {/* Metadata & Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--panel-border)',
                    paddingTop: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <DollarSign size={14} /> {job.salaryRange}
                      </span>
                    </div>

                    <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 1rem' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobListingsPage;
