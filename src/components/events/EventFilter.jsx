import { useTheme } from '../../context/ThemeContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live Now' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
];

export default function EventFilter({ activeFilter, onFilterChange }) {
  const { isDark } = useTheme();
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {FILTERS.map((f) => (
        <button key={f.id} onClick={() => onFilterChange(f.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === f.id ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
          {f.label}
        </button>
      ))}
    </div>
  );
}
