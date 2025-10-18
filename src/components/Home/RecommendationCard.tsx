import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../../types';
import api from '../../services/api';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';

interface Props {
  movie: Movie;
}

const RecommendationCard: React.FC<Props> = ({ movie }) => {
  const navigate = useNavigate();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : PLACEHOLDER_IMAGE;

  const handleCardClick = (e?: React.MouseEvent) => {
    if (e && (e.target as HTMLElement).closest('button')) return; // don't navigate when clicking a button
    navigate(`/movie/${movie.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setLoading(true);
    try {
      await api.post('/api/users/watchlist', { movieId: movie.id.toString() });
      setIsInWatchlist(true);
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setLoading(true);
    try {
      await api.post('/api/users/rate', {
        movieId: movie.id.toString(),
        rating,
        type: 'movie'
      });
      setUserRating(rating);
    } catch (error) {
      console.error('Failed to rate movie:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get genre names from IDs
  const getGenreNames = () => {
    if (!movie.genre_ids || movie.genre_ids.length === 0) return [];
    const genreMap: { [key: number]: string } = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      10770: 'TV', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };
    return movie.genre_ids.slice(0, 2).map((id: number) => genreMap[id]).filter(Boolean);
  };

  const genres = getGenreNames();
  
  // Get rating color
  const getRatingColor = () => {
    const rating = movie.vote_average || 0;
    if (rating >= 8) return 'rating-excellent';
    if (rating >= 7) return 'rating-great';
    if (rating >= 6) return 'rating-good';
    return 'rating-average';
  };

  return (
    <div className="movie-card-enhanced" onClick={handleCardClick}>
      <div className="movie-poster-container">
        {/* Rating badge on poster */}
        <div className={`movie-rating-badge-top ${getRatingColor()}`}>
          <span className="rating-star-icon">★</span>
          <span className="rating-number">{movie.vote_average?.toFixed(1)}</span>
        </div>

        <img 
          src={imageUrl} 
          alt={movie.title}
          className="movie-poster"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
        
        <div className="movie-overlay">
          <div className="overlay-top">
            <button
              className={`watchlist-btn-new ${isInWatchlist ? 'added' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(e); }}
              disabled={loading}
              title={isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {isInWatchlist ? '✓' : '📌'}
            </button>
          </div>
          
          <div className="overlay-bottom">
            <div className="quick-actions">
              <button className="action-btn view-details" title="View Details" onClick={handleViewDetails}>
                <span>ℹ️</span>
                <span>Details</span>
              </button>
              <div className="quick-rating-new">
                <span className="rating-label">Rate:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`star-btn-new ${star <= userRating ? 'filled' : ''}`}
                    onClick={(e) => handleRating(star, e)}
                    disabled={loading}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    {star <= userRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="movie-info-enhanced">
        <h3 className="movie-title-enhanced">{movie.title}</h3>
        
        <div className="movie-meta">
          {movie.release_date && (
            <span className="movie-year-new">
              <span className="meta-icon">📅</span>
              {movie.release_date.split('-')[0]}
            </span>
          )}
          {genres.length > 0 && (
            <div className="movie-genres">
              {genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {movie.overview && (
          <p className="movie-overview-new">
            {movie.overview.length > 100
              ? `${movie.overview.substring(0, 100)}...` 
              : movie.overview
            }
          </p>
        )}

        {movie.popularity && (
          <div className="movie-popularity">
            <span className="popularity-icon">🔥</span>
            <span className="popularity-text">{Math.round(movie.popularity)} views</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;

