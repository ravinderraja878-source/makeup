import React from 'react';

export default function Home({ navigate }) {
  const imageFallback = (e, fallbackUrl) => {
    e.target.src = fallbackUrl;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero section-dark" id="home">
        <div className="cultural-pattern cultural-pattern-dark"></div>
        
        {/* Realistic Floating 3D Gold Compact Asset */}
        <div className="floating-3d-asset floating-asset-1">
          <svg viewBox="0 0 100 100" width="90" height="90">
            <defs>
              <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E2C288"/>
                <stop offset="60%" stopColor="#C5A059"/>
                <stop offset="100%" stopColor="#8E6D31"/>
              </radialGradient>
              <linearGradient id="mirror-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
                <stop offset="30%" stopColor="#C5A059" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="53" r="42" fill="rgba(0,0,0,0.15)"/>
            <circle cx="50" cy="50" r="42" fill="url(#gold-grad)" stroke="#FAF6F0" strokeWidth="1.5"/>
            <circle cx="50" cy="50" r="34" fill="#1C1B19" stroke="#8E6D31" strokeWidth="1"/>
            <circle cx="50" cy="50" r="28" fill="url(#mirror-grad)"/>
            <polygon points="50,40 53,50 47,50" fill="#FAF6F0" opacity="0.6"/>
            <circle cx="50" cy="53" r="3.5" fill="#C5A059"/>
          </svg>
        </div>

        <div className="container hero-content">
          <span className="signature-overlay">Art of Transformation</span>
          <div className="hero-tag" style={{ marginTop: '1rem' }}>Empowering Your True Radiance</div>
          <h1 className="hero-title" style={{ marginTop: '0.5rem' }}>Crafting Elegant<br/><span className="gold-text">Makeover Transformations</span></h1>
          <p className="hero-desc">Discover the premium alchemy of beauty. Specializing in luxurious bridal artistry, engagement glamour, and modern editorial styling tailored to reveal your unique brilliance.</p>
          <div className="hero-actions">
            <span className="btn btn-primary" onClick={() => navigate('/booking')}>Book Your Slot</span>
            <span className="btn btn-secondary" onClick={() => navigate('/gallery')}>Explore Work</span>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="about section-nude" id="about">
        <div className="cultural-pattern cultural-pattern-nude"></div>

        {/* Realistic Floating 3D Cosmetic Jar Asset */}
        <div className="floating-3d-asset floating-asset-2">
          <svg viewBox="0 0 100 100" width="90" height="90">
            <defs>
              <linearGradient id="rose-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF6F0"/>
                <stop offset="40%" stopColor="#E2C288"/>
                <stop offset="100%" stopColor="#8E6D31"/>
              </linearGradient>
            </defs>
            <rect x="18" y="32" width="64" height="48" rx="8" fill="rgba(0,0,0,0.1)"/>
            <rect x="15" y="30" width="70" height="48" rx="8" fill="url(#rose-gold)" stroke="#FAF6F0" strokeWidth="1"/>
            <rect x="22" y="16" width="56" height="14" rx="3" fill="#1C1B19" stroke="#C5A059" strokeWidth="2"/>
            <line x1="30" y1="23" x2="70" y2="23" stroke="#FAF6F0" strokeWidth="1" opacity="0.5"/>
            <circle cx="50" cy="54" r="14" fill="#FAF6F0" opacity="0.8"/>
          </svg>
        </div>

        <div className="container">
          <div className="about-grid">
            <div className="about-visual" style={{ border: '1px solid var(--accent-gold-dark)' }}>
              <div className="luxury-graphic">
                <div className="luxury-pattern"></div>
                <img 
                  src="/assets/bridal.png" 
                  alt="Bridal Transformation Showcase" 
                  style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                  onError={(e) => imageFallback(e, 'https://images.unsplash.com/photo-1607513746990-21b36fcfb2f2?w=800')}
                />
                <div className="luxury-avatar-glow"></div>
                <div className="luxury-art-title" style={{ bottom: '30px', position: 'absolute', width: '100%', textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>Modern Elegance</div>
              </div>
            </div>
            <div className="about-content">
              <span className="signature-overlay" style={{ textAlign: 'left', marginLeft: 0, marginBottom: '0.85rem', lineHeight: 1.22, transform: 'none' }}>Makeup Artistry</span>
              <div className="section-title-wrapper" style={{ textAlign: 'left', marginBottom: '2rem', marginTop: '0.5rem' }}>
                <span className="section-subtitle">Our Philosophy</span>
                <h2 className="section-title" style={{ display: 'block', paddingBottom: '1rem', fontSize: '2.2rem', marginTop: '0.25rem' }}>The Alchemy of Beauty</h2>
              </div>
              <p className="about-text" style={{ color: 'var(--text-dark-muted)' }}>
                At Alchemist Makeover Artistry, we believe that makeup is not about masking who you are, but about refining your raw features into an elegant, luminous statement of confidence. Led by master techniques and high-end luxury products, we blend timeless classical artistry with modern aesthetics.
              </p>
              <p className="about-text" style={{ marginBottom: '2.5rem', color: 'var(--text-dark-muted)' }}>
                Every single look is curated to match your skin's anatomy, your personal style statement, and the lighting architecture of your occasion.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <span className="feature-icon"><i className="fa-solid fa-gem"></i></span>
                  <div className="feature-text">
                    <h4 style={{ color: 'var(--text-dark)' }}>Premium Products</h4>
                    <p style={{ color: 'var(--text-dark-muted)' }}>Only the finest global brands for long-lasting, flawless HD results.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></span>
                  <div className="feature-text">
                    <h4 style={{ color: 'var(--text-dark)' }}>Personalized Care</h4>
                    <p style={{ color: 'var(--text-dark-muted)' }}>Curated color consulting tailored perfectly to your undertone.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section" id="founder" style={{ padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
        <div className="cultural-pattern cultural-pattern-dark"></div>
        
        {/* Floating Gold Palette Icon */}
        <div className="floating-3d-asset" style={{ top: '30%', right: '5%', transform: 'translateY(0)' }}>
          <svg viewBox="0 0 100 100" width="70" height="70">
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2C288"/>
                <stop offset="50%" stopColor="#C5A059"/>
                <stop offset="100%" stopColor="#8E6D31"/>
              </linearGradient>
            </defs>
            <path d="M15,50 C15,25 35,15 60,15 C85,15 85,35 85,50 C85,65 70,85 50,85 C30,85 15,75 15,50 Z" fill="url(#gold-gradient)" stroke="#FAF6F0" strokeWidth="1" opacity="0.15"/>
            <circle cx="35" cy="65" r="8" fill="#121212"/>
            <circle cx="45" cy="30" r="5" fill="#FAF6F0" opacity="0.8"/>
            <circle cx="60" cy="35" r="5" fill="#8E6D31"/>
            <circle cx="70" cy="50" r="5" fill="#C5A059"/>
            <circle cx="55" cy="60" r="5" fill="#F5EBE1"/>
          </svg>
        </div>

        <div className="container">
          <div className="about-grid" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
            {/* Founder Portrait (Left side) */}
            <div className="about-visual tilt-card" style={{ border: '1px solid var(--accent-gold-dark)', height: '520px', background: 'var(--bg-secondary)', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
              <div className="luxury-graphic tilt-card-inner" style={{ height: '100%' }}>
                <div className="luxury-pattern"></div>
                <img 
                  src="/assets/founder.png" 
                  alt="Bharathi - Founder" 
                  className="founder-img" 
                  onError={(e) => imageFallback(e, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800')}
                />
                <div className="luxury-avatar-glow"></div>
                <div className="luxury-art-title" style={{ bottom: '30px', position: 'absolute', width: '100%', textShadow: '2px 2px 8px rgba(0,0,0,0.4)', fontSize: '1.6rem', letterSpacing: '3px' }}>The Alchemist Visionary</div>
              </div>
            </div>

            {/* Founder Content (Right side) */}
            <div className="about-content" style={{ justifyContent: 'center' }}>
              <span className="signature-overlay" style={{ textAlign: 'left', marginLeft: 0, transform: 'none', marginBottom: '0.85rem', lineHeight: 1.22 }}>Bharathi</span>
              <div className="section-title-wrapper" style={{ textAlign: 'left', marginBottom: '2rem', marginTop: '0.5rem' }}>
                <span className="section-subtitle" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '2px' }}>Founder of Alchemist Makeover Artistry</span>
                <h2 className="section-title" style={{ display: 'block', paddingBottom: '1rem', fontSize: '2.2rem', marginTop: '0.5rem', lineHeight: 1.3 }}>Where Beauty, Confidence &amp; Elegance Come Together</h2>
              </div>
              <p className="about-text" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.02rem' }}>
                Bharathi is a passionate Beauty Artist, Grooming Mentor, and Personality Development Trainer dedicated to transforming not just appearances, but confidence and self-expression. Through Alchemist Makeover Artistry, she creates a luxurious learning experience designed to empower women with grace, sophistication, and poise.
              </p>
              <p className="about-text" style={{ marginBottom: '2.5rem', color: 'var(--text-secondary)', fontSize: '1.02rem' }}>
                With expertise in Beauty, Soft Skills, Communication, and Etiquette Training, Bharathi believes every woman deserves to feel confident, refined, and empowered in both personal and professional life.
              </p>
              
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="btn btn-primary" onClick={() => navigate('/booking')} style={{ padding: '0.8rem 2.2rem' }}>Book Consultation</span>
                <a href="https://wa.me/919080221527" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.8rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '1.1rem' }}></i> Chat with Founder
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services section-dark" id="services">
        <div className="cultural-pattern cultural-pattern-dark"></div>

        <div className="container">
          <div className="section-title-wrapper">
            <span className="signature-overlay">Bespoke Artistry</span>
            <span className="section-subtitle" style={{ display: 'block' }}>Where Beauty Meets Confidence</span>
            <h2 className="section-title">Alchemist Makeover Artistry</h2>
            <div className="services-intro">
              <p style={{ marginBottom: '1rem' }}>
                At Alchemist Makeover Artistry, we believe that every individual deserves to look and feel their absolute best. Our mission is to enhance natural beauty through professional artistry, personalized styling, and expert grooming services.
              </p>
              <p>
                We offer a wide range of beauty and makeover solutions tailored to suit every occasion and personality.
              </p>
            </div>
          </div>

          <div className="services-grid" style={{ position: 'relative', zIndex: 2 }}>
            {/* Service 1 */}
            <div className="service-card glass-panel tilt-card">
              <div className="tilt-card-inner">
                <div className="service-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                <h3>Professional Makeup</h3>
                <ul className="service-list">
                  <li>Bridal Makeup</li>
                  <li>Engagement &amp; Reception Makeup</li>
                  <li>Party Makeup</li>
                  <li>HD &amp; Airbrush Makeup</li>
                  <li>Fashion &amp; Photoshoot Makeup</li>
                </ul>
                <span className="btn-text" onClick={() => navigate('/booking')}>Select Service <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '0.75rem', marginLeft: '0.2rem' }}></i></span>
              </div>
            </div>
            
            {/* Service 2 */}
            <div className="service-card glass-panel tilt-card">
              <div className="tilt-card-inner">
                <div className="service-icon"><i className="fa-solid fa-scissors"></i></div>
                <h3>Hair Styling</h3>
                <ul className="service-list">
                  <li>Bridal Hair Styling</li>
                  <li>Party Hairstyles</li>
                  <li>Curls, Buns &amp; Trendy Updos</li>
                  <li>Hair Accessories Styling</li>
                </ul>
                <span className="btn-text" onClick={() => navigate('/booking')}>Select Service <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '0.75rem', marginLeft: '0.2rem' }}></i></span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="service-card glass-panel tilt-card">
              <div className="tilt-card-inner">
                <div className="service-icon"><i className="fa-solid fa-shirt"></i></div>
                <h3>Saree Draping</h3>
                <ul className="service-list">
                  <li>Traditional &amp; Contemporary Saree Draping</li>
                  <li>Bridal Saree Draping</li>
                  <li>Saree Pre-Pleating Services</li>
                  <li>Saree Draping Classes</li>
                </ul>
                <span className="btn-text" onClick={() => navigate('/booking')}>Select Service <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '0.75rem', marginLeft: '0.2rem' }}></i></span>
              </div>
            </div>

            {/* Service 4 */}
            <div className="service-card glass-panel tilt-card">
              <div className="tilt-card-inner">
                <div className="service-icon"><i className="fa-solid fa-hand-sparkles"></i></div>
                <h3>Nail Art &amp; Grooming</h3>
                <ul className="service-list">
                  <li>Basic Nail Care</li>
                  <li>Creative Nail Art Designs</li>
                  <li>Grooming and Beauty Enhancement Services</li>
                </ul>
                <span className="btn-text" onClick={() => navigate('/booking')}>Select Service <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '0.75rem', marginLeft: '0.2rem' }}></i></span>
              </div>
            </div>

            {/* Service 5 */}
            <div className="service-card glass-panel tilt-card">
              <div className="tilt-card-inner">
                <div className="service-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                <h3>Training Academy</h3>
                <ul className="service-list">
                  <li>Makeup Artistry Training</li>
                  <li>Hair Styling Classes</li>
                  <li>Saree Draping &amp; Pre-Pleating Workshops</li>
                  <li>Personal Grooming &amp; Soft Skills</li>
                </ul>
                <span className="btn-text" onClick={() => navigate('/academy')}>Select Service <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '0.75rem', marginLeft: '0.2rem' }}></i></span>
              </div>
            </div>

            {/* Service 6 */}
            <div className="service-card glass-panel tilt-card">
              <div className="tilt-card-inner">
                <div className="service-icon"><i className="fa-solid fa-person-walking"></i></div>
                <h3>Personality Grooming</h3>
                <ul className="service-list">
                  <li>Ramp Walk Training</li>
                  <li>Self-Grooming Sessions</li>
                  <li>Confidence Building</li>
                  <li>Personal Styling &amp; Presentation</li>
                </ul>
                <span className="btn-text" onClick={() => navigate('/booking')}>Select Service <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '0.75rem', marginLeft: '0.2rem' }}></i></span>
              </div>
            </div>
          </div>
          <p className="services-closing">
            At Alchemist Makeover Artistry, we combine creativity, professionalism, and passion to create stunning transformations while empowering individuals with the skills and confidence to shine in every aspect of life.
          </p>
        </div>
      </section>

      {/* Portfolio Lookbook Section */}
      <section className="portfolio section-nude" id="portfolio">
        <div className="cultural-pattern cultural-pattern-nude"></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-title-wrapper">
            <span className="signature-overlay">The Lookbook</span>
            <span className="section-subtitle" style={{ display: 'block' }}>Visual Masterpieces</span>
            <h2 className="section-title">The Artistry Portfolio</h2>
          </div>
          <div className="portfolio-grid">
            {/* Item 1 */}
            <div className="portfolio-item tilt-card">
              <div className="tilt-card-inner" style={{ height: '100%' }}>
                <div className="portfolio-graphic">
                  <img 
                    src="/assets/bridal.png" 
                    alt="Bridal Makeover" 
                    onError={(e) => imageFallback(e, 'https://images.unsplash.com/photo-1607513746990-21b36fcfb2f2?w=800')}
                  />
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-cat">Bridal Glamour</span>
                  <h3 className="portfolio-title">Timeless Crimson Bride</h3>
                  <p className="portfolio-desc">High-definition traditional bridal makeover with warm glowing accents and precise contouring.</p>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="portfolio-item tilt-card">
              <div className="tilt-card-inner" style={{ height: '100%' }}>
                <div className="portfolio-graphic">
                  <img 
                    src="/assets/party.png" 
                    alt="Party Makeover" 
                    onError={(e) => imageFallback(e, 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800')}
                  />
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-cat">Luminous Glamour</span>
                  <h3 className="portfolio-title">Radiating Timeless Elegance</h3>
                  <p className="portfolio-desc">Luminous, bronze-toned glam makeup with smoky eye details and sleek modern styling.</p>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="portfolio-item tilt-card">
              <div className="tilt-card-inner" style={{ height: '100%' }}>
                <div className="portfolio-graphic">
                  <img 
                    src="/assets/editorial.png" 
                    alt="Editorial Makeover" 
                    onError={(e) => imageFallback(e, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800')}
                  />
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-cat">Editorial &amp; Fashion</span>
                  <h3 className="portfolio-title">Soft Glam &amp; Royal Elegance</h3>
                  <p className="portfolio-desc">High-fashion copper graphic details with highly structured lighting alignment and glass skin finish.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Banner */}
      <section className="social-banner section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="cultural-pattern cultural-pattern-dark"></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="signature-overlay">Follow the Transformation</span>
          <h2 className="social-title">Behind the Scenes Glamour</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', fontWeight: 300 }}>
            Discover daily makeup inspiration, behind-the-scenes transformations, bridal diaries, and product reviews on our official Instagram feed.
          </p>
          <a href="https://www.instagram.com/alchemist_makeover_artistry?igsh=eGwzeHRpaDBuaHdj" target="_blank" rel="noopener noreferrer" className="btn social-btn">
            <i className="fa-brands fa-instagram" style={{ fontSize: '1.25rem' }}></i> @alchemist_makeover_artistry
          </a>
        </div>
      </section>
    </div>
  );
}
