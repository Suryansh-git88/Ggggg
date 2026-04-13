import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/topembed';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { setLoading(true); fetchEvents(); }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
