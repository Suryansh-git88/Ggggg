import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../hooks/useEvents';
import { useSports } from '../hooks/useSports';
import { isLive, isUpcoming } from '../utils/isLive';
import EventFilter from '../components/events/EventFilter';
import EventCard from '../components/events/EventCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { ArrowLeft } from 'lucide-react';

export default function SportPage() {
  const { sportName } = useParams();
  const { isDark } = useTheme();
  const { events, loading } = useEvents();
  const { sports } = useSports();
  const [filter, setFilter] = useState('all');

  const sport = sports.find((s) => s.name === sportName);
  const sportEvents = useMemo(() => (events || []).filter((e) => e.sport === sportName), [events, sportName]);

  const filtered = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const tomorrowEnd = new Date(todayStart.getTime() + 172800000);

    switch (filter) {
      case 'live': return sportEvents.filter(isLive);
      case 'upcoming': return sportEvents.filter(isUpcoming);
      case 'today': return sportEvents.filter((e) => { const t = e.unix_timestamp * 1000; return t >= todayStart.getTime() && t < todayEnd.getTime(); });
      case 'tomorrow': return sportEvents.filter((e) => { const t = e.unix_timestamp * 1000; return t >= todayEnd.getTime() && t < tomorrowEnd.getTime(); });
      default: return sportEvents;
    }
  }, [sportEvents, filter]);

  // Group by league
  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((e) => {
      const league = e.league || 'Other';
      if (!g[league]) g[league] = { events: [], image: e.league_image };
      g[league].events.push(e);
    });
    return Object.entries(g).sort((a, b) => b[1].events.length - a[1].events.length);
  }, [filtered]);

  if (loading) return <Loader count={6} />;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <Link to="/" className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}><ArrowLeft className="w-5 h-5" /></Link>
        <span className="text-2xl">{sport?.emoji || '🏅'}</span>
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{sportName}</h1>
        <span className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{sportEvents.length} events</span>
      </div>

      <EventFilter activeFilter={filter} onFilterChange={setFilter} />

      {grouped.length === 0 ? (
        <EmptyState title="No events" message={`No ${filter === 'all' ? '' : filter} events for ${sportName}.`} />
      ) : (
        grouped.map(([league, { events: leagueEvents, image }]) => (
          <section key={league}>
            <div className="flex items-center gap-2 mb-3">
              {image && <img src={image} alt="" className="w-5 h-5 object-contain" loading="lazy" />}
              <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{league}</h2>
              <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>({leagueEvents.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leagueEvents.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
