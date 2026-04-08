import React, { useState, useEffect, useCallback } from 'react';
import { Film, TrendingUp, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/movies/SearchBar';
import MovieGrid from '@/components/movies/MovieGrid';
import SkeletonGrid from '@/components/movies/SkeletonGrid';
import { searchMovies } from '@/lib/useMovies';
import { useFavorites } from '@/lib/useFavorites';
import lodash from 'lodash';

const quickSearches = [
  { label: '🔥 Ação', query: 'Ação' },
  { label: '😂 Comédia', query: 'Comédia' },
  { label: '😱 Terror', query: 'Terror' },
  { label: '🚀 Ficção Científica', query: 'Ficção Científica' },
  { label: '❤️ Romance', query: 'Romance' },
  { label: '🎨 Animação', query: 'Animação' },
  { label: '🕵️ Suspense', query: 'Suspense' },
  { label: '🏆 Oscar', query: 'Oscar vencedor' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  const performSearch = useCallback(
    lodash.debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setHasSearched(true);
      const data = await searchMovies(searchQuery);
      setResults(data);
      setIsLoading(false);
    }, 700),
    []
  );

  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsLoading(true);
      performSearch(query);
    } else {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [query, performSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">Buscar</h1>
        <p className="text-sm text-muted-foreground font-inter mb-4">
          Encontre filmes por título, gênero ou tema
        </p>
        <SearchBar value={query} onChange={setQuery} placeholder="Ex: Interestelar, Terror, 2024..." />
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Quick searches — show when idle */}
        {!hasSearched && !isLoading && (
          <motion.div
            key="quick"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-inter font-semibold text-foreground">Busca rápida</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {quickSearches.map((item) => (
                <button
                  key={item.query}
                  onClick={() => setQuery(item.query)}
                  className="px-4 py-2 rounded-full bg-secondary text-sm font-inter text-secondary-foreground hover:bg-secondary/70 hover:text-foreground transition-all border border-border/30"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Tip card */}
            <div className="bg-secondary/50 border border-border/30 rounded-2xl p-4 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-inter font-semibold text-foreground mb-0.5">Dica de busca</p>
                <p className="text-xs text-muted-foreground font-inter leading-relaxed">
                  Busque por título, diretor, gênero ou tema. Ex: "filmes do Christopher Nolan", "comédia romântica dos anos 90".
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkeletonGrid count={8} />
          </motion.div>
        )}

        {/* No results */}
        {!isLoading && hasSearched && results.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Film className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-inter font-semibold text-foreground mb-1">Nenhum resultado</h3>
            <p className="text-sm text-muted-foreground">Tente buscar por outro termo</p>
          </motion.div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-inter font-bold text-lg text-foreground">Resultados</h2>
              <span className="text-xs text-muted-foreground font-inter">{results.length} filmes</span>
            </div>
            <MovieGrid
              movies={results}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}