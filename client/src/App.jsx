import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Academy from './pages/Academy';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import Admin from './pages/Admin';

export default function App() {
  // Simple state-based router
  const [route, setRoute] = useState(window.location.pathname);
  
  // Authentication states
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Monitor scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch current user details if token exists
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Session invalid');
      })
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error(err);
        logout();
      });
    } else {
      setUser(null);
    }
  }, [token]);

  // Navigate helper
  const navigate = (path) => {
    window.history.pushState(null, '', path);
    setRoute(path);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    navigate('/login');
  };

  // Render Page Switcher
  const renderPage = () => {
    switch (route) {
      case '/':
        return <Home navigate={navigate} />;
      case '/academy':
        return <Academy user={user} navigate={navigate} />;
      case '/booking':
        return <Booking user={user} navigate={navigate} />;
      case '/gallery':
        return <Gallery user={user} token={token} navigate={navigate} />;
      case '/login':
        return <Login login={login} navigate={navigate} />;
      case '/signup':
        return <Signup navigate={navigate} />;
      case '/dashboard':
        return token ? <ClientDashboard user={user} token={token} logout={logout} navigate={navigate} /> : <Login login={login} navigate={navigate} />;
      case '/admin':
        return token && user?.role === 'admin' ? <Admin user={user} token={token} logout={logout} navigate={navigate} /> : <Login login={login} navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sticky Premium Header */}
      <header id="header" className={scrolled ? 'scrolled' : ''}>
        <div className="container navbar">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/assets/logo.jpg" alt="Alchemist Logo" className="logo-img" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200'} />
            <div className="logo-text">
              ALCHEMIST
              <span>Makeover Artistry</span>
            </div>
          </div>
          
          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><span className={`nav-link ${route === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>Home</span></li>
            <li><span className={`nav-link ${route === '/academy' ? 'active' : ''}`} onClick={() => navigate('/academy')}>Academy</span></li>
            <li><span className={`nav-link ${route === '/gallery' ? 'active' : ''}`} onClick={() => navigate('/gallery')}>Gallery</span></li>
            
            {/* Conditional Routing for Dashboard / Auth */}
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <li><span className={`nav-link ${route === '/admin' ? 'active' : ''}`} onClick={() => navigate('/admin')}>Admin Panel</span></li>
                ) : (
                  <li><span className={`nav-link ${route === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>My Dashboard</span></li>
                )}
                <li><button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem', borderRadius: '4px' }}>Logout</button></li>
              </>
            ) : (
              <>
                <li><span className={`nav-link ${route === '/login' ? 'active' : ''}`} onClick={() => navigate('/login')}>Login</span></li>
                <li><span className="btn btn-secondary" onClick={() => navigate('/booking')} style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>Book Slot</span></li>
              </>
            )}
          </ul>

          <button className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer>
        <div class="container">
          <div class="footer-logo-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img src="/assets/logo.jpg" alt="Alchemist Logo" style={{ height: '85px', width: '85px', borderRadius: '50%', border: '1px solid rgba(197, 160, 89, 0.25)', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200'} />
            <div class="footer-logo" style={{ marginBottom: 0 }}>
              ALCHEMIST
              <span style={{ fontSize: '0.85rem', letterSpacing: '2px', display: 'block', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Makeover Artistry</span>
            </div>
          </div>
          <ul class="footer-links">
            <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')} class="footer-link">Home</span></li>
            <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('/academy')} class="footer-link">Academy</span></li>
            <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('/gallery')} class="footer-link">Gallery</span></li>
            <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('/booking')} class="footer-link">Book Slot</span></li>
          </ul>
          <div class="footer-bottom">
            <p>&copy; 2026 Alchemist Makeover Artistry. All Rights Reserved.</p>
            <p style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.instagram.com/alchemist_makeover_artistry?igsh=eGwzeHRpaDBuaHdj" target="_blank" rel="noopener noreferrer" class="footer-link" style={{ fontSize: '1.1rem' }}><i class="fa-brands fa-instagram"></i></a>
              <a href="https://wa.me/919080221527" target="_blank" rel="noopener noreferrer" class="footer-link" style={{ fontSize: '1.1rem' }}><i class="fa-brands fa-whatsapp"></i></a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Call Widget */}
      <a href="tel:9080221527" className="floating-call-widget" id="call-widget" aria-label="Call Alchemist Makeover Artistry">
        <i className="fa-solid fa-phone"></i>
      </a>
    </div>
  );
}
