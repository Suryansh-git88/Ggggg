export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
      <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" /></span>
      LIVE
    </span>
  );
}

export function VerifiedBadge() {
  return <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400" title="Verified">✓</span>;
}

export function SportBadge({ name, emoji }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 text-[10px] font-medium">
      {emoji && <span>{emoji}</span>}{name}
    </span>
  );
}

export function ChannelBadge({ name, verified }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-300 text-[10px] font-medium">
      {name}{verified && <span className="text-green-400">✓</span>}
    </span>
  );
}
