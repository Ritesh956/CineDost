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
