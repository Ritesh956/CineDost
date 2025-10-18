import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">CineDost</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Navigation */}
        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {user ? (
            <>
              <div className="nav-links">
                <Link to="/" className={`nav-link ${isActive('/')}`}>
                  <span className="nav-icon">🏠</span>
                  <span>Home</span>
                </Link>
                <Link to="/search" className={`nav-link ${isActive('/search')}`}>
                  <span className="nav-icon">🔍</span>
                  <span>Search</span>
                </Link>
                <Link to="/watchlist" className={`nav-link ${isActive('/watchlist')}`}>
                  <span className="nav-icon">📋</span>
                  <span>Watchlist</span>
                </Link>
                <Link to="/ratings" className={`nav-link ${isActive('/ratings')}`}>
                  <span className="nav-icon">⭐</span>
                  <span>My Ratings</span>
                </Link>
              </div>

              {/* User Profile Dropdown */}
              <div className="user-menu" ref={dropdownRef}>
                <button 
                  className="user-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="user-avatar">
                    {getInitials(user.username)}
                  </div>
                  <span className="user-name">{user.username}</span>
                  <svg 
                    className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                    width="12" 
                    height="8" 
                    viewBox="0 0 12 8" 
                    fill="none"
                  >
                    <path 
                      d="M1 1L6 6L11 1" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <span className="dropdown-icon">👤</span>
                      Profile
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <span className="dropdown-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                <span className="nav-icon">🔐</span>
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
