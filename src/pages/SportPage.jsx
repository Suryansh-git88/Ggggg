import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useMatches } from '../hooks/useMatches';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { isLive, isUpcoming } from '../utils/formatDate';
import { getSportById } from '../utils/constants';
import MatchList from '../components/matches/MatchList';
import MatchFilter from '../components/matches/MatchFilter';
import Loader from '../components/common/Loader';
import { ArrowLeft, BarChart3 } from 'lucide-react';

export default function SportPage() {
  const { sportSlug } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { matches, loading, error, refetch } = useMatches(sportSlug);
  const [filter, setFilter] = useState('all');
  const sport = getSportById(sportSlug);

  useAutoRefresh(refetch, 60000);

  const filteredMatches = useMemo(() => {
    switch (filter) {
      case 'live':
        return matches.filter((m) => isLive(m.date));
      case 'upcoming':
        return matches.filter((m) => isUpcoming(m.date)).sort((a, b) => a.date - b.date);
      case 'popular':
        return matches.filter((m) => m.popular);
      default:
        return matches;
    }
  }, [matches, filter]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-2xl">{sport.emoji}</span>
              {sport.name}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>
        <Link
          to={`/standings/${sportSlug}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <BarChart3 className="w-4 h-4" />
          Standings
        </Link>
      </div>

      <MatchFilter activeFilter={filter} onFilterChange={setFilter} />

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
        </div>
      ) : (
        <MatchList matches={filteredMatches} emptyMessage={`No ${filter === 'all' ? '' : filter + ' '}matches for ${sport.name}.`} />
      )}
    </div>
  );
}
