import MatchCard from './MatchCard';
import EmptyState from '../common/EmptyState';

export default function MatchList({ matches, emptyMessage }) {
  if (!matches || matches.length === 0) {
    return <EmptyState message={emptyMessage || 'No matches available right now.'} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
