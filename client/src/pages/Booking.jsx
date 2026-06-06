import React, { useState, useEffect } from 'react';

export default function Booking({ user, navigate }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time_slot: '',
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
    const field = id.replace('client-', '');
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

    if (!formData.service) newErrors.service = 'Please select a service.';
    if (!formData.date) newErrors.date = 'Please choose a date.';
    if (!formData.time_slot) newErrors.time_slot = 'Please choose a preferred time slot.';

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

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Booking failed on server');
      }

      setSuccess(true);
      setLoading(false);

      // WhatsApp Redirect
      const text = `*Alchemist Makeover Appointment Request*
---------------------------------------
*Name:* ${formData.name.trim()}
*WhatsApp:* ${formData.phone.trim()}
*Email:* ${formData.email.trim() || 'N/A'}
*Service Chosen:* ${formData.service}
*Preferred Date:* ${formData.date}
*Preferred Time:* ${formData.time_slot}
*Special Requests:* ${formData.notes.trim() || 'None'}`;

      const waUrl = `https://wa.me/919080221527?text=${encodeURIComponent(text)}`;
      
      // Delay slightly so user sees success and then redirect
      setTimeout(() => {
        window.open(waUrl, '_blank');
        if (user) {
          navigate('/dashboard');
        } else {
          setFormData({ name: '', phone: '', email: '', service: '', date: '', time_slot: '', notes: '' });
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
        <div className="booking-split-container">
          
          {/* Left Column: Editorial */}
          <div className="booking-editorial-info">
            <div className="cultural-pattern cultural-pattern-nude"></div>
            
            <span className="signature-overlay">Bespoke Artistry</span>
            <h2>Reserve Your Slot</h2>
            <p>Step into a realm of customized elegance. Share your event details, and let us co-create an enchanting makeover that reflects your inner grandeur.</p>
            
            <div className="booking-steps">
              <div className="booking-step-item">
                <div className="booking-step-num">01</div>
                <div className="booking-step-text">
                  <h4>Provide Details</h4>
                  <p>Complete our premium booking form with your contact info, preferred date, and artistry service selection.</p>
                </div>
              </div>
              
              <div className="booking-step-item">
                <div className="booking-step-num">02</div>
                <div className="booking-step-text">
                  <h4>Instant Formatting</h4>
                  <p>Our intelligent system neatly formats your date and requirements into an elegant booking card.</p>
                </div>
              </div>
              
              <div className="booking-step-item">
                <div className="booking-step-num">03</div>
                <div className="booking-step-text">
                  <h4>WhatsApp Dispatch</h4>
                  <p>You are instantly redirected to WhatsApp to finalize custom details and secure your reservation slot with the artist.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="booking-form glass-panel">
            <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>Book Your Appointment</h3>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2.5rem', fontWeight: 300 }}>Provide your desired date and time slot. Bookings are saved to your account and forwarded to WhatsApp.</p>
            
            {success ? (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--accent-gold-dark)' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}></i>
                <h3>Appointment Stored Successfully!</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Opening WhatsApp to coordinate details with Bharathi...</p>
              </div>
            ) : (
              <form id="whatsapp-booking-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  
                  {/* Name */}
                  <div className="form-group">
                    <label htmlFor="client-name" className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      id="client-name" 
                      className="form-input" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="e.g., Ananya Sen" 
                      required
                    />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                  </div>

                  {/* WhatsApp Phone */}
                  <div className="form-group">
                    <label htmlFor="client-phone" className="form-label">WhatsApp Number *</label>
                    <input 
                      type="tel" 
                      id="client-phone" 
                      className="form-input" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="e.g., 9876543210" 
                      required
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="client-email" className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      id="client-email" 
                      className="form-input" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="e.g., ananya@example.com"
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>

                  {/* Artistry Service */}
                  <div className="form-group">
                    <label htmlFor="client-service" className="form-label">Artistry Service *</label>
                    <select 
                      id="client-service" 
                      className="form-input" 
                      value={formData.service} 
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>-- Choose Service --</option>
                      <option value="Bridal Artistry Makeover">Bridal Artistry Makeover</option>
                      <option value="Engagement & Pre-wedding Glam">Engagement &amp; Pre-wedding Glam</option>
                      <option value="Celebrity & Editorial Artistry">Celebrity &amp; Editorial Artistry</option>
                      <option value="Party & Occasion Glamour">Party &amp; Occasion Glamour</option>
                      <option value="Hair Styling & Saree Draping">Hair Styling &amp; Saree Draping</option>
                    </select>
                    {errors.service && <span className="error-msg">{errors.service}</span>}
                  </div>

                  {/* Date */}
                  <div className="form-group">
                    <label htmlFor="client-date" className="form-label">Preferred Date *</label>
                    <input 
                      type="date" 
                      id="client-date" 
                      className="form-input" 
                      value={formData.date} 
                      onChange={handleChange}
                      required
                    />
                    {errors.date && <span className="error-msg">{errors.date}</span>}
                  </div>

                  {/* Time Slot */}
                  <div className="form-group">
                    <label htmlFor="client-time" className="form-label">Time Slot *</label>
                    <select 
                      id="client-time" 
                      className="form-input" 
                      value={formData.time_slot} 
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>-- Choose Time Slot --</option>
                      <option value="Early Morning (06:00 AM - 09:00 AM)">Early Morning (06:00 AM - 09:00 AM)</option>
                      <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                      <option value="Late Afternoon (03:00 PM - 06:00 PM)">Late Afternoon (03:00 PM - 06:00 PM)</option>
                      <option value="Evening (06:00 PM - 09:00 PM)">Evening (06:00 PM - 09:00 PM)</option>
                    </select>
                    {errors.time_slot && <span className="error-msg">{errors.time_slot}</span>}
                  </div>

                  {/* Special Notes */}
                  <div className="form-group full-width">
                    <label htmlFor="client-notes" className="form-label">Special Notes / Venue / Specific Requests</label>
                    <textarea 
                      id="client-notes" 
                      className="form-input" 
                      value={formData.notes} 
                      onChange={handleChange}
                      placeholder="Tell us about your theme, custom requirements, event venue..."
                    ></textarea>
                  </div>

                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  {loading ? 'Confirming...' : (
                    <>
                      <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.25rem', marginRight: '0.6rem' }}></i> Confirm &amp; Dispatch to WhatsApp
                    </>
                  )}
                </button>
                
                <div className="form-disclaimer">
                  <i className="fa-solid fa-lock" style={{ color: '#25D366' }}></i>
                  <span>No payment is taken here. You will finalize booking terms directly on WhatsApp.</span>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
