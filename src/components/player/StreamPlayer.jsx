import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Maximize, Minimize, Loader2 } from 'lucide-react';

export default function StreamPlayer({ sources }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!sources || sources.length === 0) {
    return (
      <div className={`flex items-center justify-center aspect-video rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No streams available for this match.</p>
      </div>
    );
  }

  const currentSource = sources[activeIndex];

  const toggleFullscreen = () => {
    const container = document.getElementById('stream-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="space-y-3">
      <div id="stream-container" className="relative rounded-xl overflow-hidden bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        )}
        <iframe
          key={currentSource.embedUrl}
          src={currentSource.embedUrl}
          className="w-full aspect-video"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors z-20"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      <StreamSourceList
        sources={sources}
        activeIndex={activeIndex}
        onSelect={(i) => { setActiveIndex(i); setLoading(true); }}
        isDark={isDark}
      />
    </div>
  );
}

function StreamSourceList({ sources, activeIndex, onSelect, isDark }) {
  const HEAT_COLORS = {
    veryhigh: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
    none: 'bg-gray-500',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source, i) => (
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
            <span className={`text-[10px] ${activeIndex === i ? 'text-white/70' : isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              {source.language}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
