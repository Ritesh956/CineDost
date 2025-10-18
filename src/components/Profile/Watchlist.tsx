import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Movie } from '../../types';
import RecommendationCard from '../Home/RecommendationCard';
import Loading from '../Common/Loading';

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'added' | 'rating' | 'title'>('added');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/users/watchlist');
      
      if (response.data && response.data.length > 0) {
        // Fetch movie details for each item in watchlist
        const moviePromises = response.data.map((movieId: string) =>
          api.get(`/api/movies/${movieId}`).catch(err => {
            console.error(`Failed to fetch movie ${movieId}:`, err);
            return null;
          })
        );
        
        const movieResponses = await Promise.all(moviePromises);
        const movies = movieResponses
          .filter(response => response !== null)
          .map(response => response!.data);
        
        setWatchlistMovies(movies);
      } else {
        setWatchlistMovies([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch watchlist:', error);
      setError(error.response?.data?.message || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    try {
      await api.delete(`/api/users/watchlist/${movieId}`);
      setWatchlistMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    }
  };

  const clearAllWatchlist = async () => {
    if (!window.confirm('Are you sure you want to clear your entire watchlist?')) {
      return;
    }

    try {
      const promises = watchlistMovies.map(movie => 
        api.delete(`/api/users/watchlist/${movie.id}`)
      );
      await Promise.all(promises);
      setWatchlistMovies([]);
    } catch (error) {
      console.error('Failed to clear watchlist:', error);
    }
  };

  const sortedMovies = () => {
    const sorted = [...watchlistMovies];
    
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // 'added' - keep original order
        break;
    }
    
    return sorted;
  };

  if (loading) {
    return (
      <div className="watchlist-loading">
        <Loading />
        <p className="loading-text">Loading your watchlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon-big">⚠️</div>
          <h2>Failed to Load Watchlist</h2>
          <p className="error-description">{error}</p>
          <div className="error-actions">
            <button onClick={fetchWatchlist} className="btn btn-primary">
              <span>🔄</span>
              Try Again
            </button>
            <button onClick={() => navigate('/search')} className="btn btn-secondary">
              <span>🔍</span>
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page-enhanced">
      {/* Watchlist Header */}
      <div className="watchlist-hero">
        <div className="watchlist-hero-content">
          <h1 className="watchlist-title">
            <span className="watchlist-icon">📋</span>
            My Watchlist
          </h1>
          <p className="watchlist-subtitle">
            {watchlistMovies.length > 0 
              ? `${watchlistMovies.length} movie${watchlistMovies.length !== 1 ? 's' : ''} waiting to be watched`
              : 'Start building your collection of movies to watch'
            }
          </p>
        </div>

        {watchlistMovies.length > 0 && (
          <div className="watchlist-stats-badge">
            <div className="stats-badge-content">
              <span className="badge-number">{watchlistMovies.length}</span>
              <span className="badge-label">Movies</span>
            </div>
          </div>
        )}
      </div>

      {watchlistMovies.length === 0 ? (
        <div className="empty-watchlist-enhanced">
          <div className="empty-illustration">
            <div className="empty-icon-large">📽️</div>
            <div className="empty-icon-small">✨</div>
          </div>
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start adding movies you want to watch later. Build your perfect movie queue!
          </p>
          <div className="empty-actions">
            <button 
              onClick={() => navigate('/search')}
              className="btn btn-primary btn-large"
            >
              <span>🔍</span>
              <span>Discover Movies</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-secondary btn-large"
            >
              <span>🏠</span>
              <span>View Recommendations</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Watchlist Controls */}
          <div className="watchlist-controls">
            <div className="controls-left">
              <div className="sort-control">
                <label htmlFor="watchlist-sort" className="control-label">
                  <span className="control-icon">⚡</span>
                  Sort by:
                </label>
                <select
                  id="watchlist-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="control-select"
                >
                  <option value="added">Date Added</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>

              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  aria-label="List view"
                  title="List view"
                >
                  ☰
                </button>
              </div>
            </div>

            <div className="controls-right">
              <button 
                onClick={clearAllWatchlist}
                className="btn btn-danger btn-small"
              >
                <span>🗑️</span>
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Watchlist Content */}
          <div className={`watchlist-content ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            <div className={viewMode === 'grid' ? 'movie-grid' : 'movie-list'}>
              {sortedMovies().map(movie => (
                <div key={movie.id} className="watchlist-item-wrapper">
                  <RecommendationCard movie={movie} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(movie.id);
                    }}
                    className="remove-from-watchlist-btn"
                    aria-label="Remove from watchlist"
                    title="Remove from watchlist"
                  >
                    <span>✕</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Watchlist;
