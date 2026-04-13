import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { extractCountry, getCleanChannelName, COUNTRY_FLAGS } from '../../utils/groupChannels';
import { MonitorPlay } from 'lucide-react';

export default function ChannelCard({ channel }) {
  const { isDark } = useTheme();
  const country = extractCountry(channel.name);
  const cleanName = getCleanChannelName(channel.name);
  const flag = COUNTRY_FLAGS[country] || '🌍';

  return (
    <Link to={`/channel/${channel.link}`}
      className={`flex items-center gap-3 p-3 rounded-xl card-hover border transition-colors ${isDark ? 'bg-[#141420] border-gray-800 hover:border-indigo-500/30' : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <MonitorPlay className="w-5 h-5 text-indigo-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{cleanName}</p>
        <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{flag} {country}</p>
      </div>
    </Link>
  );
}
