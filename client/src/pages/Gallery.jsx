import React, { useState, useEffect } from 'react';

export default function Gallery({ user, token, navigate }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  // Fetch gallery items from backend
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setItems(data);
      })
      .catch(err => console.error('Error fetching gallery:', err));
  }, []);

  // Filter items
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const openLightbox = (index) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setActiveLightboxIndex(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setActiveLightboxIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const activeItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section className="gallery-section section-dark">
      <div className="cultural-pattern cultural-pattern-dark"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header info */}
        <div className="booking-header" style={{ marginBottom: '2rem' }}>
          <span className="signature-overlay">Visual Alchemy</span>
          <span className="section-subtitle" style={{ display: 'block' }}>Creative Portfolio</span>
          <h1>Artistry Gallery</h1>
          <p>Step into our visual universe. Browse a curated gallery of high-definition photoshoot portfolios, client transformations, and close-up makeup motion reels.</p>
        </div>

        {/* Gallery Filters */}
        <div className="portfolio-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            Show All
          </button>
          <button 
            className={`filter-btn ${filter === 'photo' ? 'active' : ''}`} 
            onClick={() => setFilter('photo')}
          >
            Photos Only
          </button>
          <button 
            className={`filter-btn ${filter === 'video' ? 'active' : ''}`} 
            onClick={() => setFilter('video')}
          >
            Videos Only
          </button>
          
          <button 
            className="filter-btn owner-entry-btn" 
            onClick={() => {
              if (user && user.role === 'admin') navigate('/admin');
              else navigate('/login');
            }}
            aria-label="Open owner gallery access"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <i className="fa-solid fa-lock"></i>
            {user?.role === 'admin' ? 'Manage' : 'Owner'}
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid" id="gallery-grid">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id}
              className="gallery-card tilt-card" 
              onClick={() => openLightbox(index)}
            >
              <div className="tilt-card-inner" style={{ height: '100%' }}>
                <div className="gallery-media">
                  {item.type === 'video' ? (
                    <>
                      <span className="gallery-play-btn"><i className="fa-solid fa-play"></i></span>
                      <img 
                        src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400" 
                        alt={item.title}
                        style={{ opacity: 0.75 }}
                      />
                    </>
                  ) : (
                    <img 
                      src={item.url.startsWith('/uploads/') ? item.url : item.url} 
                      alt={item.title} 
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'}
                    />
                  )}
                </div>
                <div className="gallery-overlay">
                  <span className="gallery-tag">
                    <i className={item.type === 'video' ? 'fa-solid fa-video' : 'fa-solid fa-camera'}></i> 
                    {item.type === 'video' ? ' Video Reel' : ' Photosheet'}
                  </span>
                  <h3 className="gallery-title">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="lightbox active" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          <button className="lightbox-nav lightbox-prev" onClick={prevSlide} aria-label="Previous media">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          
          <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-content">
              {activeItem.type === 'video' ? (
                // If it is a video (either external link like youtube/instagram or uploaded file)
                activeItem.url.includes('instagram.com') || activeItem.url.includes('reel') ? (
                  <iframe 
                    className="instagram-reel-frame"
                    src={`${activeItem.url.split('?')[0]}embed`} 
                    style={{ width: 'min(420px, 82vw)', height: 'min(640px, 62vh)', border: 0 }}
                    allowFullScreen
                    title={activeItem.title}
                  ></iframe>
                ) : (
                  <video 
                    src={activeItem.url} 
                    controls 
                    autoPlay
                    style={{ maxWidth: '100%', maxHeight: '60vh' }}
                  ></video>
                )
              ) : (
                <img 
                  src={activeItem.url} 
                  alt={activeItem.title} 
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'}
                />
              )}
            </div>
            
            <div className="lightbox-caption">
              <h4>{activeItem.title}</h4>
              <p>{activeItem.description}</p>
            </div>
          </div>

          <button className="lightbox-nav lightbox-next" onClick={nextSlide} aria-label="Next media">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
}
