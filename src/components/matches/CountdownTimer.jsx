import { useState, useEffect } from 'react';
import { getCountdown } from '../../utils/formatDate';
import { useTheme } from '../../context/ThemeContext';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ timestamp }) {
  const [countdown, setCountdown] = useState(() => getCountdown(timestamp));
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(getCountdown(timestamp));
    }, 1000);
    return () => clearInterval(id);
  }, [timestamp]);

  if (!countdown) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
      <Clock className="w-3 h-3" />
      {countdown}
    </span>
  );
}
