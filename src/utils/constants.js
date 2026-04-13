export const SPORTS = [
  { id: 'football', name: 'Football', emoji: '⚽', color: '#22c55e' },
  { id: 'cricket', name: 'Cricket', emoji: '🏏', color: '#f59e0b' },
  { id: 'basketball', name: 'Basketball', emoji: '🏀', color: '#f97316' },
  { id: 'tennis', name: 'Tennis', emoji: '🎾', color: '#84cc16' },
  { id: 'hockey', name: 'Ice Hockey', emoji: '🏒', color: '#06b6d4' },
  { id: 'fight', name: 'UFC / Boxing', emoji: '🥊', color: '#ef4444' },
  { id: 'baseball', name: 'Baseball', emoji: '⚾', color: '#dc2626' },
  { id: 'rugby', name: 'Rugby', emoji: '🏉', color: '#7c3aed' },
  { id: 'golf', name: 'Golf', emoji: '⛳', color: '#16a34a' },
  { id: 'motor-sports', name: 'Motor Sports', emoji: '🏎️', color: '#e11d48' },
  { id: 'darts', name: 'Darts', emoji: '🎯', color: '#0891b2' },
  { id: 'afl', name: 'AFL', emoji: '🏈', color: '#4f46e5' },
  { id: 'billiards', name: 'Billiards', emoji: '🎱', color: '#1e293b' },
  { id: 'other', name: 'Other', emoji: '🏅', color: '#6b7280' },
];

export const HEAT_TIER_COLORS = {
  veryhigh: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  none: '#6b7280',
};

export function getSportById(id) {
  return SPORTS.find((s) => s.id === id) || { id, name: id, emoji: '🏅', color: '#6b7280' };
}
