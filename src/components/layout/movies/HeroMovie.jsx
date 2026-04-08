import React from 'react';
import { Star, Info, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HeroMovie({ movie, isFavorite, onToggleFavorite }) {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-[48vh] md:h-[58vh] rounded-3xl overflow-hidden mb-7 shadow-2xl shadow-black/50"
    >
      <img
        src={backdropUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

      {/* Top right favorite */}
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(movie)}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all ${
            isFavorite
              ? 'bg-red-500/20 border-red-500/30 text-red-500'
              : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>
      )}