import { Star, Clock, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_COLORS = {
  "Quero Ver": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Assistindo": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Assistido": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const FALLBACK = "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&q=80";

export default function MovieCard({ movie, onEdit, onDelete }) {
  const poster = movie.poster_url || FALLBACK;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {movie.status && (
          <div className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${STATUS_COLORS[movie.status] || "bg-muted text-muted-foreground"}`}>
            {movie.status}
          </div>
        )}

        {movie.rating != null && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-amber-400 text-sm font-bold px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {movie.rating.toFixed(1)}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2">{movie.title}</h3>
          {movie.year && <p className="text-white/60 text-xs mt-0.5">{movie.year}</p>}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {movie.director && (
          <p className="text-muted-foreground text-xs">
            <span className="text-foreground/50">Dir.</span> {movie.director}
          </p>
        )}

        {movie.genre?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {movie.genre.slice(0, 3).map(g => (
              <Badge key={g} variant="secondary" className="text-xs px-2 py-0.5 rounded-full font-normal">
                {g}
              </Badge>
            ))}
          </div>
        )}

        {movie.duration && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            {movie.duration} min
          </div>
        )}

        {movie.synopsis && (
          <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">{movie.synopsis}</p>
        )}

        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5 rounded-xl" onClick={() => onEdit(movie)}>
            <Pencil className="w-3 h-3" /> Editar
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => onDelete(movie.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
