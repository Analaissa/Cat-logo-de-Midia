import React from 'react';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies, favorites, onToggleFavorite }) {
  const favoriteIds = new Set((favorites || []).map(f => f.movie_id));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id || movie.movie_id || index}
          movie={movie}
          index={index}
          isFavorite={favoriteIds.has(movie.id || movie.movie_id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}