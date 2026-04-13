import SportCard from './SportCard';

export default function SportGrid({ sports, eventCounts = {} }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {sports.map((sport) => <SportCard key={sport.id} sport={sport} eventCount={eventCounts[sport.name]} />)}
    </div>
  );
}
