import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const { isDark } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl mb-4">📺</span>
      <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>404</h1>
      <p className={`text-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>This page doesn&apos;t exist.</p>
      <Link to="/" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
        <Home className="w-4 h-4" />Back to Home
      </Link>
    </div>
  );
}
