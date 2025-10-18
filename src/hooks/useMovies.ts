import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { Movie } from '../types';

interface UseMoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

interface UseMoviesReturn extends UseMoviesState {
  searchMovies: (query: string) => Promise<void>;
  getPopularMovies: () => Promise<void>;
  getMovieDetails: (id: string) => Promise<Movie | null>;
  clearMovies: () => void;
  clearError: () => void;
}

export const useMovies = (): UseMoviesReturn => {
  const [state, setState] = useState<UseMoviesState>({
    movies: [],
    loading: false,
    error: null,
  });

  // Search movies by query
  const searchMovies = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get('/api/movies/search', {
        params: { query: query.trim() }
      });
      
      setState(prev => ({
        ...prev,
        movies: response.data.results || [],
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        movies: [],
        loading: false,
        error: error.response?.data?.message || 'Failed to search movies'
      }));
    }
  }, []);

  // Get popular movies
  const getPopularMovies = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get('/api/movies/popular');
      
      setState(prev => ({
        ...prev,
        movies: response.data.results || [],
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        movies: [],
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch popular movies'
      }));
    }
  }, []);

  // Get movie details by ID
  const getMovieDetails = useCallback(async (id: string): Promise<Movie | null> => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch movie details:', error);
      return null;
    }
  }, []);

  // Clear movies list
  const clearMovies = useCallback(() => {
    setState(prev => ({ ...prev, movies: [] }));
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    movies: state.movies,
    loading: state.loading,
    error: state.error,
    searchMovies,
    getPopularMovies,
    getMovieDetails,
    clearMovies,
    clearError,
  };
};

// Alternative hook for fetching recommendations
export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/recommendations');
      setRecommendations(response.data.results || []);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPersonalizedRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/recommendations/personalized');
      setRecommendations(response.data.recommendations || []);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch personalized recommendations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    fetchPersonalizedRecommendations,
  };
};

// Hook for managing user's movie interactions
export const useMovieActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToWatchlist = useCallback(async (movieId: string) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/users/watchlist', { movieId });
      return true;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add to watchlist');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const rateMovie = useCallback(async (movieId: string, rating: number, type: 'movie' | 'anime') => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/users/rate', { movieId, rating, type });
      return true;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to rate movie');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromWatchlist = useCallback(async (movieId: string) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/users/watchlist/${movieId}`);
      return true;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to remove from watchlist');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    addToWatchlist,
    rateMovie,
    removeFromWatchlist,
  };
};
