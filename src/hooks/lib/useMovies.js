import { base44 } from '@/api/base44Client';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export async function fetchMovies(category = 'popular', page = 1) {
  const categoryLabels = {
    popular: 'popular',
    top_rated: 'top rated',
    upcoming: 'upcoming',
    now_playing: 'now playing',
  };

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Give me a list of 18 ${categoryLabels[category] || 'popular'} movies from recent years. For each movie provide: id (a unique number), title, overview (2 sentences), release_date (YYYY-MM-DD format), vote_average (rating out of 10 with 1 decimal), genre_names (array of genre strings), poster_image_keyword (a short keyword to find a relevant poster image). Make them real, well-known movies. Return diverse genres.`,
    response_json_schema: {
      type: "object",
      properties: {
        movies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              overview: { type: "string" },
              release_date: { type: "string" },
              vote_average: { type: "number" },
              genre_names: { type: "array", items: { type: "string" } },
              poster_image_keyword: { type: "string" }
            }
          }
        }
      }
    }
  });

  return (result.movies || []).map((m, i) => ({
    ...m,
    poster_url: `https://images.unsplash.com/photo-${getMoviePoster(i)}?w=400&h=600&fit=crop`,
  }));
}

export async function searchMovies(query) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Search for movies matching "${query}". Return up to 12 real movies that match this search query. For each movie provide: id (unique number), title, overview (2 sentences), release_date (YYYY-MM-DD), vote_average (rating out of 10), genre_names (array of strings).`,
    response_json_schema: {
      type: "object",
      properties: {
        movies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              overview: { type: "string" },
              release_date: { type: "string" },
              vote_average: { type: "number" },
              genre_names: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    }
  });

  return (result.movies || []).map((m, i) => ({
    ...m,
    poster_url: `https://images.unsplash.com/photo-${getMoviePoster(i + 5)}?w=400&h=600&fit=crop`,
  }));
}

export async function fetchMovieDetails(movieId, movieData) {
  if (movieData && movieData.overview) {
    return movieData;
  }

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Give me detailed information about the movie with ID ${movieId}. Provide: id, title, overview (4-5 sentences), release_date (YYYY-MM-DD), vote_average, genre_names (array), runtime (in minutes), director, cast (array of top 5 actor names), tagline.`,
    response_json_schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        overview: { type: "string" },
        release_date: { type: "string" },
        vote_average: { type: "number" },
        genre_names: { type: "array", items: { type: "string" } },
        runtime: { type: "number" },
        director: { type: "string" },
        cast: { type: "array", items: { type: "string" } },
        tagline: { type: "string" }
      }
    }
  });

  return {
    ...result,
    poster_url: `https://images.unsplash.com/photo-${getMoviePoster(movieId % 20)}?w=400&h=600&fit=crop`,
  };
}

// Curated unsplash photo IDs for movie-themed posters
function getMoviePoster(index) {
  const posters = [
    '1489599849927-2ee91cede3ba',
    '1536440136628-849c177e76a1',
    '1440404653325-ab127d49abc1',
    '1478720568477-152d9b164e26',
    '1485846234645-a62644f84728',
    '1594909122845-11baa439b7bf',
    '1626814026160-2237a95fc5a0',
    '1517604931442-7e0c8ed2963c',
    '1535016120720-40c646be5580',
    '1542204165-65bf26472b9b',
    '1595769816263-9b910be24d5f',
    '1509281373149-e957c6296406',
    '1574267432553-4b4628081c31',
    '1460881680858-30d872d5b530',
    '1524712245354-2c4e5e7121c0',
    '1505686994434-e3cc5abf1330',
    '1516450360452-9258f12d4677',
    '1507003211169-0a1dd7228f2d',
    '1534447677768-be436bb09401',
    '1559583985-c80d8ad9b29f',
  ];
  return posters[Math.abs(index) % posters.length];