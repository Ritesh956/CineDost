export interface User {
  id: string;
  username: string;
  email: string;
  favoriteGenres: string[];
  watchlist: string[];
  ratings: Rating[];
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity?: number;
  imdb_rating?: number;
  rotten_tomatoes_rating?: number;
  mal_rating?: number;
}

export interface Rating {
  ratedAt: any;
  movieId: string;
  rating: number;
  type: 'movie' | 'anime';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, genres: string[]) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface Genre {
  id: number;
  name: string;
}
