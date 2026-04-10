import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Loader2, Star, Clock, Check } from "lucide-react";
import { toast } from "sonner";

export default function Discover() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [added, setAdded] = useState(new Set());

  const searchMutation = useMutation({
    mutationFn: async (q) => {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Busque informações sobre filmes relacionados a: "${q}". Retorne uma lista de até 6 filmes relevantes com detalhes reais.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            movies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  original_title: { type: "string" },
                  year: { type: "number" },
                  director: { type: "string" },
                  genre: { type: "array", items: { type: "string" } },
                  synopsis: { type: "string" },
                  rating: { type: "number" },
                  duration: { type: "number" },
                  poster_url: { type: "string" }
                }
              }
            }
          }
        }
      });
      return res.movies || [];
    },
    onSuccess: (data) => setResults(data),
  });

  const addMutation = useMutation({
    mutationFn: (movie) => base44.entities.Movie.create({ ...movie, status: "Quero Ver" }),
    onSuccess: (_, movie) => {
      qc.invalidateQueries(["movies"]);
      setAdded(prev => new Set([...prev, movie.title]));
      toast.success(`"${movie.title}" adicionado ao catálogo!`);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) searchMutation.mutate(query.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Descobrir Filmes</h2>
        <p className="text-muted-foreground text-sm mt-1">Busque filmes com IA e adicione diretamente ao seu catálogo</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ex: filmes de ficção científica anos 90, Christopher Nolan..."
            className="pl-10 bg-card border-border/60 h-11 rounded-xl"
          />
        </div>
        <Button type="submit" disabled={searchMutation.isPending} className="h-11 px-6 rounded-xl gap-2">
          {searchMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Buscar
        </Button>
      </form>

      {searchMutation.isPending && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Buscando filmes na internet...</p>
        </div>
      )}

      {!searchMutation.isPending && results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((movie, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-black/30">
              {movie.poster_url && (
                <div className="aspect-video overflow-hidden">
                  <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold leading-tight">{movie.title}</h3>
                  {movie.original_title && movie.original_title !== movie.title && (
                    <p className="text-muted-foreground text-xs">{movie.original_title}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {movie.year && <span>{movie.year}</span>}
                  {movie.director && <span>• Dir. {movie.director}</span>}
                  {movie.rating && (
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" /> {movie.rating}
                    </span>
                  )}
                  {movie.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {movie.duration}min
                    </span>
                  )}
                </div>

                {movie.genre?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.slice(0, 3).map(g => (
                      <Badge key={g} variant="secondary" className="text-xs px-2 py-0 rounded-full font-normal">{g}</Badge>
                    ))}
                  </div>
                )}

                {movie.synopsis && (
                  <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">{movie.synopsis}</p>
                )}

                <Button
                  size="sm"
                  className="w-full h-9 rounded-xl gap-2 text-xs"
                  disabled={added.has(movie.title) || addMutation.isPending}
                  variant={added.has(movie.title) ? "secondary" : "default"}
                  onClick={() => addMutation.mutate(movie)}
                >
                  {added.has(movie.title) ? (
                    <><Check className="w-3.5 h-3.5" /> Adicionado</>
                  ) : (
                    <><Plus className="w-3.5 h-3.5" /> Adicionar ao Catálogo</>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searchMutation.isPending && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center text-muted-foreground">
          <Search className="w-12 h-12 opacity-20" />
          <p>Digite algo para buscar filmes com IA</p>
          <p className="text-xs opacity-60">Ex: "melhores thrillers psicológicos" ou "Spielberg anos 80"</p>
        </div>
      )}
    </div>
  );
}