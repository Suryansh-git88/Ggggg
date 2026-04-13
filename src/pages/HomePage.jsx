import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../hooks/useEvents';
import { useSports } from '../hooks/useSports';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { isLive, isUpcoming } from '../utils/isLive';
import EventCard from '../components/events/EventCard';
import SportGrid from '../components/sports/SportGrid';
import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import { Radio, ChevronRight, MonitorPlay, Zap } from 'lucide-react';

export default function HomePage() {
  const { isDark } = useTheme();
  const { events, loading, refetch } = useEvents();
  const { sports } = useSports();

  useAutoRefresh(refetch, 60000);

  const liveEvents = useMemo(() => (events || []).filter(isLive).sort((a, b) => (b.channel_count || 0) - (a.channel_count || 0)), [events]);
  const upcomingEvents = useMemo(() => (events || []).filter(isUpcoming).sort((a, b) => a.unix_timestamp - b.unix_timestamp).slice(0, 20), [events]);
  const eventCounts = useMemo(() => {
    const counts = {};
    (events || []).forEach((e) => { counts[e.sport] = (counts[e.sport] || 0) + 1; });
    return counts;
  }, [events]);

  if (loading) return <Loader count={9} />;

  return (
    <div className="space-y-8 fade-in">
      {/* Hero */}
      <div className={`rounded-2xl p-6 md:p-8 ${isDark ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'}`}>
        <div className="max-w-xl">
          <h1 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Zap className="inline w-7 h-7 text-indigo-500 mr-2" />StreamHub
          </h1>
          <p className={`text-sm md:text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Watch 1500+ live sports events and 440+ TV channels. Football, Cricket, Basketball, UFC, F1 and more.
          </p>
          <SearchBar className="max-w-md" />
        </div>
      </div>

      {/* Live Now */}
      {liveEvents.length > 0 && (
        <section>
          <SectionHeader icon={Radio} label={`Live Now (${liveEvents.length})`} to="/live" isDark={isDark} />
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {liveEvents.slice(0, 10).map((e) => (
              <div key={e.id} className="min-w-[280px] sm:min-w-[320px] shrink-0"><EventCard event={e} /></div>
            ))}
          </div>
        </section>
      )}

      {/* TV Channels Quick Access */}
      <section>
        <SectionHeader icon={MonitorPlay} label="Live TV Channels" to="/channels" isDark={isDark} />
        <Link to="/channels" className={`flex items-center gap-4 p-4 rounded-xl card-hover border ${isDark ? 'bg-indigo-600/10 border-indigo-500/20 hover:border-indigo-500/40' : 'bg-indigo-50 border-indigo-200 hover:border-indigo-300'}`}>
          <MonitorPlay className="w-8 h-8 text-indigo-500" />
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Browse 440+ Live TV Channels</p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Sky Sports, ESPN, TNT Sports, beIN Sports, DAZN and more</p>
          </div>
          <ChevronRight className={`w-5 h-5 ml-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        </Link>
      </section>

      {/* Sport Categories */}
      <section>
        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sports ({sports.length})</h2>
        <SportGrid sports={sports} eventCounts={eventCounts} />
      </section>

      {/* Upcoming */}
      {upcomingEvents.length > 0 && (
        <section>
          <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, label, to, isDark }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Icon className="w-5 h-5 text-indigo-500" />{label}
      </h2>
      {to && <Link to={to} className="text-sm text-indigo-500 hover:text-indigo-400 flex items-center gap-1">View all <ChevronRight className="w-4 h-4" /></Link>}
    </div>
  );
}
