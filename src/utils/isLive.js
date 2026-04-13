export function isLive(event) {
  const now = Math.floor(Date.now() / 1000);
  const start = event.unix_timestamp || event.timestamp;
  const durationSeconds = (event.duration || 120) * 60;
  return now >= start && now <= start + durationSeconds;
}

export function isUpcoming(event) {
  const now = Math.floor(Date.now() / 1000);
  return (event.unix_timestamp || event.timestamp) > now;
}

export function isFinished(event) {
  const now = Math.floor(Date.now() / 1000);
  const start = event.unix_timestamp || event.timestamp;
  const durationSeconds = (event.duration || 120) * 60;
  return now > start + durationSeconds;
}

export function getTimeUntilStart(event) {
  const now = Math.floor(Date.now() / 1000);
  const diff = (event.unix_timestamp || event.timestamp) - now;
  if (diff <= 0) return null;
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function getElapsedTime(event) {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - (event.unix_timestamp || event.timestamp);
  if (elapsed <= 0) return null;
  return `${Math.floor(elapsed / 60)}'`;
}
