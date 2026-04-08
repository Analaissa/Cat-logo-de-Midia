import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Heart, Calendar, Clapperboard, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMovieDetails } from '@/lib/useMovies';
import { useFavorites } from '@/lib/useFavorites';

function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="flex-1 bg-secondary rounded-2xl p-4 flex flex-col items-center gap-1.5">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-bold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground font-inter uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function MovieDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedMovie = location.state?.movie;
  const [movie, setMovie] = useState(passedMovie || null);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some(f => f.movie_id === Number(id));

  useEffect(() => {
    setIsLoading(true);
    fetchMovieDetails(id, passedMovie).then((data) => {
      setMovie(prev => ({ ...prev, ...data }));
      setIsLoading(false);
    });
  }, [id]);

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie?.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop hero */}
      <div className="relative h-[45vh] md:h-[55vh]">
        <img
          src={posterUrl}
          alt={movie?.title || ''}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white text-sm font-inter font-medium px-3 py-2 rounded-full border border-white/10 hover:bg-black/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <button
            onClick={() => movie && toggleFavorite(movie)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-red-500/20 border-red-500/30 text-red-500'
                : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main content card */}
      <div className="relative -mt-16 z-10 max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Poster + title row */}
          <div className="flex gap-5 mb-6">
            <div className="w-28 md:w-36 flex-shrink-0 -mt-6">
              <img
                src={posterUrl}
                alt={movie?.title || ''}
                className="w-full aspect-[2/3] object-cover rounded-2xl shadow-2xl shadow-black/50 border border-white/5"
              />
            </div>

            <div className="flex-1 pt-2 min-w-0">
              {isLoading ? (
                <div className="space-y-3 mt-2">
                  <Skeleton className="h-7 w-4/5 bg-secondary rounded-xl" />
                  <Skeleton className="h-4 w-1/2 bg-secondary rounded-xl" />
                  <Skeleton className="h-4 w-1/3 bg-secondary rounded-xl" />
                </div>
              ) : (
                <>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-1">
                    {movie?.title}
                  </h1>
                  {movie?.tagline && (
                    <p className="text-xs text-primary/80 italic font-inter mb-3 line-clamp-1">"{movie.tagline}"</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-sm font-inter">
                    <div className="flex items-center gap-1 bg-primary/15 text-primary px-2.5 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-primary" />
                      <span className="font-bold text-sm">{(movie?.vote_average || 0).toFixed(1)}</span>
                    </div>
                    {movie?.release_date && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{movie.release_date.slice(0, 4)}</span>
                      </div>
                    )}
                    {movie?.runtime && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{movie.runtime} min</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats row */}
          {!isLoading && (
            <div className="flex gap-3 mb-6">
              <StatBox icon={Star} label="Nota" value={(movie?.vote_average || 0).toFixed(1)} />
              {movie?.runtime && <StatBox icon={Clock} label="Duração" value={`${movie.runtime}min`} />}
              {movie?.release_date && <StatBox icon={Calendar} label="Ano" value={movie.release_date.slice(0, 4)} />}
            </div>
          )}

          {/* Genres */}
          {!isLoading && movie?.genre_names?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre_names.map((genre) => (
                <Badge
                  key={genre}
                  className="bg-secondary text-secondary-foreground font-inter text-xs px-3 py-1 rounded-full border border-border/50 hover:bg-secondary/80"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          {/* Overview */}
          <div className="bg-secondary/40 rounded-2xl p-4 mb-5 border border-border/30">
            <h2 className="font-inter font-bold text-foreground mb-2 text-sm uppercase tracking-wide text-muted-foreground">
              Sinopse
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-secondary rounded-lg" />
                <Skeleton className="h-4 w-full bg-secondary rounded-lg" />
                <Skeleton className="h-4 w-2/3 bg-secondary rounded-lg" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                {movie?.overview || 'Sinopse não disponível.'}
              </p>
            )}
          </div>

          {/* Director */}
          {!isLoading && movie?.director && (
            <div className="bg-secondary/40 rounded-2xl p-4 mb-5 border border-border/30">
              <h2 className="font-inter font-bold text-muted-foreground text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <Clapperboard className="w-3.5 h-3.5 text-primary" />
                Direção
              </h2>
              <p className="text-sm font-inter text-foreground font-medium">{movie.director}</p>
            </div>
          )}

          {/* Cast */}
          {!isLoading && movie?.cast?.length > 0 && (
            <div className="bg-secondary/40 rounded-2xl p-4 mb-10 border border-border/30">
              <h2 className="font-inter font-bold text-muted-foreground text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-primary" />
                Elenco Principal
              </h2>
              <div className="flex flex-col gap-2">
                {movie.cast.map((actor, i) => (
                  <div
                    key={actor}
                    className="flex items-center gap-3 py-1"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {actor.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-inter text-foreground">{actor}</span>
                    {i < movie.cast.length - 1 && (
                      <div className="flex-1 border-b border-border/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}