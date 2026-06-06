import React, { useState } from 'react';

export default function Login({ login, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide username and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      // Successful login
      login(data.token, data.user);

    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="cultural-pattern cultural-pattern-nude"></div>
      
      <div className="auth-card glass-panel">
        <span className="signature-overlay" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>Welcome Back</span>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Login to Account</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>Access bookings, check course statuses, and manage configurations.</p>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', color: '#DC2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              className="form-input" 
              placeholder="e.g., admin or client"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              placeholder="Enter password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', borderRadius: '8px', padding: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          Don't have an account? 
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/signup')}>Create Account</span>
        </div>
        
        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
          <p>Demo Admin: <strong>admin</strong> / <strong>alchemist2026</strong></p>
          <p style={{ marginTop: '0.25rem' }}>Demo Client: <strong>client</strong> / <strong>password123</strong></p>
        </div>
      </div>
    </section>
  );
}
