import { useTheme } from '../../context/ThemeContext';

export default function EmptyState({ title = 'No matches found', message = 'Check back later for updates.', icon = '📺' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
        {message}
      </p>
    </div>
  );
}
