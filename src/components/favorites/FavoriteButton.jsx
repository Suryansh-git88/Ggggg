import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

export function FavoriteEventButton({ event, className = '' }) {
  const { toggleEventFav, isEvFav } = useFavorites();
  const isFav = isEvFav(event.id);
  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleEventFav(event); }}
      className={`p-2 rounded-lg transition-colors ${className} ${isFav ? 'text-red-500 hover:text-red-400' : 'text-gray-500 hover:text-red-400'}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
      <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}

export function FavoriteChannelButton({ channel, className = '' }) {
  const { toggleChannelFav, isChFav } = useFavorites();
  const isFav = isChFav(channel.link);
  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleChannelFav(channel); }}
      className={`p-2 rounded-lg transition-colors ${className} ${isFav ? 'text-red-500 hover:text-red-400' : 'text-gray-500 hover:text-red-400'}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
      <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}
