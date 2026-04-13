import { createContext, useContext, useState, useCallback } from 'react';
import { getFavoriteEvents, addFavoriteEvent, removeFavoriteEvent, isEventFavorite, getFavoriteChannels, addFavoriteChannel, removeFavoriteChannel, isChannelFavorite } from '../utils/storage';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favEvents, setFavEvents] = useState(() => getFavoriteEvents());
  const [favChannels, setFavChannels] = useState(() => getFavoriteChannels());

  const toggleEventFav = useCallback((event) => {
    if (isEventFavorite(event.id)) { removeFavoriteEvent(event.id); }
    else { addFavoriteEvent(event); }
    setFavEvents(getFavoriteEvents());
  }, []);

  const toggleChannelFav = useCallback((channel) => {
    if (isChannelFavorite(channel.link)) { removeFavoriteChannel(channel.link); }
    else { addFavoriteChannel(channel); }
    setFavChannels(getFavoriteChannels());
  }, []);

  const isEvFav = useCallback((id) => favEvents.some((f) => f.id === id), [favEvents]);
  const isChFav = useCallback((link) => favChannels.some((f) => f.link === link), [favChannels]);

  return (
    <FavoritesContext.Provider value={{ favEvents, favChannels, toggleEventFav, toggleChannelFav, isEvFav, isChFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
