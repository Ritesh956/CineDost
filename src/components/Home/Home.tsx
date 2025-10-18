import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Movie } from '../../types';
import RecommendationCard from './RecommendationCard';
import Loading from '../Common/Loading';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError('');
        // Add timestamp to prevent caching and force new random page
        const response = await api.get(`/api/recommendations?t=${Date.now()}`);
        console.log('Recommendations response:', response.data);
        
        // Handle different response formats
        const movieData = response.data.results || response.data.recommendations || response.data || [];
        // If recommendations returned empty or invalid, fallback to popular
        if (!movieData || (Array.isArray(movieData) && movieData.length === 0)) {
          // try fetching popular movies
          const popular = await api.get('/api/movies/popular');
          setMovies(popular.data.results || popular.data || []);
        } else {
          setMovies(movieData);
        }
      } catch (error: any) {
        console.error('Failed to fetch recommendations:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load recommendations';
        // Try fallback to popular movies before showing error
        try {
          const popular = await api.get('/api/movies/popular');
          setMovies(popular.data.results || popular.data || []);
          setError('');
        } catch (popErr) {
          console.error('Failed to fetch popular movies fallback:', popErr);
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?.favoriteGenres]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon-big">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p className="error-description">{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="btn btn-primary">
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
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-emoji">🎬</span>
            Discover Your Next Favorite Movie
          </h1>
          <p className="hero-subtitle">Personalized recommendations powered by your taste</p>
          <button onClick={() => navigate('/search')} className="btn btn-hero">
            <span>Explore Movies</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
      
      <section className="recommendations-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">✨</span>
            Recommended for You
          </h2>
          {movies.length > 0 && (
            <button onClick={handleRetry} className="btn btn-secondary btn-small">
              <span>🔄</span>
              Refresh
            </button>
          )}
        </div>

        {movies.length > 0 ? (
          <div className="movie-grid">
            {movies.map(movie => (
              <RecommendationCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="no-movies">
            <div className="no-movies-icon">🎭</div>
            <h3>No recommendations yet</h3>
            <p>Start rating movies to get personalized suggestions tailored just for you!</p>
            <button onClick={() => navigate('/search')} className="btn btn-primary">
              <span>🔍</span>
              Start Exploring
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
