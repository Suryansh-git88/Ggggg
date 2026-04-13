import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t py-6 px-4 text-center text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
      <p>SportStream &mdash; Live sports streaming aggregator</p>
      <p className="mt-1">Powered by SportSRC API. All streams are provided by third-party sources.</p>
    </footer>
  );
}
