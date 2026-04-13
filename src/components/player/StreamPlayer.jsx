import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getEventEmbedUrl, getChannelEmbedUrl } from '../../api/topembed';
import { Maximize, Minimize, Loader2, Shield, ShieldOff, MousePointerClick } from 'lucide-react';

export default function StreamPlayer({ eventId, channels }) {
  const [activeSource, setActiveSource] = useState('event');
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adShieldActive, setAdShieldActive] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [shieldMsg, setShieldMsg] = useState('');
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  const embedUrl = activeSource === 'event'
    ? getEventEmbedUrl(eventId)
    : getChannelEmbedUrl(activeSource);

  const handleShieldClick = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    const n = clickCount + 1;
    setClickCount(n);
    if (n < 2) { setShieldMsg(`Ad blocked! Click ${2 - n} more time${2 - n > 1 ? 's' : ''} to access player`); setTimeout(() => setShieldMsg(''), 2000); }
    else { setShieldMsg('Shield lowered'); setTimeout(() => { setAdShieldActive(false); setShieldMsg(''); }, 600); }
  }, [clickCount]);

  useEffect(() => { setClickCount(0); setAdShieldActive(true); setShieldMsg(''); setLoading(true); }, [activeSource]);

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
    <div className="space-y-3">
      {/* Ad Shield Toggle */}
      <div className="flex items-center gap-2">
        <button onClick={() => { setAdShieldActive((p) => !p); setClickCount(0); setShieldMsg(''); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${adShieldActive ? 'bg-green-600/20 text-green-400 border-green-600/30' : isDark ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          {adShieldActive ? <Shield className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
          {adShieldActive ? 'Ad Shield ON' : 'Ad Shield OFF'}
        </button>
      </div>

      {/* Player */}
      <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}
        {adShieldActive && !loading && (
          <div className="absolute inset-0 z-20 cursor-pointer" onClick={handleShieldClick} style={{ background: 'transparent' }}>
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 text-green-400 text-[10px] font-medium pointer-events-none">
              <Shield className="w-3 h-3" />Ad Shield Active — Click to access
            </div>
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

      {/* Info */}
      <div className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${isDark ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-50 text-gray-400'}`}>
        <MousePointerClick className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span><strong>Ad Shield:</strong> First 2 clicks absorbed to block ad popups, then player becomes interactive.</span>
      </div>

      {/* Source Selector */}
      {channels && channels.length > 0 && (
        <div className="space-y-1.5">
          <div className={`text-xs font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Stream Sources</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveSource('event')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${activeSource === 'event' ? 'bg-indigo-600 text-white border-indigo-500' : isDark ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}>
              Event Stream
            </button>
            {channels.map((ch, i) => (
              <button key={ch.link || i} onClick={() => setActiveSource(ch.link)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${activeSource === ch.link ? 'bg-indigo-600 text-white border-indigo-500' : isDark ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}>
                <span>{ch.name.replace(/\[.*\]$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim()}</span>
                {ch.is_verified && <span className="text-green-400 text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
