import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useChannels } from '../hooks/useChannels';
import { useEvents } from '../hooks/useEvents';
import { getChannelEmbedUrl } from '../api/topembed';
import { extractCountry, getCleanChannelName, extractNetworkName, COUNTRY_FLAGS } from '../utils/groupChannels';
import { FavoriteChannelButton } from '../components/favorites/FavoriteButton';
import ChannelCard from '../components/channels/ChannelCard';
import EventCard from '../components/events/EventCard';
import { ArrowLeft, Maximize, Minimize, Loader2, Shield, ShieldOff, MousePointerClick } from 'lucide-react';

export default function ChannelPlayerPage() {
  const { channelLink } = useParams();
  const { isDark } = useTheme();
  const { channels } = useChannels();
  const { events } = useEvents();
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adShieldActive, setAdShieldActive] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [shieldMsg, setShieldMsg] = useState('');
  const containerRef = useRef(null);

  const channel = channels.find((ch) => ch.link === channelLink);
  const cleanName = channel ? getCleanChannelName(channel.name) : channelLink;
  const country = channel ? extractCountry(channel.name) : '';
  const networkName = channel ? extractNetworkName(channel.name) : '';

  const relatedChannels = useMemo(() =>
    channels.filter((ch) => ch.link !== channelLink && extractNetworkName(ch.name) === networkName).slice(0, 8),
    [channels, channelLink, networkName]
  );

  const channelEvents = useMemo(() =>
    (events || []).filter((e) => (e.channels || []).some((ch) => ch.link === channelLink)),
    [events, channelLink]
  );

  const embedUrl = getChannelEmbedUrl(channelLink);

  const handleShieldClick = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    const n = clickCount + 1; setClickCount(n);
    if (n < 2) { setShieldMsg(`Ad blocked! Click ${2 - n} more time${2 - n > 1 ? 's' : ''} to access`); setTimeout(() => setShieldMsg(''), 2000); }
    else { setShieldMsg('Shield lowered'); setTimeout(() => { setAdShieldActive(false); setShieldMsg(''); }, 600); }
  }, [clickCount]);

  useEffect(() => { setClickCount(0); setAdShieldActive(true); setShieldMsg(''); setLoading(true); }, [channelLink]);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const toggleFullscreen = () => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) c.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/channels" className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{cleanName}</h1>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{COUNTRY_FLAGS[country] || '🌍'} {country}</p>
          </div>
        </div>
        {channel && <FavoriteChannelButton channel={channel} />}
      </div>

      {/* Ad Shield Toggle */}
      <div className="flex items-center gap-2">
        <button onClick={() => { setAdShieldActive((p) => !p); setClickCount(0); setShieldMsg(''); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${adShieldActive ? 'bg-green-600/20 text-green-400 border-green-600/30' : isDark ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          {adShieldActive ? <Shield className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
          {adShieldActive ? 'Ad Shield ON' : 'Ad Shield OFF'}
        </button>
      </div>

      {/* Player */}
      <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-black">
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>}
        {adShieldActive && !loading && (
          <div className="absolute inset-0 z-20 cursor-pointer" onClick={handleShieldClick} style={{ background: 'transparent' }}>
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 text-green-400 text-[10px] font-medium pointer-events-none"><Shield className="w-3 h-3" />Ad Shield Active</div>
            {shieldMsg && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="px-4 py-2 rounded-lg bg-black/80 text-white text-sm font-medium animate-pulse">{shieldMsg}</div></div>}
          </div>
        )}
        <iframe key={embedUrl} src={embedUrl} className="w-full aspect-video" style={{ border: 'none' }} allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="no-referrer"
          onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
        <button onClick={toggleFullscreen} className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors z-30">
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      <div className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${isDark ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-50 text-gray-400'}`}>
        <MousePointerClick className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span><strong>Ad Shield:</strong> First 2 clicks absorbed to block ad popups.</span>
      </div>

      {/* Events on this channel */}
      {channelEvents.length > 0 && (
        <div>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Events on this Channel</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channelEvents.slice(0, 6).map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}

      {/* Related channels */}
      {relatedChannels.length > 0 && (
        <div>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>More from {networkName}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {relatedChannels.map((ch) => <ChannelCard key={ch.link} channel={ch} />)}
          </div>
        </div>
      )}
    </div>
  );
}
