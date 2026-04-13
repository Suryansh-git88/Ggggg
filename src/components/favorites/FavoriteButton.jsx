import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

export default function FavoriteButton({ match, className = '' }) {
  const { toggleFavorite, isMatchFavorite } = useFavorites();
  const isFav = isMatchFavorite(match.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(match);
      }}
      className={`p-2 rounded-lg transition-colors ${className} ${isFav ? 'text-red-500 hover:text-red-400' : 'text-slate-400 hover:text-red-400'}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}
