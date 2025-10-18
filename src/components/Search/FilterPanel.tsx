import React, { useState } from 'react';
import { MOVIE_GENRES } from '../../utils/constants';

interface Props {
  onFilterChange: (filters: FilterOptions) => void;
  loading?: boolean;
}

export interface FilterOptions {
  genres: number[];
  releaseYear: string;
  rating: number;
  sortBy: 'popularity' | 'rating' | 'release_date';
}

const FilterPanel: React.FC<Props> = ({ onFilterChange, loading = false }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    releaseYear: '',
    rating: 0,
    sortBy: 'popularity'
  });

  const handleGenreToggle = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter(id => id !== genreId)
      : [...filters.genres, genreId];
    
    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      genres: [],
      releaseYear: '',
      rating: 0,
      sortBy: 'popularity'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>🔍 Filters</h3>
        <button 
          onClick={clearFilters}
          className="clear-filters-btn"
          disabled={loading}
        >
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <h4>Genres</h4>
        <div className="genre-filters">
          {MOVIE_GENRES.map(genre => (
            <button
              key={genre.id}
              className={`genre-filter-chip ${filters.genres.includes(genre.id) ? 'active' : ''}`}
              onClick={() => handleGenreToggle(genre.id)}
              disabled={loading}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Release Year</h4>
        <select
          value={filters.releaseYear}
          onChange={(e) => handleFilterChange('releaseYear', e.target.value)}
          className="filter-select"
          disabled={loading}
        >
          <option value="">Any Year</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>Minimum Rating</h4>
        <div className="rating-filter">
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
            className="rating-slider"
            disabled={loading}
          />
          <span className="rating-value">
            {filters.rating > 0 ? `${filters.rating}+ ⭐` : 'Any Rating'}
          </span>
        </div>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
          className="filter-select"
          disabled={loading}
        >
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="release_date">Release Date</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
