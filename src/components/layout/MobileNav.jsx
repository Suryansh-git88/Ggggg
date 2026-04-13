import { NavLink } from 'react-router-dom';
import { Home, Radio, MonitorPlay, Heart, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/live', icon: Radio, label: 'Live' },
  { to: '/channels', icon: MonitorPlay, label: 'Channels' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
];

export default function MobileNav() {
  const { isDark } = useTheme();
  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t ${isDark ? 'bg-[#0a0a0f]/95 border-gray-800 backdrop-blur-md' : 'bg-white/95 border-gray-200 backdrop-blur-md'}`}>
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition-colors ${isActive ? 'text-indigo-500' : isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <Icon className="w-5 h-5" /><span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
