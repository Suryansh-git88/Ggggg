const API_BASE = 'https://beta.adstrim.ru/api';
const EMBED_BASE = 'https://embed.lc';

const cache = new Map();
const CACHE_TTL = 60000;

async function fetchWithCache(url, ttl = CACHE_TTL) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (json.status !== 'success') throw new Error('API returned unsuccessful response');
  cache.set(url, { data: json, timestamp: Date.now() });
  return json;
}

export const api = {
  getSports: async () => {
    const json = await fetchWithCache(`${API_BASE}/sports`);
    return json.sports || [];
  },
  getEvents: async () => {
    const json = await fetchWithCache(`${API_BASE}/events`);
    return json.data || [];
  },
  getEvent: async (eventId) => {
    const json = await fetchWithCache(`${API_BASE}/event-single?id=${encodeURIComponent(eventId)}`, 30000);
    return json.data;
  },
  getChannels: async () => {
    const json = await fetchWithCache(`${API_BASE}/channels`);
    return json.channels || [];
  },
  getDurations: async () => {
    const json = await fetchWithCache(`${API_BASE}/durations`);
    return json.data || {};
  },
  clearCache: () => cache.clear(),
};

export const getEventEmbedUrl = (eventId) => `${EMBED_BASE}/embed/${eventId}`;
export const getChannelEmbedUrl = (channelLink) => `${EMBED_BASE}/channel/${channelLink}`;
