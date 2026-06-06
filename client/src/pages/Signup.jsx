import React, { useState } from 'react';

export default function Signup({ navigate }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password) {
      setError('Username and password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email format.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || 'Registration failed.');
        return;
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="cultural-pattern cultural-pattern-nude"></div>
      
      <div className="auth-card glass-panel" style={{ maxWidth: '520px' }}>
        <span className="signature-overlay" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>Create Account</span>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Join Alchemist</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>Register to track your custom makeup appointments and training admissions.</p>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', color: '#DC2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i> {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.2)', color: '#059669', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }}></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="username">Username *</label>
            <input 
              type="text" 
              id="username" 
              className="form-input" 
              placeholder="Create username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              placeholder="e.g., harini@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="password">Password *</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              placeholder="Create secure password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="confirm-password">Confirm Password *</label>
            <input 
              type="password" 
              id="confirm-password" 
              className="form-input" 
              placeholder="Verify password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', borderRadius: '8px', padding: '0.95rem' }}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          Already have an account? 
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </div>
    </section>
  );
}
