import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../hooks/useEvents';
import { api } from '../api/topembed';
import { isLive, getElapsedTime } from '../utils/isLive';
import { formatFullDate } from '../utils/formatDate';
import { addRecentlyWatched } from '../utils/storage';
import StreamPlayer from '../components/player/StreamPlayer';
import { FavoriteEventButton } from '../components/favorites/FavoriteButton';
import EventCard from '../components/events/EventCard';
import { LiveBadge } from '../components/common/Badge';
import { ArrowLeft, Calendar, Tag, Timer, Tv } from 'lucide-react';

export default function EventPage() {
  const { eventId } = useParams();
  const { isDark } = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { events } = useEvents();

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    api.getEvent(eventId)
      .then((data) => { if (!cancelled) { setEvent(data); addRecentlyWatched(data); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [eventId]);

  const related = useMemo(() =>
    (events || []).filter((e) => e.id !== eventId && (e.sport === event?.sport || e.league === event?.league)).slice(0, 6),
    [events, event, eventId]
  );

  if (loading) return (
    <div className="space-y-4">
      <div className={`aspect-video rounded-xl skeleton ${!isDark && 'bg-gray-200'}`} />
      <div className={`h-8 w-1/2 rounded skeleton ${!isDark && 'bg-gray-200'}`} />
    </div>
  );

  if (error || !event) return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-red-400 mb-4">{error || 'Event not found'}</p>
      <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Go Home</Link>
    </div>
  );

  const live = isLive(event);
  const elapsed = live ? getElapsedTime(event) : null;
  const title = event.title || `${event.home_team || 'TBD'} vs ${event.away_team || 'TBD'}`;

  return (
    <div className="space-y-6 fade-in">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Link to={event.sport ? `/sport/${encodeURIComponent(event.sport)}` : '/'} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{event.sport}</span>
      </div>

      {/* Match Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          {event.home_team && event.away_team ? (
            <>
              <div className="flex items-center gap-3">
                {event.home_team_image && <img src={event.home_team_image} alt="" className="w-10 h-10 rounded-full object-contain bg-gray-800" />}
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.home_team}</span>
              </div>
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>VS</span>
              <div className="flex items-center gap-3">
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.away_team}</span>
                {event.away_team_image && <img src={event.away_team_image} alt="" className="w-10 h-10 rounded-full object-contain bg-gray-800" />}
              </div>
            </>
          ) : (
            <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {live && <LiveBadge />}
          {live && elapsed && <span className="text-red-400 text-sm font-bold">{elapsed}</span>}
          <FavoriteEventButton event={event} />
        </div>
      </div>

      {/* Stream Player */}
      <StreamPlayer eventId={event.id} channels={event.channels} />

      {/* Event Info */}
      <div className={`rounded-xl p-4 space-y-3 ${isDark ? 'bg-[#141420] border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
        <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Event Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date" value={formatFullDate(event.unix_timestamp)} isDark={isDark} />
          <InfoRow icon={<Tag className="w-4 h-4" />} label="Sport" value={event.sport} isDark={isDark} />
          {event.league && <InfoRow icon={<Tag className="w-4 h-4" />} label="League" value={event.league} isDark={isDark} />}
          {event.duration && <InfoRow icon={<Timer className="w-4 h-4" />} label="Duration" value={`${event.duration} min`} isDark={isDark} />}
        </div>
        {(event.channels || []).length > 0 && (
          <div>
            <div className={`text-xs font-medium mb-2 mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Broadcasting Channels</div>
            <div className="flex flex-wrap gap-2">
              {event.channels.map((ch, i) => (
                <Link key={i} to={`/channel/${ch.link}`} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <Tv className="w-3 h-3" />{ch.name.replace(/\[.*\]$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim()}
                  {ch.is_verified && <span className="text-green-400">✓</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Related Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, isDark }) {
  return (
    <div className="flex items-center gap-2">
      <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>{icon}</span>
      <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{label}:</span>
      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}
