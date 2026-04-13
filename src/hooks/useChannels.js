import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/topembed';

export function useChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChannels = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getChannels();
      setChannels(data.filter((ch) => ch.show_on_livetv !== false));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { setLoading(true); fetchChannels(); }, [fetchChannels]);

  return { channels, loading, error, refetch: fetchChannels };
}
