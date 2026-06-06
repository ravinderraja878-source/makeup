import React, { useState, useEffect } from 'react';

export default function ClientDashboard({ user, token, logout, navigate }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    setLoading(true);
    // Fetch bookings & registrations concurrently
    Promise.all([
      fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/registrations', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
    ])
    .then(([bookingsData, registrationsData]) => {
      setBookings(bookingsData);
      setRegistrations(registrationsData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    });
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-badge status-pending';
      case 'confirmed': return 'status-badge status-confirmed';
      case 'enrolled': return 'status-badge status-enrolled';
      case 'contacted': return 'status-badge status-contacted';
      case 'cancelled': return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  return (
    <section className="dashboard-section">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <span className="section-subtitle">Client Portal</span>
            <h1>Welcome, {user?.username}</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/booking')} style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>New Booking</button>
            <button className="btn btn-primary" onClick={() => navigate('/academy')} style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Join Academy</button>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="profile-card glass-panel">
            <div className="profile-avatar">
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.25rem' }}>{user?.username}</h3>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-gold-dark)', fontWeight: 600 }}>{user?.role} account</span>
            
            <div className="profile-info">
              <div className="profile-field">
                <strong>Username</strong>
                <span>{user?.username}</span>
              </div>
              <div className="profile-field">
                <strong>Email Address</strong>
                <span>{user?.email || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>Member Since</strong>
                <span>{formatDate(user?.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Activity Center */}
          <div className="activity-center">
            {/* Tabs */}
            <div className="dashboard-tabs">
              <button 
                className={`dashboard-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings ({bookings.length})
              </button>
              <button 
                className={`dashboard-tab-btn ${activeTab === 'academy' ? 'active' : ''}`}
                onClick={() => setActiveTab('academy')}
              >
                Academy Applications ({registrations.length})
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-spinner fa-spin-pulse" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                <p>Retrieving your records...</p>
              </div>
            ) : activeTab === 'bookings' ? (
              bookings.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}></i>
                  <h4>No Appointments Booked</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>You have not requested any makeovers yet.</p>
                  <button className="btn btn-secondary" onClick={() => navigate('/booking')} style={{ fontSize: '0.8rem', padding: '0.6rem 1.5rem' }}>Request Makeover Slot</button>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Preferred Date</th>
                        <th>Time Slot</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.service}</td>
                          <td>{formatDate(booking.date)}</td>
                          <td>{booking.time_slot}</td>
                          <td>
                            <span className={getStatusClass(booking.status)}>{booking.status}</span>
                          </td>
                          <td style={{ fontSize: '0.85rem', fontStyle: 'italic', maxWidth: '250px', overflowWrap: 'break-word' }}>
                            {booking.notes || 'No comments'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              registrations.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <i className="fa-solid fa-graduation-cap" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}></i>
                  <h4>No Academy Registrations</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>You haven't requested admission to any courses.</p>
                  <button className="btn btn-secondary" onClick={() => navigate('/academy')} style={{ fontSize: '0.8rem', padding: '0.6rem 1.5rem' }}>View Course Catalog</button>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Session Mode</th>
                        <th>Application Date</th>
                        <th>Status</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map(reg => (
                        <tr key={reg.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{reg.course}</td>
                          <td>{reg.mode}</td>
                          <td>{formatDate(reg.created_at)}</td>
                          <td>
                            <span className={getStatusClass(reg.status)}>{reg.status}</span>
                          </td>
                          <td style={{ fontSize: '0.85rem', fontStyle: 'italic', maxWidth: '250px', overflowWrap: 'break-word' }}>
                            {reg.notes || 'Under review'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
