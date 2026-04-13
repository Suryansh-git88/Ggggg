import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Tv, X, Radio, MonitorPlay } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(''); setSearchOpen(false); }
  };

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDark ? 'bg-[#0a0a0f]/95 border-gray-800' : 'bg-white/95 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Tv className="w-6 h-6 text-indigo-500" />
          <span className={`font-bold text-lg hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>StreamHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[{ to: '/', label: 'Home' }, { to: '/live', label: 'Live', icon: Radio }, { to: '/channels', label: 'TV Channels', icon: MonitorPlay }, { to: '/favorites', label: 'Favorites' }].map((l) => (
            <Link key={l.to} to={l.to} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              {l.icon && <l.icon className="w-3.5 h-3.5" />}{l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, channels..." autoFocus className={`w-40 sm:w-64 px-3 py-1.5 rounded-lg text-sm border outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'}`} />
              <button type="button" onClick={() => setSearchOpen(false)} className={`p-1.5 rounded-lg ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}><X className="w-4 h-4" /></button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}><Search className="w-5 h-5" /></button>
          )}
          <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
