import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../hooks/useEvents';
import { useChannels } from '../hooks/useChannels';
import EventCard from '../components/events/EventCard';
import ChannelCard from '../components/channels/ChannelCard';
import EmptyState from '../components/common/EmptyState';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const { events } = useEvents();
  const { channels } = useChannels();

  useEffect(() => { setQuery(q); }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  const matchingEvents = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return (events || []).filter((e) =>
      (e.home_team || '').toLowerCase().includes(lower) ||
      (e.away_team || '').toLowerCase().includes(lower) ||
      (e.title || '').toLowerCase().includes(lower) ||
      (e.league || '').toLowerCase().includes(lower) ||
      (e.sport || '').toLowerCase().includes(lower)
    );
  }, [events, q]);

  const matchingChannels = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return (channels || []).filter((ch) => ch.name.toLowerCase().includes(lower));
  }, [channels, q]);

  return (
    <div className="space-y-6 fade-in">
      <form onSubmit={handleSubmit} className="relative max-w-lg">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, teams, leagues, channels..." autoFocus
          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none ${isDark ? 'bg-[#141420] border-gray-800 text-white placeholder-gray-600 focus:border-indigo-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-indigo-500'}`} />
      </form>

      {q && (
        <>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Found {matchingEvents.length} events and {matchingChannels.length} channels for &ldquo;{q}&rdquo;
          </p>

          {matchingEvents.length > 0 && (
            <section>
              <h2 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Events ({matchingEvents.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingEvents.slice(0, 30).map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </section>
          )}

          {matchingChannels.length > 0 && (
            <section>
              <h2 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Channels ({matchingChannels.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {matchingChannels.slice(0, 30).map((ch) => <ChannelCard key={ch.link} channel={ch} />)}
              </div>
            </section>
          )}

          {matchingEvents.length === 0 && matchingChannels.length === 0 && (
            <EmptyState title="No results" message={`Nothing found for "${q}". Try different keywords.`} icon="🔍" />
          )}
        </>
      )}

      {!q && <EmptyState title="Search" message="Type to search across events, teams, leagues, and TV channels." icon="🔍" />}
    </div>
  );
}
