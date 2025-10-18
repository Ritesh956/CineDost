import React from 'react';

interface Props {
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
  disabled?: boolean;
}

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
];

const GenreSelector: React.FC<Props> = ({ selectedGenres, onGenreChange, disabled = false }) => {
  const handleGenreToggle = (genre: string) => {
    if (disabled) return;
    
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="form-group">
      <label>Select Your Favorite Genres:</label>
      <div className="genre-selector">
        {GENRES.map(genre => (
          <button
            key={genre}
            type="button"
            className={`genre-chip ${selectedGenres.includes(genre) ? 'selected' : ''}`}
            onClick={() => handleGenreToggle(genre)}
            disabled={disabled}
          >
            {genre}
          </button>
        ))}
      </div>
      <small className="form-help">
        Selected: {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''}
      </small>
    </div>
  );
};

export default GenreSelector;
