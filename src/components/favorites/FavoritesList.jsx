import MatchCard from '../matches/MatchCard';
import EmptyState from '../common/EmptyState';

export default function FavoritesList({ favorites }) {
  if (!favorites || favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        message="Browse matches and tap the heart icon to save your favorites."
        icon="❤️"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
      {favorites.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
