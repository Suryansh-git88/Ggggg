import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SportPage from './pages/SportPage';
import MatchPage from './pages/MatchPage';
import LivePage from './pages/LivePage';
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';
import StandingsPage from './pages/StandingsPage';
import NotFoundPage from './pages/NotFoundPage';

function AppLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-6 pb-20 lg:pb-6 max-w-7xl mx-auto w-full">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/sport/:sportSlug" element={<SportPage />} />
              <Route path="/match/:sportSlug/:matchId" element={<MatchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/standings/:sportSlug" element={<StandingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <AppLayout />
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
