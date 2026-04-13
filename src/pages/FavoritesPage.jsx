import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { isLive, isUpcoming } from '../utils/formatDate';
import FavoritesList from '../components/favorites/FavoritesList';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { favorites } = useFavorites();

  const liveFavs = useMemo(() => favorites.filter((f) => isLive(f.date)), [favorites]);
  const upcomingFavs = useMemo(() => favorites.filter((f) => isUpcoming(f.date)), [favorites]);
  const otherFavs = useMemo(() => favorites.filter((f) => !isLive(f.date) && !isUpcoming(f.date)), [favorites]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-400" />
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Favorites
        </h1>
        {favorites.length > 0 && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
            {favorites.length}
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <FavoritesList favorites={[]} />
      ) : (
        <>
          {liveFavs.length > 0 && (
            <div>
              <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Live Favorites</h2>
              <FavoritesList favorites={liveFavs} />
            </div>
          )}
          {upcomingFavs.length > 0 && (
            <div>
              <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Upcoming Favorites</h2>
              <FavoritesList favorites={upcomingFavs} />
            </div>
          )}
          {otherFavs.length > 0 && (
            <div>
              <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Other Favorites</h2>
              <FavoritesList favorites={otherFavs} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
