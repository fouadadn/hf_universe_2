const fetch = require('node-fetch');
const TMDB_API_KEY = "091d4817f9045622142ffd67a08b2d15";

// Helper to fetch popular movies/TV shows
async function fetchTMDBPages(endpoint, maxPages = 5) {
  let results = [];
  for (let page = 1; page <= maxPages; page++) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      if (!data.results || data.results.length === 0) break;

      results = results.concat(data.results);
    } catch (err) {
      console.warn(`Failed to fetch page ${page} of ${endpoint}:`, err.message);
      break;
    }
  }
  return results;
}

// Dynamic URLs for movie details
async function getMoviePaths() {
  const movies = await fetchTMDBPages('movie/popular', 10);
  return movies.map(movie => `/movie/${movie.title.toLowerCase().replace(/ /g, '-')}/${movie.id}`);
}

// Dynamic URLs for TV series details
async function getTVPaths() {
  const tvShows = await fetchTMDBPages('tv/popular', 10);
  return tvShows.map(tv => `/tv/${tv.name.toLowerCase().replace(/ /g, '-')}/${tv.id}`);
}

// Streaming URLs
async function getMovieStreamPaths() {
  const movies = await fetchTMDBPages('movie/popular', 10);
  return movies.map(movie => `/stream/movie/${movie.title.toLowerCase().replace(/ /g, '-')}/${movie.id}`);
}

async function getTVStreamPaths() {
  const tvShows = await fetchTMDBPages('tv/popular', 10);
  return tvShows.map(tv => `/stream/tv/${tv.name.toLowerCase().replace(/ /g, '-')}/${tv.id}/1/1`);
}

// Trailer URLs with real YouTube IDs
async function getTrailerPaths() {
  const movies = await fetchTMDBPages('movie/popular', 10);
  const paths = [];

  for (const movie of movies) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Find first YouTube trailer
        const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
          paths.push(`/watch/${movie.title.toLowerCase().replace(/ /g, '-')}/${trailer.key}`);
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch trailer for ${movie.id}:`, err.message);
    }
  }

  return paths;
}

// Provider / Discover URLs
async function getProviderPaths() {
  const providers = [
    { name: 'netflix', id: 8 },
    { name: 'amazon-prime-video', id: 9 },
    { name: 'hulu', id: 15 },
    { name: 'crunchyroll', id: 283 },
    { name: 'disney-plus', id: 337 },
    { name: 'apple-tv', id: 350 },
    { name: 'peacock-premium-plus', id: 387 },
    { name: 'amc', id: 526 },
    { name: 'paramount-plus', id: 531 },

    // add more providers here
  ];
  return providers.map(p => `/discover/${p.name}/${p.id}`);
}

module.exports = {
  siteUrl: 'https://hf-universe-2.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  async additionalPaths() {
    const staticPaths = [
      { loc: '/' },
      { loc: '/movierelease' },
      { loc: '/auth/login' },
      { loc: '/auth/sign-up' },
    ];

    const dynamicPaths = [
      ...(await getMoviePaths()).map(loc => ({ loc })),
      ...(await getTVPaths()).map(loc => ({ loc })),
      ...(await getMovieStreamPaths()).map(loc => ({ loc })),
      ...(await getTVStreamPaths()).map(loc => ({ loc })),
      ...(await getTrailerPaths()).map(loc => ({ loc })),
      ...(await getProviderPaths()).map(loc => ({ loc })),
    ];

    return [...staticPaths, ...dynamicPaths];
  },
};
