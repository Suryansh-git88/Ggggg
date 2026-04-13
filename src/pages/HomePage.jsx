import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useMatches } from '../hooks/useMatches';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { isLive, isUpcoming } from '../utils/formatDate';
import { SPORTS, getSportById } from '../utils/constants';
import MatchCard from '../components/matches/MatchCard';
import SportGrid from '../components/sports/SportGrid';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import LiveIndicator from '../components/matches/LiveIndicator';
import { ChevronRight, Flame, Clock, Radio } from 'lucide-react';

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { matches, loading, error, refetch } = useMatches(null);

  useAutoRefresh(refetch, 60000);

  const liveMatches = useMemo(
    () => matches.filter((m) => isLive(m.date)).sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)),
    [matches]
  );

  const popularMatches = useMemo(
    () => matches.filter((m) => m.popular).slice(0, 12),
    [matches]
  );

  const upcomingMatches = useMemo(
    () => matches.filter((m) => isUpcoming(m.date)).sort((a, b) => a.date - b.date).slice(0, 12),
    [matches]
  );

  const matchCounts = useMemo(() => {
    const counts = {};
    matches.forEach((m) => {
      const cat = m.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [matches]);

  const heroMatch = useMemo(
    () => liveMatches.find((m) => m.popular) || liveMatches[0] || popularMatches[0],
    [liveMatches, popularMatches]
  );

  if (loading) return <Loader count={9} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-400 mb-4">Failed to load matches: {error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Hero */}
      {heroMatch && (
        <Link
          to={`/match/${heroMatch.category}/${heroMatch.id}`}
          className="block relative rounded-2xl overflow-hidden group"
        >
          <div className="aspect-[21/9] sm:aspect-[3/1] relative">
            {heroMatch.poster ? (
              <img src={heroMatch.poster} alt={heroMatch.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className={`w-full h-full ${isDark ? 'bg-gradient-to-br from-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-100 to-gray-100'}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            {isLive(heroMatch.date) && <LiveIndicator className="mb-2" />}
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">{heroMatch.title}</h2>
            <span className="text-white/60 text-sm flex items-center gap-1">
              <span>{getSportById(heroMatch.category).emoji}</span>
              {getSportById(heroMatch.category).name}
            </span>
          </div>
        </Link>
      )}

      {/* Live Now Strip */}
      {liveMatches.length > 0 && (
        <Section
          title="Live Now"
          icon={<Radio className="w-4 h-4 text-red-400" />}
          linkTo="/live"
          isDark={isDark}
        >
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {liveMatches.slice(0, 10).map((match) => (
              <div key={match.id} className="w-72 shrink-0">
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Sport Categories */}
      <Section title="Sports" icon={<Flame className="w-4 h-4 text-amber-400" />} isDark={isDark}>
        <SportGrid matchCounts={matchCounts} />
      </Section>

      {/* Popular Matches */}
      {popularMatches.length > 0 && (
        <Section title="Popular" icon={<Flame className="w-4 h-4 text-orange-400" />} isDark={isDark}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </Section>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <Section title="Upcoming" icon={<Clock className="w-4 h-4 text-blue-400" />} isDark={isDark}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </Section>
      )}

      {matches.length === 0 && (
        <EmptyState title="No matches available" message="Check back later for live and upcoming matches." />
      )}
    </div>
  );
}

function Section({ title, icon, linkTo, isDark, children }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {icon}
          {title}
        </h2>
        {linkTo && (
          <Link to={linkTo} className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
