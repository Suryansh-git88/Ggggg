import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function SportCard({ sport, matchCount }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link
      to={`/sport/${sport.id}`}
      className={`flex items-center gap-3 p-4 rounded-xl card-hover border transition-colors ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}
    >
      <span className="text-3xl" role="img" aria-label={sport.name}>
        {sport.emoji}
      </span>
      <div className="min-w-0">
        <h3 className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {sport.name}
        </h3>
        {matchCount !== undefined && (
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </p>
        )}
      </div>
    </Link>
  );
}
