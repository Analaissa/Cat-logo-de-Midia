import React, { useState, useEffect } from 'react';
import { Clapperboard, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryPills from '@/components/movies/CategoryPills';
import MovieGrid from '@/components/movies/MovieGrid';
import HeroMovie from '@/components/movies/HeroMovie';
import SkeletonGrid from '@/components/movies/SkeletonGrid';
import { fetchMovies } from '@/lib/useMovies';
import { useFavorites } from '@/lib/useFavorites';

const CATEGORY_LABELS = {
  popular: 'Filmes Populares',
  top_rated: 'Mais Votados',
  upcoming: 'Em Breve',
  now_playing: 'Em Cartaz',
};

export default function Home() {
  const [category, setCategory] = useState('popular');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setMovies([]);

    fetchMovies(category).then((data) => {
      if (!cancelled) {
        setMovies(data);
        setIsLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [category]);

  const heroMovie = movies[0];
  const gridMovies = movies.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-7"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
            <Clapperboard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">CineHub</h1>
            <p className="text-xs text-muted-foreground font-inter">Catálogo de Filmes</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-inter bg-secondary rounded-full px-3 py-1.5">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Powered by AI</span>
        </div>
      </motion.div>

      {/* Hero */}
      <AnimatePresence mode="wait">
        {!isLoading && heroMovie && (
          <motion.div key={heroMovie.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroMovie movie={heroMovie} isFavorite={favorites.some(f => f.movie_id === heroMovie.id)} onToggleFavorite={toggleFavorite} />
          </motion.div>
        )}
        {isLoading && (
          <motion.div key="hero-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full h-[50vh] md:h-[60vh] rounded-2xl bg-secondary animate-pulse mb-8"
          />
        )}
      </AnimatePresence>

      {/* Category pills */}
      <div className="mb-5">
        <CategoryPills active={category} onChange={setCategory} />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-inter font-bold text-lg text-foreground">
          {CATEGORY_LABELS[category]}
        </h2>
        {!isLoading && (
          <span className="text-xs text-muted-foreground font-inter">{gridMovies.length} filmes</span>
        )}
      </div>

      {/* Movie grid */}
      <section className="mb-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonGrid />
            </motion.div>
          ) : (
            <motion.div key={category} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MovieGrid
                movies={gridMovies}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}