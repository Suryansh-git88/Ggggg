import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { isLive, isUpcoming } from '../utils/isLive';
import EventCard from '../components/events/EventCard';
import ChannelCard from '../components/channels/ChannelCard';
import EmptyState from '../components/common/EmptyState';
import { Heart, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function FavoritesPage() {
  const { isDark } = useTheme();
  const { favEvents, favChannels, toggleEventFav, toggleChannelFav } = useFavorites();
  const [tab, setTab] = useState('events');

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <Heart className="w-6 h-6 text-red-500" />
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Favorites</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['events', 'channels'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t} ({t === 'events' ? favEvents.length : favChannels.length})
          </button>
        ))}
      </div>

      {tab === 'events' ? (
        favEvents.length === 0 ? (
          <EmptyState title="No favorite events" message="Browse events and tap the heart icon to save them here." icon="❤️" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favEvents.map((e) => (
              <div key={e.id} className="relative">
                <EventCard event={e} />
                <button onClick={() => toggleEventFav(e)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-red-400 hover:text-red-300 z-10">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        favChannels.length === 0 ? (
          <EmptyState title="No favorite channels" message="Browse TV channels and save your favorites." icon="📺" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {favChannels.map((ch) => (
              <div key={ch.link} className="relative">
                <ChannelCard channel={ch} />
                <button onClick={() => toggleChannelFav(ch)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-red-400 hover:text-red-300 z-10">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
