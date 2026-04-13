import { useEffect, useRef } from 'react';

export function useAutoRefresh(callback, intervalMs = 60000) {
  const cbRef = useRef(callback);
  useEffect(() => { cbRef.current = callback; }, [callback]);
  useEffect(() => {
    const id = setInterval(() => cbRef.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
