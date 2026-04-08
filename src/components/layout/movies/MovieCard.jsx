import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MovieCard({ movie, isFavorite, onToggleFavorite, index = 0 }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop';

  const rating = (movie.vote_average || movie.rating || 0).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative"
    >
      <Link to={`/movie/${movie.id || movie.movie_id}`} state={{ movie }}>
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-secondary shadow-lg">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay always visible at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-[11px] font-bold text-white">{rating}</span>
          </div>

          {/* Genre tag at bottom if available */}
          {movie.genre_names?.[0] && (
            <div className="absolute bottom-2 left-2.5">
              <span className="text-[10px] font-inter font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {movie.genre_names[0]}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite?.(movie);
        }}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all z-10"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-all duration-200 ${
            isFavorite ? 'text-red-500 fill-red-500 scale-110' : 'text-white/80 hover:text-red-400'
          }`}
        />
      </button>

      <div className="mt-2.5 px-0.5">
        <h3 className="font-inter font-semibold text-sm text-foreground truncate leading-tight">
          {movie.title}
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {movie.release_date?.slice(0, 4) || movie.year || '—'}
        </p>
      </div>
    </motion.div>
  );
}