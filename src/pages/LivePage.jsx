import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useMatches } from '../hooks/useMatches';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { isLive } from '../utils/formatDate';
import { getSportById } from '../utils/constants';
import MatchCard from '../components/matches/MatchCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Radio } from 'lucide-react';

export default function LivePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { matches, loading, error, refetch } = useMatches(null);

  useAutoRefresh(refetch, 30000);

  const liveMatches = useMemo(
    () => matches.filter((m) => isLive(m.date)).sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)),
    [matches]
  );

  const groupedBySport = useMemo(() => {
    const groups = {};
    liveMatches.forEach((m) => {
      const cat = m.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(m);
    });
    return groups;
  }, [liveMatches]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-2">
        <Radio className="w-5 h-5 text-red-400" />
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Live Matches
        </h1>
        {liveMatches.length > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
            {liveMatches.length}
          </span>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
        </div>
      ) : liveMatches.length === 0 ? (
        <EmptyState
          title="No live matches right now"
          message="Check back later or browse upcoming matches."
          icon="📡"
        />
      ) : (
        Object.entries(groupedBySport).map(([sportId, sportMatches]) => {
          const sport = getSportById(sportId);
          return (
            <section key={sportId}>
              <h2 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-lg">{sport.emoji}</span>
                {sport.name}
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>({sportMatches.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sportMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
