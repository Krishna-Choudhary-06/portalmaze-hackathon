import { useState, useEffect } from 'react';
import { GameMetrics, GameMode, Position, Cell } from '../types/game';
import { Trophy, TrendingUp, Clock, Footprints, Award, Loader, Map, History } from 'lucide-react';
import { submitScore } from '../lib/supabase';
import { updateBestScore, addRecentRun, getRecentRuns } from '../lib/localStorage';

interface VictoryModalProps {
  playerName: string;
  levelName: string;
  mode: GameMode;
  metrics: GameMetrics;
  onNextLevel: () => void;
  onMainMenu: () => void;
  onViewLeaderboard: () => void;
  hasNextLevel: boolean;
  optimalPath: Position[];
  grid: Cell[][];
}

export function VictoryModal({
  playerName,
  levelName,
  mode,
  metrics,
  onNextLevel,
  onMainMenu,
  onViewLeaderboard,
  hasNextLevel,
  optimalPath,
  grid,
}: VictoryModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'solution' | 'recent'>('stats');
  const [isNewBest, setIsNewBest] = useState(false);
  const recentRuns = getRecentRuns(5);

  useEffect(() => {
    let isMounted = true;

    const handleSubmitScore = async () => {
      setSubmitting(true);
      setError(null);

      const modeStr = mode === GameMode.NO_WALL_BREAK ? 'NO_WALL_BREAK' : 'WALL_BREAK';

      const wasNewBest = updateBestScore(
        levelName,
        modeStr,
        metrics.stepCount,
        metrics.timeElapsed,
        metrics.efficiency
      );

      if (wasNewBest && isMounted) {
        setIsNewBest(true);
      }

      addRecentRun(
        levelName,
        modeStr,
        metrics.stepCount,
        metrics.timeElapsed,
        metrics.efficiency
      );

      try {
        await submitScore({
          player_name: playerName,
          mode: modeStr,
          level_name: levelName,
          steps_taken: metrics.stepCount,
          optimal_steps: metrics.optimalPathLength,
          efficiency: metrics.efficiency,
          time_seconds: metrics.timeElapsed,
          walls_broken: metrics.wallsBroken,
        });
        if (isMounted) {
          setSubmitted(true);
        }
      } catch (err) {
        console.error('Failed to submit score:', err);
        if (isMounted) {
          setError('Failed to submit score');
        }
      } finally {
        if (isMounted) {
          setSubmitting(false);
        }
      }
    };

    handleSubmitScore();

    return () => {
      isMounted = false;
    };
  }, [playerName, levelName, mode, metrics.stepCount, metrics.optimalPathLength, metrics.efficiency, metrics.timeElapsed, metrics.wallsBroken]);

  const getPerformanceRating = (efficiency: number): string => {
    if (efficiency >= 95) return 'Perfect!';
    if (efficiency >= 80) return 'Excellent!';
    if (efficiency >= 60) return 'Good';
    if (efficiency >= 40) return 'Fair';
    return 'Room for improvement';
  };

  const getRatingColor = (efficiency: number): string => {
    if (efficiency >= 95) return 'text-yellow-500';
    if (efficiency >= 80) return 'text-green-500';
    if (efficiency >= 60) return 'text-blue-500';
    if (efficiency >= 40) return 'text-orange-500';
    return 'text-slate-500';
  };

  const isOnOptimalPath = (row: number, col: number): boolean => {
    return optimalPath.some(pos => pos.row === row && pos.col === col);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform animate-bounce-in border border-slate-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full mb-4 shadow-2xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Mission Complete!
          </h2>
          <p
            className={`text-xl font-semibold ${getRatingColor(metrics.efficiency)}`}
          >
            {getPerformanceRating(metrics.efficiency)}
          </p>
          <p className="text-sm text-slate-300 mt-2">
            {playerName} • {levelName}
          </p>
          <p className="text-xs text-slate-400">
            {mode === GameMode.NO_WALL_BREAK ? 'No Wall Break' : 'Wall Break Mode'}
          </p>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-900/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Stats
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
              activeTab === 'solution'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-4 h-4" />
            Solution
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
              activeTab === 'recent'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Recent
          </button>
        </div>

        {submitting && (
          <div className="mb-4 p-3 bg-blue-500/20 rounded-lg flex items-center justify-center gap-2 text-blue-300 border border-blue-500/30">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Submitting to leaderboard...</span>
          </div>
        )}

        {submitted && (
          <div className="mb-4 p-3 bg-green-500/20 rounded-lg flex items-center gap-2 text-green-300 border border-green-500/30">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Score submitted to leaderboard!</span>
          </div>
        )}

        {isNewBest && (
          <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg flex items-center gap-2 text-yellow-300 border border-yellow-500/30 animate-pulse-subtle">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">New Personal Best!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 rounded-lg text-red-300 text-sm border border-red-500/30">
            {error}
          </div>
        )}

        {activeTab === 'stats' ? (
          <div className="space-y-3 mb-6 animate-fade-in" key="stats">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 text-slate-300">
                <Footprints className="w-5 h-5" />
                <span className="font-medium">Steps</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{metrics.stepCount}</div>
                <div className="text-xs text-slate-400">
                  Optimal: {metrics.optimalPathLength}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 text-slate-300">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Efficiency</span>
              </div>
              <div className="font-bold text-white">
                {metrics.efficiency.toFixed(1)}%
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Time</span>
              </div>
              <div className="font-bold text-white">
                {metrics.timeElapsed.toFixed(1)}s
              </div>
            </div>
          </div>
        ) : activeTab === 'solution' ? (
          <div className="mb-6 animate-fade-in" key="solution">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-bold text-cyan-400 mb-3">Optimal Path Preview</h3>
              <div className="flex items-center justify-center">
                <div
                  className="inline-grid gap-0.5 bg-slate-700 p-2 rounded-lg"
                  style={{
                    gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
                    maxWidth: '100%',
                  }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-4 h-4 rounded-sm
                          ${
                            isOnOptimalPath(rowIndex, colIndex)
                              ? 'bg-cyan-400 border border-cyan-500'
                              : cell.type === 'WALL'
                              ? 'bg-slate-800'
                              : cell.type === 'START'
                              ? 'bg-blue-600'
                              : cell.type === 'GOAL'
                              ? 'bg-amber-500'
                              : cell.type === 'PORTAL'
                              ? 'bg-purple-500'
                              : 'bg-slate-300'
                          }
                        `}
                      />
                    ))
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Cyan cells show the optimal path with {metrics.optimalPathLength} steps
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 animate-fade-in" key="recent">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-bold text-purple-400 mb-3">Recent Runs</h3>
              {recentRuns.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentRuns.map((run, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{run.levelName}</p>
                          <p className="text-xs text-slate-400">
                            {run.mode === 'NO_WALL_BREAK' ? 'No Wall Break' : 'Wall Break'}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(run.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-slate-400">Steps</p>
                          <p className="text-sm font-bold text-white">{run.steps}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Time</p>
                          <p className="text-sm font-bold text-white">{run.time.toFixed(1)}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Efficiency</p>
                          <p className="text-sm font-bold text-cyan-400">
                            {run.efficiency.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 py-4">No recent runs yet</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onMainMenu}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              Main Menu
            </button>
            {hasNextLevel && (
              <button
                onClick={onNextLevel}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Next Level
              </button>
            )}
          </div>
          <button
            onClick={onViewLeaderboard}
            className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
