import React, { useState } from 'react';
import api from '../../services/api';
import type { Movie } from '../../types';
import SearchResults from './SearchResults';
import RecommendationCard from '../Home/RecommendationCard';

const GENRES = [
  'All Genres',
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
];

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'date'>('relevance');
  const [genreFilter, setGenreFilter] = useState<string>('All Genres');
  const [minRating, setMinRating] = useState<number>(0);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Fetch trending movies on component mount
  React.useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoadingTrending(true);
        const response = await api.get('/api/movies/popular');
        const results = response.data.results || response.data || [];
        setTrendingMovies(results.slice(0, 8)); // Show top 8 trending movies
      } catch (error) {
        console.error('Failed to fetch trending movies:', error);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await api.get('/api/movies/search', {
        params: { query: query.trim() }
      });
      const results = response.data.results || response.data || [];
      setMovies(results);
    } catch (error: any) {
      console.error('Search failed:', error);
      setError(error.response?.data?.message || 'Failed to search movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedAndFilteredMovies = () => {
    let result = [...movies];

    // Filter by genre
    if (genreFilter !== 'All Genres') {
      result = result.filter(movie => {
        // TMDB returns genre_ids array, we'll need a mapping
        // For now, filter based on genre name in overview or title (simplified)
        // In production, you'd use TMDB's genre_ids properly
        const genreIds = movie.genre_ids || [];
        const genreMap: { [key: string]: number } = {
          'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35,
          'Crime': 80, 'Documentary': 99, 'Drama': 18, 'Family': 10751,
          'Fantasy': 14, 'History': 36, 'Horror': 27, 'Music': 10402,
          'Mystery': 9648, 'Romance': 10749, 'Science Fiction': 878,
          'Thriller': 53, 'War': 10752, 'Western': 37
        };
        const selectedGenreId = genreMap[genreFilter];
        return selectedGenreId ? genreIds.includes(selectedGenreId) : true;
      });
    }

    // Filter by minimum rating
    if (minRating > 0) {
      result = result.filter(movie => (movie.vote_average || 0) >= minRating);
    }
    
    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case 'date':
        result.sort((a, b) => {
          const dateA = new Date(a.release_date || 0).getTime();
          const dateB = new Date(b.release_date || 0).getTime();
          return dateB - dateA;
        });
        break;
      default:
        // relevance - keep original order
        break;
    }

    return result;
  };

  const handleClearFilters = () => {
    setGenreFilter('All Genres');
    setMinRating(0);
    setSortBy('relevance');
  };

  const handleClearSearch = () => {
    setQuery('');
    setMovies([]);
    setHasSearched(false);
    setError('');
  };

  return (
    <div className="search-page">
      <div className="search-header-section">
        <div className="search-hero">
          <h1 className="search-title">
            <span className="search-emoji">🔍</span>
            Discover Movies
          </h1>
          <p className="search-subtitle">
            Search from millions of movies and find your next favorite
          </p>
        </div>

        <form onSubmit={handleSearch} className="search-form-enhanced">
          <div className="search-input-wrapper">
            <span className="search-icon">🔎</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, actors, directors..."
              className="search-input-enhanced"
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="search-submit-btn"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <span className="search-arrow">→</span>
              </>
            )}
          </button>
        </form>
      </div>

      {hasSearched && !loading && (
        <div className="search-controls">
          <div className="search-results-info">
            <h3 className="results-count">
              {sortedAndFilteredMovies().length > 0 ? (
                <>
                  Showing <span className="count-highlight">{sortedAndFilteredMovies().length}</span> 
                  {sortedAndFilteredMovies().length === 1 ? ' result' : ' results'}
                  {movies.length !== sortedAndFilteredMovies().length && (
                    <span className="filtered-info"> (filtered from {movies.length})</span>
                  )}
                </>
              ) : movies.length > 0 ? (
                <>No results match your filters. <button onClick={handleClearFilters} className="btn-link">Clear filters</button></>
              ) : (
                <>No results found for <span className="query-highlight">"{query}"</span></>
              )}
            </h3>
          </div>

          {movies.length > 0 && (
            <div className="search-filters">
              <div className="filter-group">
                <label htmlFor="genre" className="filter-label">
                  <span className="filter-icon">🎭</span>
                  Genre:
                </label>
                <select
                  id="genre"
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="filter-select"
                >
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="rating" className="filter-label">
                  <span className="filter-icon">⭐</span>
                  Min Rating:
                </label>
                <select
                  id="rating"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="filter-select"
                >
                  <option value={0}>All Ratings</option>
                  <option value={5}>5+ ⭐</option>
                  <option value={6}>6+ ⭐⭐</option>
                  <option value={7}>7+ ⭐⭐⭐</option>
                  <option value={8}>8+ ⭐⭐⭐⭐</option>
                  <option value={9}>9+ ⭐⭐⭐⭐⭐</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sort" className="filter-label">
                  <span className="filter-icon">⚡</span>
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="filter-select"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="date">Release Date</option>
                </select>
              </div>

              {(genreFilter !== 'All Genres' || minRating > 0 || sortBy !== 'relevance') && (
                <button 
                  onClick={handleClearFilters}
                  className="btn-clear-filters"
                  title="Clear all filters"
                >
                  <span>🔄</span>
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="search-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={handleSearch} className="btn btn-secondary btn-small">
            Try Again
          </button>
        </div>
      )}

      {/* Show trending movies before search */}
      {!hasSearched && !loadingTrending && trendingMovies.length > 0 && (
        <div className="trending-section">
          <div className="trending-header">
            <h2 className="trending-title">
              <span className="trending-icon">🔥</span>
              Trending Now
            </h2>
            <p className="trending-subtitle">Popular movies everyone is watching</p>
          </div>
          <div className="trending-movies-grid">
            {trendingMovies.map(movie => (
              <RecommendationCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {hasSearched && (
        <SearchResults 
          movies={sortedAndFilteredMovies()} 
          loading={loading} 
          query={query}
        />
      )}
    </div>
  );
};

export default Search;
