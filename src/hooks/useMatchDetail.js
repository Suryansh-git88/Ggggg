import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/sportsrc';

export function useMatchDetail(category, matchId) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!category || !matchId) return;
    try {
      setError(null);
      const data = await api.getMatchDetail(category, matchId);
      setMatch(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, matchId]);

  useEffect(() => {
    setLoading(true);
    fetchDetail();
  }, [fetchDetail]);

  return { match, loading, error, refetch: fetchDetail };
}
