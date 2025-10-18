import React from 'react';

interface Props {
  tmdbRating?: number;
  imdbRating?: number;
  rottenTomatoesRating?: number;
  malRating?: number;
}

const RatingDisplay: React.FC<Props> = ({ 
  tmdbRating, 
  imdbRating, 
  rottenTomatoesRating, 
  malRating 
}) => {
  return (
    <div className="rating-display">
      {tmdbRating && (
        <div className="rating-item">
          <span className="rating-source">TMDb</span>
          <span className="rating-value">⭐ {tmdbRating.toFixed(1)}</span>
        </div>
      )}
      
      {imdbRating && (
        <div className="rating-item">
          <span className="rating-source">IMDb</span>
          <span className="rating-value">⭐ {imdbRating.toFixed(1)}</span>
        </div>
      )}
      
      {rottenTomatoesRating && (
        <div className="rating-item">
          <span className="rating-source">RT</span>
          <span className="rating-value">🍅 {rottenTomatoesRating}%</span>
        </div>
      )}
      
      {malRating && (
        <div className="rating-item">
          <span className="rating-source">MAL</span>
          <span className="rating-value">⭐ {malRating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;
