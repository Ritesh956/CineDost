import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../Common/Loading';

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface Keyword {
  id: number;
  name: string;
}

interface MovieDetailsData {
  id: number;
  title: string;
  original_title: string;
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  budget: number;
  revenue: number;
  status: string;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string }>;
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  videos: {
    results: Video[];
  };
  keywords: {
    keywords: Keyword[];
  };
  external_ids: {
    imdb_id: string | null;
  };
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'media'>('overview');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/movies/${id}`);
      setMovie(response.data);
      
      // Check if movie is in watchlist
      const watchlistResponse = await api.get('/api/users/watchlist');
      const inWatchlist = watchlistResponse.data.some((m: any) => m.id === parseInt(id!));
      setIsInWatchlist(inWatchlist);
      
      // Check user rating
      const ratingsResponse = await api.get('/api/users/ratings');
      const userMovieRating = ratingsResponse.data.find((r: any) => r.movieId === id);
      if (userMovieRating) {
        setUserRating(userMovieRating.rating);
      }
    } catch (err: any) {
      console.error('Failed to fetch movie details:', err);
      setError(err.response?.data?.message || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    try {
      await api.post('/api/users/rate', {
        movieId: id,
        rating,
        type: 'movie'
      });
      setUserRating(rating);
    } catch (error) {
      console.error('Failed to rate movie:', error);
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await api.delete(`/api/users/watchlist/${id}`);
        setIsInWatchlist(false);
      } else {
        await api.post('/api/users/watchlist', { movieId: id });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const getTrailer = () => {
    if (!movie?.videos?.results) return null;
    return movie.videos.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    ) || movie.videos.results[0];
  };

  const getDirector = () => {
    if (!movie?.credits?.crew) return null;
    return movie.credits.crew.find((person) => person.job === 'Director');
  };

  const getWriters = () => {
    if (!movie?.credits?.crew) return [];
    return movie.credits.crew
      .filter((person) => person.department === 'Writing')
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-container"><p>{error}</p></div>;
  if (!movie) return <div className="error-container"><p>Movie not found</p></div>;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  const trailer = getTrailer();
  const director = getDirector();
  const writers = getWriters();

  return (
    <div className="movie-details-page">
      {/* Hero Section with Backdrop */}
      <div 
        className="movie-hero" 
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="movie-hero-overlay">
          <div className="movie-hero-content">
            <div className="movie-poster-large">
              <img src={posterUrl} alt={movie.title} />
              {movie.status === 'Released' && (
                <div className="movie-status-badge">Released</div>
              )}
            </div>

            <div className="movie-hero-info">
              <h1 className="movie-title-large">
                {movie.title}
                {movie.release_date && (
                  <span className="movie-year-large">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </h1>

              {movie.tagline && (
                <p className="movie-tagline">{movie.tagline}</p>
              )}

              <div className="movie-meta-info">
                {movie.release_date && (
                  <span className="meta-item">
                    {new Date(movie.release_date).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <>
                    {movie.release_date && <span className="meta-separator">•</span>}
                    <span className="meta-item">
                      {movie.genres.map(g => g.name).join(', ')}
                    </span>
                  </>
                )}
                {movie.runtime && movie.runtime > 0 && (
                  <>
                    {(movie.release_date || movie.genres?.length) && <span className="meta-separator">•</span>}
                    <span className="meta-item">{formatRuntime(movie.runtime)}</span>
                  </>
                )}
              </div>

              {/* User Score */}
              <div className="movie-score-section">
                <div className="user-score-circle">
                  <svg viewBox="0 0 36 36" className="score-ring">
                    <path
                      className="score-ring-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="score-ring-fill"
                      strokeDasharray={`${movie.vote_average * 10}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="score-text">
                    {Math.round(movie.vote_average * 10)}
                    <span className="score-percent">%</span>
                  </div>
                </div>
                <span className="score-label">User Score</span>
              </div>

              {/* Action Buttons */}
              <div className="movie-actions">
                <button 
                  className={`action-btn ${isInWatchlist ? 'active' : ''}`}
                  onClick={toggleWatchlist}
                >
                  <span className="action-icon">📋</span>
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn play-trailer"
                  >
                    <span className="action-icon">▶️</span>
                    Play Trailer
                  </a>
                )}
              </div>

              {/* User Rating */}
              <div className="user-rating-section">
                <span className="rating-label">Your Rating:</span>
                <div className="star-rating-large">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-btn ${star <= userRating ? 'filled' : 'empty'}`}
                      onClick={() => handleRating(star)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <span className="rating-value">{userRating}/5</span>
                )}
              </div>

              {/* Overview */}
              <div className="overview-section">
                <h3 className="section-title">Overview</h3>
                <p className="movie-overview-text">{movie.overview}</p>
              </div>

              {/* Key Crew */}
              <div className="key-crew">
                {director && (
                  <div className="crew-member">
                    <p className="crew-name">{director.name}</p>
                    <p className="crew-job">Director</p>
                  </div>
                )}
                {writers.map((writer) => (
                  <div key={writer.id} className="crew-member">
                    <p className="crew-name">{writer.name}</p>
                    <p className="crew-job">{writer.job}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="movie-content-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Cast & Crew
          </button>
          <button
            className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            Media
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Top Billed Cast */}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div className="cast-section">
                  <h2 className="content-section-title">Top Billed Cast</h2>
                  <div className="cast-scroll-container">
                    <div className="cast-grid">
                      {movie.credits.cast.slice(0, 10).map((person) => (
                        <div key={person.id} className="cast-card">
                          <div className="cast-image">
                            {person.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                alt={person.name}
                              />
                            ) : (
                              <div className="no-image">
                                <span>👤</span>
                              </div>
                            )}
                          </div>
                          <div className="cast-info">
                            <p className="cast-name">{person.name}</p>
                            <p className="cast-character">{person.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Movie Info Sidebar */}
              <div className="movie-info-sidebar">
                <div className="info-section">
                  <h3 className="info-title">Status</h3>
                  <p className="info-value">{movie.status || 'Unknown'}</p>
                </div>

                <div className="info-section">
                  <h3 className="info-title">Original Language</h3>
                  <p className="info-value">
                    {movie.spoken_languages?.[0]?.english_name || '-'}
                  </p>
                </div>

                <div className="info-section">
                  <h3 className="info-title">Budget</h3>
                  <p className="info-value">{formatCurrency(movie.budget || 0)}</p>
                </div>

                <div className="info-section">
                  <h3 className="info-title">Revenue</h3>
                  <p className="info-value">{formatCurrency(movie.revenue || 0)}</p>
                </div>

                {movie.keywords?.keywords && movie.keywords.keywords.length > 0 && (
                  <div className="info-section">
                    <h3 className="info-title">Keywords</h3>
                    <div className="keywords-list">
                      {movie.keywords.keywords.slice(0, 10).map((keyword) => (
                        <span key={keyword.id} className="keyword-tag">
                          {keyword.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="cast-crew-tab">
              {/* Full Cast */}
              {movie.credits?.cast && (
                <div className="full-cast-section">
                  <h2 className="content-section-title">Cast ({movie.credits.cast.length})</h2>
                  <div className="full-cast-grid">
                    {movie.credits.cast.map((person) => (
                      <div key={person.id} className="cast-list-item">
                        <div className="cast-list-image">
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                              alt={person.name}
                            />
                          ) : (
                            <div className="no-image-small">👤</div>
                          )}
                        </div>
                        <div className="cast-list-info">
                          <p className="cast-list-name">{person.name}</p>
                          <p className="cast-list-character">{person.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew */}
              {movie.credits?.crew && (
                <div className="crew-section">
                  <h2 className="content-section-title">Crew ({movie.credits.crew.length})</h2>
                  <div className="crew-departments">
                    {['Directing', 'Writing', 'Production', 'Camera', 'Editing', 'Sound'].map((dept) => {
                      const deptCrew = movie.credits.crew.filter(c => c.department === dept);
                      if (deptCrew.length === 0) return null;
                      
                      return (
                        <div key={dept} className="crew-department">
                          <h3 className="department-title">{dept}</h3>
                          <div className="crew-list">
                            {deptCrew.map((person) => (
                              <div key={`${person.id}-${person.job}`} className="crew-list-item">
                                <p className="crew-list-name">{person.name}</p>
                                <p className="crew-list-job">{person.job}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="media-tab">
              {/* Videos */}
              {movie.videos?.results && movie.videos.results.length > 0 && (
                <div className="videos-section">
                  <h2 className="content-section-title">Videos ({movie.videos.results.length})</h2>
                  <div className="videos-grid">
                    {movie.videos.results.slice(0, 6).map((video) => (
                      <a
                        key={video.id}
                        href={`https://www.youtube.com/watch?v=${video.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-card"
                      >
                        <div className="video-thumbnail">
                          <img
                            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                            alt={video.name}
                          />
                          <div className="play-overlay">
                            <span className="play-icon">▶️</span>
                          </div>
                        </div>
                        <p className="video-title">{video.name}</p>
                        <p className="video-type">{video.type}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Posters would go here if we had that endpoint */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
