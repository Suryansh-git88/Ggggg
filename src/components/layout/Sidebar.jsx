import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SPORTS } from '../../utils/constants';

export default function Sidebar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside className={`hidden lg:flex flex-col w-56 shrink-0 border-r overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        Sports
      </div>
      <nav className="flex flex-col px-2 pb-4 gap-0.5">
        {SPORTS.map((sport) => (
          <NavLink
            key={sport.id}
            to={`/sport/${sport.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? isDark
                    ? 'bg-slate-800 text-white'
                    : 'bg-blue-50 text-blue-700'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-lg">{sport.emoji}</span>
            <span className="truncate">{sport.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
