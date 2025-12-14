import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, ArrowLeft, Shield, Hammer, Loader } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../lib/supabase';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [mode, setMode] = useState<'NO_WALL_BREAK' | 'WALL_BREAK'>(
    'NO_WALL_BREAK'
  );
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [mode]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(mode, 50);
      setEntries(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Crown className="w-6 h-6 text-yellow-500" fill="currentColor" />;
    if (rank === 2)
      return <Medal className="w-6 h-6 text-slate-400" fill="currentColor" />;
    if (rank === 3)
      return <Medal className="w-6 h-6 text-amber-600" fill="currentColor" />;
    return <span className="text-slate-500 font-bold">{rank}</span>;
  };

  const getRankBgColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-300';
    if (rank === 2) return 'bg-slate-50 border-slate-300';
    if (rank === 3) return 'bg-amber-50 border-amber-300';
    return 'bg-white border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-slide-down">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-6 shadow-2xl animate-scale-in">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Leaderboard
            </h1>
            <p className="text-xl text-blue-200 animate-fade-in animate-delay-100">
              Compete with the best players worldwide
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700 animate-slide-up">
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMode('NO_WALL_BREAK')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 transform hover:scale-105 ${
                mode === 'NO_WALL_BREAK'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-100 hover:bg-slate-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              No Wall Break
            </button>
            <button
              onClick={() => setMode('WALL_BREAK')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 transform hover:scale-105 ${
                mode === 'WALL_BREAK'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-100 hover:bg-slate-700'
              }`}
            >
              <Hammer className="w-5 h-5" />
              Wall Break Mode
            </button>
          </div>

          {loading ? (
            <div className="py-20">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-blue-500/20 rounded-full animate-pulse-subtle"></div>
                </div>
                <span className="text-slate-200 font-medium text-lg animate-pulse-subtle">
                  Loading leaderboard...
                </span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-subtle"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-subtle animate-delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-subtle animate-delay-200"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="py-20 text-center animate-scale-in">
              <p className="text-red-400 font-medium mb-4">{error}</p>
              <button
                onClick={loadLeaderboard}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Retry
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-20 text-center animate-scale-in">
              <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-pulse-subtle" />
              <p className="text-slate-300 font-medium text-lg">
                No scores yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">
                      Player
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">
                      Level
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-slate-200">
                      Steps
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-slate-200">
                      Optimal
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-slate-200">
                      Efficiency
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-slate-200">
                      Time
                    </th>
                    {mode === 'WALL_BREAK' && (
                      <th className="px-4 py-3 text-center text-sm font-bold text-slate-200">
                        Breaks
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`stagger-item border-b border-slate-700 transition-all hover:bg-slate-700/30 ${
                        index === 0
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : index === 1
                          ? 'bg-slate-400/10 border-slate-400/30'
                          : index === 2
                          ? 'bg-amber-600/10 border-amber-600/30'
                          : 'bg-slate-800/20'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center w-10 h-10">
                          {getRankIcon(index + 1)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-100">
                          {entry.player_name}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-300">
                          {entry.level_name}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-slate-100">
                          {entry.steps_taken}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-slate-300">
                          {entry.optimal_steps}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-bold ${
                            entry.efficiency >= 95
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : entry.efficiency >= 80
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : entry.efficiency >= 60
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          }`}
                        >
                          {entry.efficiency.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-slate-200 font-medium">
                          {entry.time_seconds.toFixed(1)}s
                        </span>
                      </td>
                      {mode === 'WALL_BREAK' && (
                        <td className="px-4 py-4 text-center">
                          <span className="text-slate-200">
                            {entry.walls_broken}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-blue-200 text-sm">
            Rankings based on efficiency, then completion time
          </p>
        </div>
      </div>
    </div>
  );
}
