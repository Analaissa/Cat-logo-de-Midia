import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    const data = await base44.entities.Favorite.list('-created_date');
    setFavorites(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (movie) => {
    const movieId = movie.id || movie.movie_id;
    const existing = favorites.find(f => f.movie_id === movieId);

    if (existing) {
      await base44.entities.Favorite.delete(existing.id);
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
      toast('Removido dos favoritos');
    } else {
      const newFav = await base44.entities.Favorite.create({
        movie_id: movieId,
        title: movie.title,
        poster_url: movie.poster_url || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''),
        rating: movie.vote_average || movie.rating || 0,
        year: movie.release_date?.slice(0, 4) || movie.year || '',
        overview: movie.overview || '',
        genres: (movie.genre_names || []).join(', '),
      });
      setFavorites(prev => [newFav, ...prev]);
      toast('Adicionado aos favoritos ❤️');
    }
  }, [favorites]);

  return { favorites, isLoading, toggleFavorite, reload: loadFavorites };
}