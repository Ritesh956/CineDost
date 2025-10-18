import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GenreSelector from '../Auth/GenreSelector';
import api from '../../services/api';

const Profile: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    ratingsCount: 0,
    watchlistCount: 0,
    averageRating: 0,
    favoriteGenresCount: 0
  });

  useEffect(() => {
    if (user) {
      setFavoriteGenres(user.favoriteGenres || []);
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const [ratingsRes, watchlistRes] = await Promise.all([
        api.get('/api/users/ratings'),
        api.get('/api/users/watchlist')
      ]);

      const ratings = ratingsRes.data || [];
      const watchlist = watchlistRes.data || [];

      const avgRating = ratings.length > 0
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
        : 0;

      setStats({
        ratingsCount: ratings.length,
        watchlistCount: watchlist.length,
        averageRating: avgRating,
        favoriteGenresCount: user?.favoriteGenres?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      await api.put('/api/users/profile', {
        favoriteGenres
      });
      // Refresh the user data in AuthContext to trigger re-renders
      await refreshUser();
      setMessage('✅ Profile updated successfully! Recommendations will refresh.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-enhanced">
      {/* Profile Header with Avatar */}
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="profile-avatar-large">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-username">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-badges">
              <span className="profile-badge">
                🎬 Movie Enthusiast
              </span>
              {stats.ratingsCount > 10 && (
                <span className="profile-badge">
                  ⭐ Active Rater
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="profile-stats-section">
        <h2 className="section-title-profile">
          <span className="section-icon">📊</span>
          Your Statistics
        </h2>
        <div className="stats-grid-enhanced">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number-large">{stats.ratingsCount}</div>
              <div className="stat-label-large">Movies Rated</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number-large">{stats.watchlistCount}</div>
              <div className="stat-label-large">Watchlist Items</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💯</div>
            <div className="stat-content">
              <div className="stat-number-large">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="stat-label-large">Average Rating</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎭</div>
            <div className="stat-content">
              <div className="stat-number-large">{stats.favoriteGenresCount}</div>
              <div className="stat-label-large">Favorite Genres</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="profile-quick-actions">
        <button 
          onClick={() => navigate('/ratings')}
          className="quick-action-btn"
        >
          <span className="action-icon">⭐</span>
          <span>View Ratings</span>
        </button>
        <button 
          onClick={() => navigate('/watchlist')}
          className="quick-action-btn"
        >
          <span className="action-icon">📋</span>
          <span>View Watchlist</span>
        </button>
        <button 
          onClick={() => navigate('/search')}
          className="quick-action-btn"
        >
          <span className="action-icon">🔍</span>
          <span>Discover Movies</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-content-enhanced">
        {/* Account Information */}
        <div className="profile-card">
          <h2 className="card-title">
            <span className="title-icon">👤</span>
            Account Information
          </h2>
          <div className="profile-info-grid">
            <div className="info-item-enhanced">
              <label className="info-label">Username</label>
              <div className="info-value">{user.username}</div>
            </div>
            <div className="info-item-enhanced">
              <label className="info-label">Email</label>
              <div className="info-value">{user.email}</div>
            </div>
            <div className="info-item-enhanced">
              <label className="info-label">Member Since</label>
              <div className="info-value">{new Date().getFullYear()}</div>
            </div>
          </div>
        </div>

        {/* Movie Preferences */}
        <div className="profile-card">
          <h2 className="card-title">
            <span className="title-icon">🎬</span>
            Movie Preferences
          </h2>
          <p className="card-subtitle">
            Select your favorite genres to get better recommendations
          </p>
          
          <div className="genre-selector-wrapper">
            <GenreSelector
              selectedGenres={favoriteGenres}
              onGenreChange={setFavoriteGenres}
              disabled={loading}
            />
          </div>
          
          {message && (
            <div className={`profile-message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <button 
            onClick={handleUpdateProfile}
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>

        {/* Account Actions */}
        <div className="profile-card">
          <h2 className="card-title">
            <span className="title-icon">⚙️</span>
            Account Actions
          </h2>
          <div className="account-actions">
            <button onClick={handleLogout} className="btn btn-danger">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
