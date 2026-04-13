import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useMatchDetail } from '../hooks/useMatchDetail';
import { useMatches } from '../hooks/useMatches';
import { isLive, formatMatchDate } from '../utils/formatDate';
import { getSportById } from '../utils/constants';
import { addRecentlyWatched } from '../utils/storage';
import StreamPlayer from '../components/player/StreamPlayer';
import FavoriteButton from '../components/favorites/FavoriteButton';
import MatchCard from '../components/matches/MatchCard';
import LiveIndicator from '../components/matches/LiveIndicator';
import Loader from '../components/common/Loader';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function MatchPage() {
  const { sportSlug, matchId } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { match, loading, error, refetch } = useMatchDetail(sportSlug, matchId);
  const { matches: relatedMatches } = useMatches(sportSlug);
  const sport = getSportById(sportSlug);

  useEffect(() => {
    if (match) {
      addRecentlyWatched(match);
    }
  }, [match]);

  const related = useMemo(
    () => (relatedMatches || []).filter((m) => m.id !== matchId).slice(0, 6),
    [relatedMatches, matchId]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className={`aspect-video rounded-xl skeleton ${isDark ? '' : 'bg-gray-200'}`} />
        <div className={`h-8 w-1/2 rounded skeleton ${isDark ? '' : 'bg-gray-200'}`} />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-400 mb-4">{error || 'Match not found'}</p>
        <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
      </div>
    );
  }

  const home = match.teams?.home;
  const away = match.teams?.away;
  const live = isLive(match.date);

  return (
    <div className="space-y-6 fade-in">
      {/* Back navigation */}
      <div className="flex items-center gap-3">
        <Link to={`/sport/${sportSlug}`} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          {sport.emoji} {sport.name}
        </span>
      </div>

      {/* Match Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {home?.badge && <img src={home.badge} alt="" className="w-10 h-10 object-contain" />}
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{home?.name || 'TBD'}</span>
          </div>
          <span className={`text-sm font-bold ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>VS</span>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{away?.name || 'TBD'}</span>
            {away?.badge && <img src={away.badge} alt="" className="w-10 h-10 object-contain" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {live && <LiveIndicator />}
          <FavoriteButton match={match} />
        </div>
      </div>

      {/* Stream Player */}
      <StreamPlayer sources={match.sources} />

      {/* Match Info */}
      <div className={`rounded-xl p-4 space-y-3 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
        <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Match Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date" value={formatMatchDate(match.date)} isDark={isDark} />
          <InfoRow icon={<Tag className="w-4 h-4" />} label="Sport" value={`${sport.emoji} ${sport.name}`} isDark={isDark} />
        </div>
        {match.poster && (
          <img src={match.poster} alt={match.title} className="w-full rounded-lg mt-3 max-h-48 object-cover" />
        )}
      </div>

      {/* Related Matches */}
      {related.length > 0 && (
        <div>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            More {sport.name} Matches
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, isDark }) {
  return (
    <div className="flex items-center gap-2">
      <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>{icon}</span>
      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{label}:</span>
      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}
