export function formatMatchDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diffMs < 0) {
    return 'LIVE';
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 86400000);
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateStart.getTime() === todayStart.getTime()) {
    return `Today ${timeStr}`;
  }
  if (dateStart.getTime() === tomorrowStart.getTime()) {
    return `Tomorrow ${timeStr}`;
  }
  if (diffDays < 7) {
    const dayName = date.toLocaleDateString([], { weekday: 'short' });
    return `${dayName} ${timeStr}`;
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function isLive(timestamp) {
  if (!timestamp) return false;
  const matchTime = new Date(timestamp).getTime();
  const now = Date.now();
  // Match is live if it started (in the past) and less than ~4 hours ago
  return matchTime < now && (now - matchTime) < 4 * 3600000;
}

export function isUpcoming(timestamp) {
  if (!timestamp) return false;
  return new Date(timestamp).getTime() > Date.now();
}

export function getCountdown(timestamp) {
  if (!timestamp) return null;
  const diff = new Date(timestamp).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
