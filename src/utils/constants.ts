export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

export const RATING_COLORS = {
  excellent: '#28a745',
  good: '#ffc107',
  average: '#fd7e14',
  poor: '#dc3545'
};

export const getRatingColor = (rating: number) => {
  if (rating >= 8) return RATING_COLORS.excellent;
  if (rating >= 6) return RATING_COLORS.good;
  if (rating >= 4) return RATING_COLORS.average;
  return RATING_COLORS.poor;
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  MOVIES: {
    SEARCH: '/api/movies/search',
    POPULAR: '/api/movies/popular',
    DETAILS: '/api/movies',
  },
  USER: {
    PROFILE: '/api/users/profile',
    WATCHLIST: '/api/users/watchlist',
    RATE: '/api/users/rate',
  },
  RECOMMENDATIONS: {
    GET: '/api/recommendations',
    PERSONALIZED: '/api/recommendations/personalized',
  },
};

// Placeholder image for movies without posters (inline SVG data URI)
// This creates a clean, professional placeholder with a gradient background
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg width="500" height="750" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%232a2a2a;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231a1a1a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="500" height="750" fill="url(%23grad)"/%3E%3Ctext x="50%25" y="45%25" font-family="Arial, sans-serif" font-size="80" fill="%23666666" text-anchor="middle" dominant-baseline="middle"%3E%F0%9F%8E%AC%3C/text%3E%3Ctext x="50%25" y="55%25" font-family="Arial, sans-serif" font-size="24" fill="%23666666" text-anchor="middle"%3ENo Poster%3C/text%3E%3Ctext x="50%25" y="60%25" font-family="Arial, sans-serif" font-size="18" fill="%23555555" text-anchor="middle"%3EAvailable%3C/text%3E%3C/svg%3E';
