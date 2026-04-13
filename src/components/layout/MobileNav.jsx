import { NavLink } from 'react-router-dom';
import { Home, Radio, Search, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/live', icon: Radio, label: 'Live' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
];

export default function MobileNav() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t ${isDark ? 'bg-slate-900/95 border-slate-700 backdrop-blur-md' : 'bg-white/95 border-gray-200 backdrop-blur-md'}`}>
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? isDark ? 'text-blue-400' : 'text-blue-600'
                  : isDark ? 'text-slate-500' : 'text-gray-400'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
