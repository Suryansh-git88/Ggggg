import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { isLive, isUpcoming, formatMatchDate } from '../../utils/formatDate';
import { getSportById } from '../../utils/constants';
import LiveIndicator from './LiveIndicator';
import CountdownTimer from './CountdownTimer';
import { PopularBadge } from '../common/Badge';

export default function MatchCard({ match }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const live = isLive(match.date);
  const upcoming = isUpcoming(match.date);
  const sport = getSportById(match.category);

  const home = match.teams?.home;
  const away = match.teams?.away;

  return (
    <Link
      to={`/match/${match.category}/${match.id}`}
      className={`block rounded-xl overflow-hidden card-hover ${isDark ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-gray-50 shadow-sm'} border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
    >
      {match.poster && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={match.poster}
            alt={match.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {live && <LiveIndicator />}
            {match.popular && <PopularBadge />}
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="text-xs text-white/70 flex items-center gap-1">
              <span>{sport.emoji}</span>
              {sport.name}
            </span>
          </div>
        </div>
      )}

      <div className="p-3">
        {!match.poster && (
          <div className="flex items-center gap-1.5 mb-2">
            {live && <LiveIndicator />}
            {match.popular && <PopularBadge />}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {home?.badge && (
              <img src={home.badge} alt="" className="w-6 h-6 object-contain shrink-0" loading="lazy" />
            )}
            <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {home?.name || 'TBD'}
            </span>
          </div>
          <span className={`text-xs font-bold shrink-0 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>VS</span>
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {away?.name || 'TBD'}
            </span>
            {away?.badge && (
              <img src={away.badge} alt="" className="w-6 h-6 object-contain shrink-0" loading="lazy" />
            )}
          </div>
        </div>

        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          {live ? (
            <span className="text-red-400 font-medium">Match is live</span>
          ) : upcoming ? (
            <CountdownTimer timestamp={match.date} />
          ) : (
            formatMatchDate(match.date)
          )}
        </div>
      </div>
    </Link>
  );
}
