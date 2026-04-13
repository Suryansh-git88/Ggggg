import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { isLive, isUpcoming, getElapsedTime, getTimeUntilStart } from '../../utils/isLive';
import { formatEventDate } from '../../utils/formatDate';
import { LiveBadge, ChannelBadge } from '../common/Badge';
import { Clock } from 'lucide-react';

export default function EventCard({ event }) {
  const { isDark } = useTheme();
  const live = isLive(event);
  const upcoming = isUpcoming(event);
  const elapsed = live ? getElapsedTime(event) : null;
  const timeUntil = upcoming ? getTimeUntilStart(event) : null;
  const title = event.title || `${event.home_team || 'TBD'} vs ${event.away_team || 'TBD'}`;

  return (
    <Link to={`/event/${encodeURIComponent(event.id)}`}
      className={`block rounded-xl overflow-hidden card-hover border ${isDark ? 'bg-[#141420] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}>
      <div className="p-4 space-y-3">
        {/* Top row: sport + league + live badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {event.league_image && <img src={event.league_image} alt="" className="w-4 h-4 object-contain shrink-0" loading="lazy" />}
            <span className={`text-[11px] font-medium truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{event.league || event.sport}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {live && <LiveBadge />}
            {live && elapsed && <span className="text-red-400 text-xs font-bold">{elapsed}</span>}
          </div>
        </div>

        {/* Teams */}
        {event.home_team && event.away_team ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {event.home_team_image && <img src={event.home_team_image} alt="" className="w-7 h-7 rounded-full object-contain shrink-0 bg-gray-800" loading="lazy" />}
              <span className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.home_team}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>VS</span>
            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
              <span className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.away_team}</span>
              {event.away_team_image && <img src={event.away_team_image} alt="" className="w-7 h-7 rounded-full object-contain shrink-0 bg-gray-800" loading="lazy" />}
            </div>
          </div>
        ) : (
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
        )}

        {/* Bottom row: time + channels */}
        <div className="flex items-center justify-between gap-2">
          <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Clock className="w-3 h-3" />
            {live ? <span className="text-red-400 font-medium">Live now</span>
              : upcoming && timeUntil ? <span>Starts in {timeUntil}</span>
              : <span>{formatEventDate(event.unix_timestamp)}</span>}
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {(event.channels || []).slice(0, 2).map((ch, i) => (
              <ChannelBadge key={i} name={ch.name.replace(/\[.*\]$/, '').slice(0, 15)} verified={ch.is_verified} />
            ))}
            {(event.channels || []).length > 2 && (
              <span className="text-[10px] text-gray-600">+{event.channels.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
