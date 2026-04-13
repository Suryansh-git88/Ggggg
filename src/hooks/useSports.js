import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/topembed';

export function useSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.getSports()
      .then((data) => { if (!cancelled) setSports(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { sports, loading, error };
}
