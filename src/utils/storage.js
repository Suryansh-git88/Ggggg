const FAVORITES_KEY = 'sports_app_favorites';
const RECENT_KEY = 'sports_app_recent';

export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(match) {
  const favorites = getFavorites();
  if (!favorites.find((f) => f.id === match.id)) {
    favorites.push({
      id: match.id,
      title: match.title,
      category: match.category,
      date: match.date,
      teams: match.teams,
      poster: match.poster,
      popular: match.popular,
    });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(matchId) {
  const favorites = getFavorites().filter((f) => f.id !== matchId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(matchId) {
  return getFavorites().some((f) => f.id === matchId);
}

export function getRecentlyWatched() {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentlyWatched(match) {
  let recent = getRecentlyWatched().filter((r) => r.id !== match.id);
  recent.unshift({
    id: match.id,
    title: match.title,
    category: match.category,
    date: match.date,
    teams: match.teams,
    poster: match.poster,
    watchedAt: Date.now(),
  });
  recent = recent.slice(0, 20);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}
