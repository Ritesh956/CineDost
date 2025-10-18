import React from 'react';
import { Movie } from '../../types';
import RecommendationCard from './RecommendationCard';

interface Props {
  movies: Movie[];
  title?: string;
  loading?: boolean;
}

const MovieGrid: React.FC<Props> = ({ movies, title, loading = false }) => {
  if (loading) {
    return (
      <div className="movie-grid-loading">
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="movie-card-skeleton">
              <div className="skeleton-poster"></div>
              <div className="skeleton-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-rating"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="empty-movie-grid">
        <p>No movies found</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      {title && <h2 className="movie-grid-title">{title}</h2>}
      <div className="movie-grid">
        {movies.map(movie => (
          <RecommendationCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
