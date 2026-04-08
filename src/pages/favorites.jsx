import React from 'react';
import { Heart, Film, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SkeletonGrid from '@/components/movies/SkeletonGrid';
import { useFavorites } from '@/lib/useFavorites';
import { Star } from 'lucide-react';

function FavoriteCard({ fav, onRemove }) {
  const posterUrl = fav.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link to={`/movie/${fav.movie_id}`} state={{ movie: {
        id: fav.movie_id, title: fav.title, poster_url: fav.poster_url,
        vote_average: fav.rating, release_date: fav.year ? `${fav.year}-01-01` : '',
        overview: fav.overview, genre_names: fav.genres ? fav.genres.split(', ') : []
      }}}>
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-secondary shadow-lg">
          <img
            src={posterUrl}
            alt={fav.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Rating */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-[11px] font-bold text-white">{(fav.rating || 0).toFixed(1)}</span>
          </div>
        </div>
      </Link>

      {/* Remove button */}
      <button
        onClick={() => onRemove({ id: fav.movie_id, movie_id: fav.movie_id, title: fav.title, poster_url: fav.poster_url, vote_average: fav.rating })}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-red-500/20 hover:bg-red-500/30 transition-all z-10 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-400" />
      </button>

      <div className="mt-2.5 px-0.5">
        <h3 className="font-inter font-semibold text-sm text-foreground truncate">{fav.title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">{fav.year || '—'}</p>
      </div>
    </motion.div>
  );
}

export default function Favorites() {
  const { favorites, isLoading, toggleFavorite } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Favoritos</h1>
              <p className="text-xs text-muted-foreground font-inter">
                {favorites.length} {favorites.length === 1 ? 'filme salvo' : 'filmes salvos'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center mb-5 shadow-inner">
            <Film className="w-12 h-12 text-muted-foreground/40" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Nenhum favorito ainda
          </h3>
          <p className="text-sm text-muted-foreground mb-7 max-w-xs font-inter leading-relaxed">
            Toque no coração ❤️ dos filmes para salvá-los aqui
          </p>
          <Link to="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-inter font-semibold shadow-lg shadow-primary/20">
              Explorar filmes
            </Button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {favorites.map((fav) => (
              <FavoriteCard key={fav.id} fav={fav} onRemove={toggleFavorite} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}