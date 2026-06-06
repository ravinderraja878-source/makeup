import React, { useState, useEffect } from 'react';

export default function Academy({ user, navigate }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    mode: '',
    course: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-fill logged-in user profile details
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Map id to field name
    const field = id.replace('academy-', '');
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'WhatsApp number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit WhatsApp number.';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!formData.mode) newErrors.mode = 'Please select a preferred mode.';
    if (!formData.course) newErrors.course = 'Please select a course program.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        user_id: user ? user.id : null,
        ...formData
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Registration failed on server');
      }

      setSuccess(true);
      setLoading(false);

      // WhatsApp Redirect
      const text = `*Alchemist Makeover Academy Registration*
---------------------------------------
*Name:* ${formData.name.trim()}
*WhatsApp:* ${formData.phone.trim()}
*Email:* ${formData.email.trim() || 'N/A'}
*Mode:* ${formData.mode}
*Course Chosen:* ${formData.course}
*Bio / Experience:* ${formData.notes.trim() || 'None'}`;

      const waUrl = `https://wa.me/919080221527?text=${encodeURIComponent(text)}`;
      
      // Delay slightly so user sees success and then redirect
      setTimeout(() => {
        window.open(waUrl, '_blank');
        if (user) {
          navigate('/dashboard');
        } else {
          setFormData({ name: '', phone: '', email: '', mode: '', course: '', notes: '' });
          setSuccess(false);
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      alert('Something went wrong during submission. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="booking-section section-dark">
      <div className="cultural-pattern cultural-pattern-dark"></div>
      
      <div className="container">
        {/* Title Header for Academy */}
        <div className="booking-header" style={{ marginBottom: '3.5rem' }}>
          <span className="signature-overlay">Enhance • Empower • Evolve</span>
          <span className="section-subtitle" style={{ marginTop: '0.5rem', display: 'block' }}>Transformative Education</span>
          <h1 style={{ marginTop: '0.25rem' }}>Alchemist Makeover Academy</h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', color: 'var(--text-secondary)', fontWeight: 300 }}>Step into a luxurious learning experience. Empowering women with professional makeup artistry, elegant grooming etiquette, and the self-confidence to carry themselves with supreme poise in every sphere of life.</p>
        </div>

        <div className="booking-split-container">
          
          {/* Left Column: Details & Collages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            <div className="about-visual tilt-card">
              <div className="luxury-graphic tilt-card-inner" style={{ height: '100%' }}>
                <div className="luxury-pattern"></div>
                <img 
                  src="/assets/training.jpg" 
                  alt="Bharathi Conducting Training Sessions" 
                  style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800'}
                />
                <div className="luxury-avatar-glow" style={{ background: 'radial-gradient(circle, rgba(197, 160, 89, 0.25) 0%, transparent 70%)' }}></div>
                <div className="luxury-art-title" style={{ bottom: '25px', position: 'absolute', width: '100%', textShadow: '2px 2px 8px rgba(0,0,0,0.4)', fontSize: '1.6rem', letterSpacing: '2px' }}>Academy Workshop Diaries</div>
              </div>
            </div>

            {/* Academy Details */}
            <div className="glass-panel" style={{ padding: '2.5rem 2rem', borderColor: 'rgba(197, 160, 89, 0.12)', position: 'relative', borderRadius: '12px' }}>
              <div className="cultural-pattern cultural-pattern-nude" style={{ opacity: 0.02 }}></div>
              
              <h3 style={{ color: 'var(--accent-gold-dark)', fontSize: '1.45rem', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-graduation-cap"></i> Exclusive Training Programmes
              </h3>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '0.98rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-solid fa-sparkles" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.85rem', marginTop: '0.35rem' }}></i>
                  <strong>Luxury Bridal &amp; Party Makeovers</strong>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '0.98rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-solid fa-sparkles" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.85rem', marginTop: '0.35rem' }}></i>
                  <strong>Professional Makeup &amp; Self-Grooming Classes</strong>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '0.98rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-solid fa-sparkles" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.85rem', marginTop: '0.35rem' }}></i>
                  <strong>Elegant Hair Styling &amp; Saree Draping</strong>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '0.98rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-solid fa-sparkles" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.85rem', marginTop: '0.35rem' }}></i>
                  <strong>Saree Pre-Pleating &amp; Box Folding Mastery</strong>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '0.98rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-solid fa-sparkles" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.85rem', marginTop: '0.35rem' }}></i>
                  <strong>Personality &amp; Confidence Development Sessions</strong>
                </li>
              </ul>

              <h3 style={{ color: 'var(--accent-gold-dark)', fontSize: '1.35rem', fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>
                <i className="fa-solid fa-sparkles"></i> Designed for Self-Empowerment
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>Every session is thoughtfully curated to help women master essential personal assets:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.8rem' }}></i> Confidence in Public Presentation</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.8rem' }}></i> Graceful Communication &amp; Etiquette</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.8rem' }}></i> Elegant Self-Grooming Skills</div>
              </div>

              {/* Contact Box */}
              <div style={{ background: 'rgba(168, 116, 104, 0.04)', border: '1px solid rgba(168, 116, 104, 0.15)', padding: '1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-gold-dark)', width: '16px' }}></i>
                  <span>Exclusive Training &amp; Makeover Services</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-solid fa-phone" style={{ color: 'var(--accent-gold-dark)', width: '16px' }}></i>
                  <span>Bharathi – <strong>9080221527</strong></span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Registration Form */}
          <div className="booking-form glass-panel" style={{ height: 'auto', alignSelf: 'start' }}>
            <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>Academy Registration</h3>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2.5rem', fontWeight: 300 }}>Please share your background details and course choice. Your structured details will automatically launch on WhatsApp for slot reservation.</p>
            
            {success ? (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--accent-gold-dark)' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}></i>
                <h3>Registration Stored Successfully!</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Opening WhatsApp to complete slot reservation with Bharathi...</p>
              </div>
            ) : (
              <form id="academy-booking-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  
                  {/* Name */}
                  <div className="form-group">
                    <label htmlFor="academy-name" className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      id="academy-name" 
                      className="form-input" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="e.g., Harini Krishnan" 
                      required
                    />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                  </div>

                  {/* WhatsApp Phone */}
                  <div className="form-group">
                    <label htmlFor="academy-phone" className="form-label">WhatsApp Number *</label>
                    <input 
                      type="tel" 
                      id="academy-phone" 
                      className="form-input" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="10-digit number" 
                      required
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="academy-email" className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      id="academy-email" 
                      className="form-input" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="e.g., harini@example.com"
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>

                  {/* Mode of Session */}
                  <div className="form-group">
                    <label htmlFor="academy-mode" className="form-label">Session Mode *</label>
                    <select 
                      id="academy-mode" 
                      className="form-input" 
                      value={formData.mode} 
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>-- Select Mode --</option>
                      <option value="Offline (Exclusive In-Person Academy)">Offline (In-Person)</option>
                      <option value="Online (Interactive Live Sessions)">Online (Live)</option>
                      <option value="Flexible Mode (Blended Learning)">Flexible / Blended</option>
                    </select>
                    {errors.mode && <span className="error-msg">{errors.mode}</span>}
                  </div>

                  {/* Course Choice */}
                  <div className="form-group full-width">
                    <label htmlFor="academy-course" className="form-label">Select Course Program *</label>
                    <select 
                      id="academy-course" 
                      className="form-input" 
                      value={formData.course} 
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>-- Choose Course --</option>
                      <option value="Self-Grooming & Makeup Classes">Professional Makeup &amp; Self-Grooming Classes</option>
                      <option value="Bridal & Party Makeovers Training">Luxury Bridal &amp; Party Makeovers Training</option>
                      <option value="Hair Styling & Saree Draping Mastery">Elegant Hair Styling &amp; Saree Draping Mastery</option>
                      <option value="Pre-Pleating & Box Folding Workshop">Saree Pre-Pleating &amp; Box Folding Workshop</option>
                      <option value="Personality & Confidence Development">Personality Development &amp; Confidence Sessions</option>
                      <option value="Soft Skills & Etiquette Training">Soft Skills &amp; Social Etiquette Training</option>
                      <option value="All-in-One Exclusive Mastery Masterclass">All-in-One Premium Masterclass</option>
                    </select>
                    {errors.course && <span className="error-msg">{errors.course}</span>}
                  </div>

                  {/* Bio & Experience */}
                  <div className="form-group full-width">
                    <label htmlFor="academy-notes" className="form-label">Tell Us About Yourself / Your Goals</label>
                    <textarea 
                      id="academy-notes" 
                      className="form-input" 
                      value={formData.notes} 
                      onChange={handleChange}
                      placeholder="Introduce yourself! Share your goals, interests, or prior experience..." 
                      style={{ minHeight: '140px' }}
                    ></textarea>
                  </div>

                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem', padding: '1rem 1.5rem' }}
                >
                  {loading ? 'Submitting...' : (
                    <>
                      <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.25rem', marginRight: '0.6rem' }}></i> Request Academy Admission
                    </>
                  )}
                </button>
                
                <div className="form-disclaimer">
                  <i className="fa-solid fa-lock" style={{ color: 'var(--accent-gold-dark)' }}></i>
                  <span>No fees are charged here. Direct slot finalization on WhatsApp.</span>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
