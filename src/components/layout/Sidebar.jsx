import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSports } from '../../hooks/useSports';
import { MonitorPlay } from 'lucide-react';

export default function Sidebar() {
  const { isDark } = useTheme();
  const { sports } = useSports();

  return (
    <aside className={`hidden lg:flex flex-col w-56 shrink-0 border-r overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14 ${isDark ? 'bg-[#0a0a0f] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
      <NavLink to="/channels" className={({ isActive }) => `flex items-center gap-3 mx-2 mt-3 mb-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : isDark ? 'text-indigo-400 hover:bg-gray-800' : 'text-indigo-600 hover:bg-gray-100'}`}>
        <MonitorPlay className="w-4 h-4" /><span>TV Channels</span>
      </NavLink>
      <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Sports</div>
      <nav className="flex flex-col px-2 pb-4 gap-0.5">
        {sports.map((sport) => (
          <NavLink key={sport.id} to={`/sport/${encodeURIComponent(sport.name)}`}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive ? isDark ? 'bg-gray-800 text-white' : 'bg-indigo-50 text-indigo-700' : isDark ? 'text-gray-500 hover:text-white hover:bg-gray-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
            <span className="text-base">{sport.emoji || '🏅'}</span>
            <span className="truncate">{sport.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
