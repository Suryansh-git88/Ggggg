import { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChannels } from '../hooks/useChannels';
import { groupChannelsByCountry, COUNTRY_FLAGS, COUNTRY_SORT_ORDER } from '../utils/groupChannels';
import ChannelGrid from '../components/channels/ChannelGrid';
import Loader from '../components/common/Loader';
import { MonitorPlay, Search } from 'lucide-react';

export default function ChannelsPage() {
  const { isDark } = useTheme();
  const { channels, loading } = useChannels();
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const filtered = useMemo(() => {
    let list = channels || [];
    if (search) list = list.filter((ch) => ch.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [channels, search]);

  const grouped = useMemo(() => groupChannelsByCountry(filtered), [filtered]);
  const countries = useMemo(() => {
    const keys = Object.keys(grouped);
    return [...COUNTRY_SORT_ORDER.filter((c) => keys.includes(c)), ...keys.filter((c) => !COUNTRY_SORT_ORDER.includes(c))];
  }, [grouped]);

  if (loading) return <Loader count={12} />;

  const displayChannels = selectedCountry === 'all' ? filtered : (grouped[selectedCountry] || []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <MonitorPlay className="w-6 h-6 text-indigo-500" />
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Live TV Channels</h1>
        <span className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{channels.length} channels</span>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search channels..."
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none ${isDark ? 'bg-[#141420] border-gray-800 text-white placeholder-gray-600 focus:border-indigo-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-indigo-500'}`} />
      </div>

      {/* Country Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button onClick={() => setSelectedCountry('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCountry === 'all' ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          All
        </button>
        {countries.map((c) => (
          <button key={c} onClick={() => setSelectedCountry(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCountry === c ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {COUNTRY_FLAGS[c] || '🌍'} {c} ({(grouped[c] || []).length})
          </button>
        ))}
      </div>

      <ChannelGrid channels={displayChannels} />
    </div>
  );
}
