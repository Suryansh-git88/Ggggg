import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, teams, channels..."
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-colors ${isDark ? 'bg-[#141420] border-gray-800 text-white placeholder-gray-600 focus:border-indigo-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-indigo-500'}`} />
    </form>
  );
}
