export const POPULAR_LEAGUES = [
  'Premier League', 'Champions League', 'La Liga', 'Serie A', 'Bundesliga',
  'Indian Premier League', 'NBA', 'NFL', 'UFC', 'Formula 1',
];

export const SPORT_COLORS = {
  Football: '#22c55e', Basketball: '#f97316', Cricket: '#f59e0b',
  Tennis: '#84cc16', 'Ice Hockey': '#06b6d4', Boxing: '#ef4444',
  UFC: '#dc2626', MMA: '#dc2626', NFL: '#7c3aed', Baseball: '#e11d48',
  Rugby: '#8b5cf6', Golf: '#16a34a', Motorsport: '#e11d48',
  Darts: '#0891b2', Handball: '#f472b6', Volleyball: '#a855f7',
  Snooker: '#1e293b', Wrestling: '#b45309', Cycling: '#059669',
  default: '#6b7280',
};

export function getSportColor(sportName) {
  return SPORT_COLORS[sportName] || SPORT_COLORS.default;
}
