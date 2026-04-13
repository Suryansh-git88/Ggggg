const FAVORITES_KEY = 'topembed_favorites';
const FAV_CHANNELS_KEY = 'topembed_fav_channels';
const RECENT_KEY = 'topembed_recent';

export function getFavoriteEvents() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch { return []; }
}
export function addFavoriteEvent(event) {
  const favs = getFavoriteEvents();
  if (!favs.find((f) => f.id === event.id)) {
    favs.push({ id: event.id, home_team: event.home_team, away_team: event.away_team, title: event.title, sport: event.sport, league: event.league, unix_timestamp: event.unix_timestamp, duration: event.duration });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
}
export function removeFavoriteEvent(id) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(getFavoriteEvents().filter((f) => f.id !== id)));
}
export function isEventFavorite(id) {
  return getFavoriteEvents().some((f) => f.id === id);
}

export function getFavoriteChannels() {
  try { return JSON.parse(localStorage.getItem(FAV_CHANNELS_KEY)) || []; } catch { return []; }
}
export function addFavoriteChannel(channel) {
  const favs = getFavoriteChannels();
  if (!favs.find((f) => f.link === channel.link)) {
    favs.push({ name: channel.name, link: channel.link });
    localStorage.setItem(FAV_CHANNELS_KEY, JSON.stringify(favs));
  }
}
export function removeFavoriteChannel(link) {
  localStorage.setItem(FAV_CHANNELS_KEY, JSON.stringify(getFavoriteChannels().filter((f) => f.link !== link)));
}
export function isChannelFavorite(link) {
  return getFavoriteChannels().some((f) => f.link === link);
}

export function getRecentlyWatched() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
}
export function addRecentlyWatched(item) {
  let recent = getRecentlyWatched().filter((r) => r.id !== item.id);
  recent.unshift({ ...item, watchedAt: Date.now() });
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 30)));
}
