const BASE_URL = 'https://api.sportsrc.org';

const cache = new Map();
const CACHE_TTL = 60000; // 60 seconds

async function fetchWithCache(url, ttl = CACHE_TTL) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();

  if (!json.success) throw new Error('API returned unsuccessful response');

  cache.set(url, { data: json.data, timestamp: Date.now() });
  return json.data;
}

export const api = {
  getSports: async () => {
    return fetchWithCache(`${BASE_URL}/?data=sports`);
  },

  getMatches: async (category) => {
    return fetchWithCache(`${BASE_URL}/?data=matches&category=${category}`);
  },

  getMatchDetail: async (category, matchId) => {
    return fetchWithCache(`${BASE_URL}/?data=detail&category=${category}&id=${matchId}`, 30000);
  },

  getAllMatches: async () => {
    const sports = [
      'football', 'cricket', 'basketball', 'tennis', 'hockey',
      'baseball', 'rugby', 'golf', 'fight', 'motor-sports',
      'darts', 'afl', 'billiards', 'other',
    ];
    const results = await Promise.all(
      sports.map(async (sport) => {
        try {
          const data = await fetchWithCache(`${BASE_URL}/?data=matches&category=${sport}`);
          return (data || []).map((m) => ({ ...m, category: m.category || sport }));
        } catch {
          return [];
        }
      })
    );
    return results.flat();
  },

  getResults: async (category) => {
    return fetchWithCache(`${BASE_URL}/?data=results&category=${category}`);
  },

  getTables: async (category) => {
    return fetchWithCache(`${BASE_URL}/?data=tables&category=${category}`);
  },

  getLeagues: async (category) => {
    return fetchWithCache(`${BASE_URL}/?data=leagues&category=${category}`);
  },

  clearCache: () => {
    cache.clear();
  },
};
