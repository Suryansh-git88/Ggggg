import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Maximize, Minimize, Loader2, Shield, ShieldOff, Globe, MousePointerClick } from 'lucide-react';

const PREFERRED_LANGUAGES = ['Hindi', 'hindi', 'HINDI', 'हिन्दी', 'English'];

function sortSourcesByLanguage(sources, preferHindi) {
  if (!sources || sources.length === 0) return [];
  if (!preferHindi) return sources;

  return [...sources].sort((a, b) => {
    const aLang = (a.language || '').toLowerCase();
    const bLang = (b.language || '').toLowerCase();
    const aIsHindi = aLang.includes('hindi');
    const bIsHindi = bLang.includes('hindi');
    if (aIsHindi && !bIsHindi) return -1;
    if (!aIsHindi && bIsHindi) return 1;
    // Then prefer by heat tier
    const tierOrder = { veryhigh: 0, high: 1, medium: 2, low: 3, none: 4 };
    return (tierOrder[a.heatTier] || 4) - (tierOrder[b.heatTier] || 4);
  });
}

export default function StreamPlayer({ sources }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adShieldActive, setAdShieldActive] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [preferHindi, setPreferHindi] = useState(() => {
    try { return localStorage.getItem('sports_prefer_hindi') === 'true'; } catch { return false; }
  });
  const [shieldMessage, setShieldMessage] = useState('');
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sortedSources = sortSourcesByLanguage(sources, preferHindi);

  // Toggle Hindi preference
  const toggleHindi = useCallback(() => {
    setPreferHindi((prev) => {
      const next = !prev;
      try { localStorage.setItem('sports_prefer_hindi', String(next)); } catch {}
      return next;
    });
    setActiveIndex(0);
    setLoading(true);
  }, []);

  // Toggle ad shield
  const toggleAdShield = useCallback(() => {
    setAdShieldActive((prev) => !prev);
    setClickCount(0);
    setShieldMessage('');
  }, []);

  // Handle shield clicks - absorb first 2 clicks (ad triggers), then allow through
  const handleShieldClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount < 2) {
      setShieldMessage(`Ad blocked! Click ${2 - newCount} more time${2 - newCount > 1 ? 's' : ''} to access player`);
      setTimeout(() => setShieldMessage(''), 2000);
    } else {
      setShieldMessage('Shield lowered — player is now interactive');
      setTimeout(() => {
        setAdShieldActive(false);
        setShieldMessage('');
      }, 800);
    }
  }, [clickCount]);

  // Reset shield when switching servers
  useEffect(() => {
    setClickCount(0);
    setAdShieldActive(true);
    setShieldMessage('');
  }, [activeIndex]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  if (!sortedSources || sortedSources.length === 0) {
    return (
      <div className={`flex items-center justify-center aspect-video rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No streams available for this match.</p>
      </div>
    );
  }

  const currentSource = sortedSources[activeIndex];

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="space-y-3">
      {/* Player Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Ad Shield Toggle */}
          <button
            onClick={toggleAdShield}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              adShieldActive
                ? 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30'
                : isDark
                ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
            }`}
            title={adShieldActive ? 'Ad Shield is ON — blocking ad clicks' : 'Ad Shield is OFF'}
          >
            {adShieldActive ? <Shield className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
            {adShieldActive ? 'Ad Shield ON' : 'Ad Shield OFF'}
          </button>
        </div>

        {/* Hindi Preference Toggle */}
        <button
          onClick={toggleHindi}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            preferHindi
              ? 'bg-orange-600/20 text-orange-400 border-orange-600/30 hover:bg-orange-600/30'
              : isDark
              ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          {preferHindi ? 'Hindi Preferred' : 'All Languages'}
        </button>
      </div>

      {/* Stream Player */}
      <div ref={containerRef} id="stream-container" className="relative rounded-xl overflow-hidden bg-black">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="text-xs text-slate-400">Loading stream...</span>
            </div>
          </div>
        )}

        {/* Ad Shield Overlay */}
        {adShieldActive && !loading && (
          <div
            className="absolute inset-0 z-20 cursor-pointer"
            onClick={handleShieldClick}
            style={{ background: 'transparent' }}
          >
            {/* Shield indicator */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 text-green-400 text-[10px] font-medium pointer-events-none">
              <Shield className="w-3 h-3" />
              Ad Shield Active — Click to access player
            </div>

            {/* Shield click feedback message */}
            {shieldMessage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 rounded-lg bg-black/80 text-white text-sm font-medium animate-pulse">
                  {shieldMessage}
                </div>
              </div>
            )}
          </div>
        )}

        {/* The actual iframe — removed restrictive sandbox, added proper permissions */}
        <iframe
          ref={iframeRef}
          key={currentSource.embedUrl}
          src={currentSource.embedUrl}
          className="w-full aspect-video"
          style={{ border: 'none' }}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="no-referrer"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors z-30"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* Ad Shield Info */}
      <div className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${isDark ? 'bg-slate-800/50 text-slate-500' : 'bg-gray-50 text-gray-400'}`}>
        <MousePointerClick className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          <strong>Ad Shield:</strong> When enabled, the first 2 clicks are absorbed to block ad popups. 
          After that, the shield lowers to let you interact with the player. 
          Toggle it off if you want direct access immediately.
        </span>
      </div>

      {/* Server Selector */}
      <StreamSourceList
        sources={sortedSources}
        activeIndex={activeIndex}
        onSelect={(i) => { setActiveIndex(i); setLoading(true); }}
        isDark={isDark}
        preferHindi={preferHindi}
      />
    </div>
  );
}

function StreamSourceList({ sources, activeIndex, onSelect, isDark, preferHindi }) {
  const HEAT_COLORS = {
    veryhigh: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
    none: 'bg-gray-500',
  };

  return (
    <div className="space-y-2">
      <div className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        Stream Sources {preferHindi && '(Hindi prioritized)'}
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, i) => {
          const lang = (source.language || '').toLowerCase();
          const isHindi = lang.includes('hindi');

          return (
            <button
              key={source.embedUrl || i}
              onClick={() => onSelect(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                activeIndex === i
                  ? 'bg-blue-600 text-white border-blue-500'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${HEAT_COLORS[source.heatTier] || HEAT_COLORS.none}`} />
              <span>Server {source.streamNo || i + 1}</span>
              {source.hd && (
                <span className={`text-[10px] font-bold px-1 rounded ${activeIndex === i ? 'bg-white/20' : 'bg-blue-500/20 text-blue-400'}`}>
                  HD
                </span>
              )}
              {source.language && (
                <span className={`text-[10px] px-1 rounded ${
                  isHindi
                    ? activeIndex === i ? 'bg-orange-400/30 text-orange-200' : 'bg-orange-500/20 text-orange-400 font-semibold'
                    : activeIndex === i ? 'text-white/70' : isDark ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  {source.language}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
