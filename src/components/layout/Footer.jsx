import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();
  return (
    <footer className={`border-t py-6 px-4 text-center text-sm ${isDark ? 'bg-[#0a0a0f] border-gray-800 text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
      <p>StreamHub &mdash; Live Sports & TV Channel Streaming</p>
      <p className="mt-1">Powered by Topembed API. All streams are provided by third-party sources.</p>
    </footer>
  );
}
