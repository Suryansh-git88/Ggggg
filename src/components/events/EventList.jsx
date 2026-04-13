import EventCard from './EventCard';
import EmptyState from '../common/EmptyState';

export default function EventList({ events, emptyMessage }) {
  if (!events || events.length === 0) return <EmptyState message={emptyMessage || 'No events available.'} />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
      {events.map((event) => <EventCard key={event.id} event={event} />)}
    </div>
  );
}
