import { useTheme } from '../../context/ThemeContext';

export default function Loader({ count = 6 }) {
  const { isDark } = useTheme();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded-xl overflow-hidden ${isDark ? 'bg-[#141420]' : 'bg-gray-100'}`}>
          <div className={`h-28 skeleton ${!isDark && 'bg-gray-200'}`} />
          <div className="p-4 space-y-3">
            <div className={`h-4 rounded skeleton w-3/4 ${!isDark && 'bg-gray-200'}`} />
            <div className={`h-3 rounded skeleton w-1/2 ${!isDark && 'bg-gray-200'}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
