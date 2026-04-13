import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function SportCard({ sport, eventCount }) {
  const { isDark } = useTheme();
  return (
    <Link to={`/sport/${encodeURIComponent(sport.name)}`}
      className={`flex items-center gap-3 p-4 rounded-xl card-hover border transition-colors ${isDark ? 'bg-[#141420] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}>
      <span className="text-3xl">{sport.emoji || '🏅'}</span>
      <div className="min-w-0">
        <h3 className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{sport.name}</h3>
        {eventCount !== undefined && <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{eventCount} event{eventCount !== 1 ? 's' : ''}</p>}
      </div>
    </Link>
  );
}
