import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import HomePage from './pages/HomePage';
import LivePage from './pages/LivePage';
import SportPage from './pages/SportPage';
import EventPage from './pages/EventPage';
import ChannelsPage from './pages/ChannelsPage';
import ChannelPlayerPage from './pages/ChannelPlayerPage';
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#0a0a0f] dark:bg-[#0a0a0f]">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 min-w-0 px-4 py-6 pb-20 lg:pb-6 max-w-6xl mx-auto w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/live" element={<LivePage />} />
                  <Route path="/sport/:sportName" element={<SportPage />} />
                  <Route path="/event/:eventId" element={<EventPage />} />
                  <Route path="/channels" element={<ChannelsPage />} />
                  <Route path="/channel/:channelLink" element={<ChannelPlayerPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
            <Footer />
            <MobileNav />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
