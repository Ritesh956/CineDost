import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Update the import path to the correct location of your types file
import { type Movie, type Rating } from '../../types';



// If your types file is elsewhere, adjust the path accordingly.
import Loading from '../Common/Loading';

interface RatedMovie extends Movie {
  userRating: number;
  ratedAt: string;
  type: 'movie' | 'anime';
}

const RatingHistory: React.FC = () => {
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'movie' | 'anime'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');

  useEffect(() => {
    fetchRatingHistory();
  }, []);

  const fetchRatingHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/profile');
      const user = response.data;
      
      if (user.ratings && user.ratings.length > 0) {
        // Fetch movie details for each rated item
        const moviePromises = user.ratings.map(async (rating: Rating) => {
          try {
            const movieResponse = await axios.get(`/api/movies/${rating.movieId}`);
            return {
              ...movieResponse.data,
              userRating: rating.rating,
              ratedAt: rating.ratedAt ? rating.ratedAt : new Date().toISOString(), // Use actual timestamp if available
              type: rating.type
            };
          } catch (error) {
            return null;
          }
        });
        
        const movies = await Promise.all(moviePromises);
        const validMovies = movies.filter(movie => movie !== null) as RatedMovie[];
        setRatedMovies(validMovies);
      }
    } catch (error) {
      console.error('Failed to fetch rating history:', error);
      setError('Failed to load rating history');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = ratedMovies.filter(movie => {
    if (filter === 'all') return true;
    return movie.type === filter;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.ratedAt).getTime() - new Date(a.ratedAt).getTime();
      case 'rating':
        return b.userRating - a.userRating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const averageRating = ratedMovies.length > 0 
    ? (ratedMovies.reduce((sum, movie) => sum + movie.userRating, 0) / ratedMovies.length).toFixed(1)
    : '0';

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Rating History</h3>
        <p>{error}</p>
        <button onClick={fetchRatingHistory} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rating-history-page">
      <div className="rating-history-header">
        <h1>⭐ My Ratings</h1>
        <p>Movies and shows you've rated</p>
        
        <div className="rating-stats">
          <div className="stat-item">
            <span className="stat-number">{ratedMovies.length}</span>
            <span className="stat-label">Total Rated</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{averageRating}</span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
      </div>

      {ratedMovies.length === 0 ? (
        <div className="empty-ratings">
          <div className="empty-icon">⭐</div>
          <h3>No ratings yet</h3>
          <p>Start rating movies to see your history here!</p>
          <a href="/" className="btn btn-primary">
            Discover Movies
          </a>
        </div>
      ) : (
        <div className="rating-history-content">
          <div className="rating-controls">
            <div className="filter-controls">
              <label>Filter by type:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="anime">Anime</option>
              </select>
            </div>
            
            <div className="sort-controls">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="filter-select"
              >
                <option value="date">Date Rated</option>
                <option value="rating">My Rating</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          <div className="rated-movies-list">
            {sortedMovies.map(movie => (
              <div key={movie.id} className="rated-movie-item">
                <div className="movie-poster-small">
                  <img 
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : '/placeholder-movie.jpg'
                    }
                    alt={movie.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
                    }}
                  />
                </div>
                
                <div className="movie-details">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.release_date?.split('-')[0]}</p>
                  <p className="movie-overview">
                    {movie.overview?.length > 150 
                      ? `${movie.overview.substring(0, 150)}...` 
                      : movie.overview
                    }
                  </p>
                </div>
                
                <div className="rating-info">
                  <div className="user-rating-large">
                    <span className="rating-stars">
                      {'⭐'.repeat(movie.userRating)}
                    </span>
                    <span className="rating-number">{movie.userRating}/5</span>
                  </div>
                  <div className="tmdb-rating">
                    TMDb: {movie.vote_average?.toFixed(1)}⭐
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingHistory;
