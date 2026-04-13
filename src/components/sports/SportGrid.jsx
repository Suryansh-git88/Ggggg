import SportCard from './SportCard';
import { SPORTS } from '../../utils/constants';

export default function SportGrid({ matchCounts = {} }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {SPORTS.map((sport) => (
        <SportCard key={sport.id} sport={sport} matchCount={matchCounts[sport.id]} />
      ))}
    </div>
  );
}
