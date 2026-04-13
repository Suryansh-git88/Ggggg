import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <span className="text-6xl mb-4">🏟️</span>
      <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>404</h1>
      <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
        Page not found. Looks like this match got cancelled!
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
