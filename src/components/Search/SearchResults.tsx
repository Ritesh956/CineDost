import React from 'react';
import type { Movie } from '../../types';
import RecommendationCard from '../Home/RecommendationCard';
import Loading from '../Common/Loading';

interface Props {
  movies: Movie[];
  loading: boolean;
  query: string;
}

const SearchResults: React.FC<Props> = ({ movies, loading, query }) => {
  if (loading) {
    return (
      <div className="search-loading">
        <Loading />
        <p className="loading-text-search">Searching the movie database...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="no-search-results">
        <div className="no-results-icon">🎬</div>
        <h3 className="no-results-title">No movies found</h3>
        <p className="no-results-text">
          We couldn't find any movies matching "<span className="query-text">{query}</span>"
        </p>
        <div className="no-results-tips">
          <h4>Search tips:</h4>
          <ul>
            <li>Try different keywords</li>
            <li>Check your spelling</li>
            <li>Use movie titles, actor names, or directors</li>
            <li>Try broader search terms</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-section">
      <div className="movie-grid">
        {movies.map(movie => (
          <RecommendationCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
