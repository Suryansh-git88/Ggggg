import { useTheme } from '../../context/ThemeContext';

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
      LIVE
    </span>
  );
}

export function HDBadge() {
  return (
    <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
      HD
    </span>
  );
}

export function PopularBadge() {
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400">
      HOT
    </span>
  );
}
