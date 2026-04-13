import { useTheme } from '../../context/ThemeContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live Now' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'popular', label: 'Popular' },
];

export default function MatchFilter({ activeFilter, onFilterChange }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter.id
              ? 'bg-blue-600 text-white'
              : isDark
              ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              : 'bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
