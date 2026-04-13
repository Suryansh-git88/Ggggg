import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useMatches } from '../hooks/useMatches';
import { getSportById } from '../utils/constants';
import MatchCard from '../components/matches/MatchCard';
import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { matches, loading } = useMatches(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return matches.filter((m) => {
      const title = (m.title || '').toLowerCase();
      const homeName = (m.teams?.home?.name || '').toLowerCase();
      const awayName = (m.teams?.away?.name || '').toLowerCase();
      return title.includes(q) || homeName.includes(q) || awayName.includes(q);
    });
  }, [matches, query]);

  const groupedBySport = useMemo(() => {
    const groups = {};
    filtered.forEach((m) => {
      const cat = m.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(m);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-5 h-5 text-blue-400" />
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Search</h1>
      </div>

      <SearchBar className="max-w-xl" />

      {loading ? (
        <Loader count={6} />
      ) : !query.trim() ? (
        <EmptyState title="Search for matches" message="Type a team name to find matches." icon="🔍" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No results" message={`No matches found for "${query}".`} icon="😕" />
      ) : (
        <div className="space-y-6">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
          {Object.entries(groupedBySport).map(([sportId, sportMatches]) => {
            const sport = getSportById(sportId);
            return (
              <section key={sportId}>
                <h2 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className="text-lg">{sport.emoji}</span>
                  {sport.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sportMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
