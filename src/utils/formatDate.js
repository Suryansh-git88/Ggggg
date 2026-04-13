export function formatEventDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 86400000);
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateStart.getTime() === todayStart.getTime()) return `Today ${timeStr}`;
  if (dateStart.getTime() === tomorrowStart.getTime()) return `Tomorrow ${timeStr}`;

  const diffDays = Math.floor((dateStart - todayStart) / 86400000);
  if (diffDays > 0 && diffDays < 7) {
    const dayName = date.toLocaleDateString([], { weekday: 'short' });
    return `${dayName} ${timeStr}`;
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatFullDate(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
