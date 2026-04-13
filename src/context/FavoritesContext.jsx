import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getFavorites, addFavorite, removeFavorite, isFavorite as checkFavorite } from '../utils/storage';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getFavorites());

  const refresh = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  const toggleFavorite = useCallback((match) => {
    if (checkFavorite(match.id)) {
      removeFavorite(match.id);
    } else {
      addFavorite(match);
    }
    refresh();
  }, [refresh]);

  const isMatchFavorite = useCallback((matchId) => {
    return favorites.some((f) => f.id === matchId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isMatchFavorite, refresh }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
