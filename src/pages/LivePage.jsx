import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../hooks/useEvents';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { isLive } from '../utils/isLive';
import EventCard from '../components/events/EventCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Radio } from 'lucide-react';

export default function LivePage() {
  const { isDark } = useTheme();
  const { events, loading, refetch } = useEvents();

  useAutoRefresh(refetch, 30000);

  const liveEvents = useMemo(() => (events || []).filter(isLive), [events]);
  const grouped = useMemo(() => {
    const g = {};
    liveEvents.forEach((e) => {
      const sport = e.sport || 'Other';
      if (!g[sport]) g[sport] = [];
      g[sport].push(e);
    });
    return Object.entries(g).sort((a, b) => b[1].length - a[1].length);
  }, [liveEvents]);

  if (loading) return <Loader count={6} />;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <Radio className="w-6 h-6 text-red-500" />
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Now</h1>
        <span className={`text-sm px-2 py-0.5 rounded-full ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>{liveEvents.length} events</span>
      </div>

      {grouped.length === 0 ? (
        <EmptyState title="No live events right now" message="Check back soon or browse upcoming events." icon="📡" />
      ) : (
        grouped.map(([sport, sportEvents]) => (
          <section key={sport}>
            <h2 className={`text-base font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{sport} ({sportEvents.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sportEvents.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
