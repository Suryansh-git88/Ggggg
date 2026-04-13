import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getSportById } from '../utils/constants';
import { api } from '../api/sportsrc';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { ArrowLeft, BarChart3 } from 'lucide-react';

export default function StandingsPage() {
  const { sportSlug } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sport = getSportById(sportSlug);
  const [tables, setTables] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getTables(sportSlug)
      .then((data) => setTables(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sportSlug]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <Link to={`/sport/${sportSlug}`} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {sport.emoji} {sport.name} Standings
          </h1>
        </div>
      </div>

      {loading ? (
        <Loader count={3} />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
        </div>
      ) : !tables || (Array.isArray(tables) && tables.length === 0) ? (
        <EmptyState title="No standings available" message={`Standings for ${sport.name} are not available yet.`} icon="📊" />
      ) : (
        <div className="space-y-6">
          {Array.isArray(tables) ? (
            tables.map((table, idx) => <StandingsTable key={idx} table={table} isDark={isDark} />)
          ) : typeof tables === 'object' ? (
            <StandingsTable table={tables} isDark={isDark} />
          ) : (
            <pre className={`text-sm p-4 rounded-xl overflow-auto ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-50 text-gray-700'}`}>
              {JSON.stringify(tables, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function StandingsTable({ table, isDark }) {
  if (!table) return null;

  // Handle various response shapes
  const title = table.name || table.title || table.league || '';
  const rows = table.rows || table.standings || table.teams || table.data || [];

  if (!Array.isArray(rows) || rows.length === 0) {
    if (typeof table === 'object') {
      return (
        <div className={`rounded-xl p-4 overflow-auto ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
          {title && <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>}
          <pre className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {JSON.stringify(table, null, 2)}
          </pre>
        </div>
      );
    }
    return null;
  }

  const columns = Object.keys(rows[0] || {});

  return (
    <div className={`rounded-xl overflow-hidden border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      {title && (
        <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
              {columns.map((col) => (
                <th key={col} className={`px-3 py-2 text-left text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-t ${isDark ? 'border-slate-700 hover:bg-slate-700/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                {columns.map((col) => (
                  <td key={col} className={`px-3 py-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
