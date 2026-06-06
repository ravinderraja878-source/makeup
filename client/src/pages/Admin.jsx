import React, { useState, useEffect } from 'react';

export default function Admin({ user, token, logout, navigate }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadType, setUploadType] = useState('photo');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Load Admin Data
  useEffect(() => {
    if (!token) return;
    loadDashboardData();
  }, [token, activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const res = await fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        setBookings(data);
      } else if (activeTab === 'academy') {
        const res = await fetch('/api/registrations', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        setRegistrations(data);
      } else if (activeTab === 'gallery') {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        setGalleryItems(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
      setLoading(false);
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      } else {
        alert('Failed to update booking status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const handleRegistrationStatusChange = async (regId, newStatus) => {
    try {
      const res = await fetch(`/api/registrations/${regId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: newStatus } : r));
      } else {
        alert('Failed to update registration status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const handleFileUpload = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      setUploadStatus('Please provide a title and select a media file.');
      return;
    }

    setUploadStatus('');
    setUploadLoading(true);

    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('description', uploadDesc);
    formData.append('type', uploadType);
    formData.append('mediaFile', uploadFile);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      setUploadLoading(false);

      if (res.ok) {
        setUploadStatus('Media added to gallery successfully!');
        setUploadTitle('');
        setUploadDesc('');
        setUploadFile(null);
        // Reset file input element
        document.getElementById('owner-media-file').value = '';
        loadDashboardData(); // Reload items
      } else {
        setUploadStatus(data.message || 'Failed to upload media.');
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('Error uploading file to server.');
      setUploadLoading(false);
    }
  };

  const handleDeleteMedia = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return;

    try {
      const res = await fetch(`/api/gallery/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setGalleryItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        alert('Failed to delete gallery item.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  return (
    <section className="dashboard-section">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <span className="section-subtitle">Owner Panel</span>
            <h1>Alchemist Executive Center</h1>
          </div>
          <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Log Out</button>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs" style={{ marginBottom: '2.5rem' }}>
          <button 
            className={`dashboard-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings ({bookings.length})
          </button>
          <button 
            className={`dashboard-tab-btn ${activeTab === 'academy' ? 'active' : ''}`}
            onClick={() => setActiveTab('academy')}
          >
            Academy Registrations ({registrations.length})
          </button>
          <button 
            className={`dashboard-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery Portfolio ({galleryItems.length})
          </button>
        </div>

        {/* Dashboard content loaders */}
        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin-pulse" style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}></i>
            <p>Loading administration data...</p>
          </div>
        ) : activeTab === 'bookings' ? (
          /* Bookings List */
          bookings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}></i>
              <h4>No Bookings Received</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Bookings submitted by users will appear here.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Phone</th>
                    <th>Artistry Service</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th>Special Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {b.name}
                        {b.email && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{b.email}</span>}
                      </td>
                      <td>
                        <a href={`https://wa.me/91${b.phone}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-dark)', fontWeight: 500 }}>
                          <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> {b.phone}
                        </a>
                      </td>
                      <td>{b.service}</td>
                      <td>{formatDate(b.date)}</td>
                      <td>{b.time_slot}</td>
                      <td>
                        <select 
                          className="table-select" 
                          value={b.status} 
                          onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '0.85rem', fontStyle: 'italic', maxWidth: '200px', overflowWrap: 'break-word' }}>
                        {b.notes || 'No comments'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'academy' ? (
          /* Academy Registrations */
          registrations.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <i className="fa-solid fa-graduation-cap" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}></i>
              <h4>No Registrations Received</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Student admissions requested on the Academy page appear here.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Phone</th>
                    <th>Course Program</th>
                    <th>Preferred Mode</th>
                    <th>Registered At</th>
                    <th>Status</th>
                    <th>Student Goals / Bio</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(r => (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {r.name}
                        {r.email && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{r.email}</span>}
                      </td>
                      <td>
                        <a href={`https://wa.me/91${r.phone}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-dark)', fontWeight: 500 }}>
                          <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> {r.phone}
                        </a>
                      </td>
                      <td>{r.course}</td>
                      <td>{r.mode}</td>
                      <td>{formatDate(r.created_at)}</td>
                      <td>
                        <select 
                          className="table-select" 
                          value={r.status} 
                          onChange={(e) => handleRegistrationStatusChange(r.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '0.85rem', fontStyle: 'italic', maxWidth: '200px', overflowWrap: 'break-word' }}>
                        {r.notes || 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Gallery Media Management */
          <div>
            {/* Owner Upload Panel */}
            <div className="owner-media-manager glass-panel">
              <div className="owner-media-heading">
                <div>
                  <span className="section-subtitle">Interactive Admin</span>
                  <h2>Upload Gallery Artistry</h2>
                </div>
              </div>

              <form onSubmit={handleMediaSubmit}>
                <div className="owner-form-grid">
                  
                  {/* File Upload */}
                  <div className="owner-field">
                    <span>Photo or Video File *</span>
                    <input 
                      type="file" 
                      id="owner-media-file" 
                      accept="image/*,video/*" 
                      onChange={handleFileUpload} 
                      required 
                    />
                  </div>

                  {/* Title */}
                  <div className="owner-field">
                    <span>Title *</span>
                    <input 
                      type="text" 
                      placeholder="e.g., Silk Saree Bridal Glow" 
                      maxLength="80" 
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      required 
                    />
                  </div>

                  {/* Media Type */}
                  <div className="owner-field">
                    <span>Media Type *</span>
                    <select 
                      value={uploadType} 
                      onChange={(e) => setUploadType(e.target.value)}
                    >
                      <option value="photo">Photo / Image</option>
                      <option value="video">Video / Reel</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="owner-field owner-field-wide">
                    <span>Caption / Description</span>
                    <textarea 
                      rows="3" 
                      placeholder="A short caption for the public gallery lightbox..." 
                      maxLength="180"
                      value={uploadDesc}
                      onChange={(e) => setUploadDesc(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="owner-actions">
                  <span className="owner-upload-status" style={{ color: uploadStatus.includes('success') ? '#059669' : '#DC2626' }}>
                    {uploadStatus}
                  </span>
                  <button className="btn btn-primary" type="submit" disabled={uploadLoading} style={{ padding: '0.8rem 2rem', fontSize: '0.8rem' }}>
                    {uploadLoading ? 'Uploading...' : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            </div>

            {/* Gallery Media Grid list */}
            {galleryItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                <p>No media found in the database. Upload a file above to add to the gallery.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Media File</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Uploaded On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryItems.map(item => (
                      <tr key={item.id}>
                        <td>
                          {item.type === 'video' ? (
                            <div style={{ width: '60px', height: '60px', borderRadius: '4px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold-dark)' }}>
                              <i className="fa-solid fa-circle-play" style={{ fontSize: '1.5rem' }}></i>
                            </div>
                          ) : (
                            <img 
                              src={item.url} 
                              alt={item.title} 
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'}
                            />
                          )}
                        </td>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {item.title}
                          {item.description && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{item.description}</span>}
                        </td>
                        <td>
                          <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>{item.type}</span>
                        </td>
                        <td>{formatDate(item.created_at)}</td>
                        <td>
                          <button 
                            className="owner-delete-btn" 
                            onClick={() => handleDeleteMedia(item.id)}
                          >
                            <i className="fa-solid fa-trash-can" style={{ marginRight: '0.4rem' }}></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
