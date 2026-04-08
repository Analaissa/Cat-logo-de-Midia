import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'popular', label: 'Populares' },
  { id: 'top_rated', label: 'Mais Votados' },
  { id: 'upcoming', label: 'Em Breve' },
  { id: 'now_playing', label: 'Em Cartaz' },
];

export default function CategoryPills({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`relative px-5 py-2 rounded-full text-sm font-inter font-medium whitespace-nowrap transition-colors ${
            active === cat.id
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground bg-secondary'
          }`}
        >
          {active === cat.id && (
            <motion.div
              layoutId="activePill"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}