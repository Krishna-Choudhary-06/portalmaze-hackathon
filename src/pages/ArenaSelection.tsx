import { useState } from 'react';
import { MazeData, GameMode } from '../types/game';
import { LEVELS } from '../data/levels';
import { Shield, Hammer, Play, ArrowLeft, Trophy, Edit, Star } from 'lucide-react';
import { getAllBestScores } from '../lib/localStorage';

interface ArenaSelectionProps {
  playerName: string;
  onEnterArena: (level: MazeData, mode: GameMode) => void;
  onBack: () => void;
  onViewLeaderboard: () => void;
  onCreateCustomMap: () => void;
}

export function ArenaSelection({
  playerName,
  onEnterArena,
  onBack,
  onViewLeaderboard,
  onCreateCustomMap,
}: ArenaSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>(
    GameMode.NO_WALL_BREAK
  );
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  const currentLevel = LEVELS[selectedLevel];
  const allBestScores = getAllBestScores();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between animate-slide-down">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-right">
            <p className="text-blue-200 text-sm">Welcome back,</p>
            <p className="text-white font-bold text-xl">{playerName}</p>
          </div>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Arena Selection
          </h1>
          <p className="text-xl text-blue-200">
            Choose your challenge and game mode
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700 animate-slide-in-left">
              <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                Select Game Mode
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedMode(GameMode.NO_WALL_BREAK)}
                  className={`p-6 rounded-xl border-3 transition-all transform hover:scale-105 ${
                    selectedMode === GameMode.NO_WALL_BREAK
                      ? 'bg-blue-900/40 border-blue-500 ring-4 ring-blue-500/30'
                      : 'bg-slate-700/50 border-slate-600 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-100">
                        No Wall Break
                      </h3>
                      <p className="text-xs text-slate-400">Pure Navigation</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 text-left">
                    Navigate using only movement and portals. Find the optimal
                    path without breaking walls.
                  </p>
                </button>

                <button
                  onClick={() => setSelectedMode(GameMode.WALL_BREAK)}
                  className={`p-6 rounded-xl border-3 transition-all transform hover:scale-105 ${
                    selectedMode === GameMode.WALL_BREAK
                      ? 'bg-orange-900/40 border-orange-500 ring-4 ring-orange-500/30'
                      : 'bg-slate-700/50 border-slate-600 hover:border-orange-400'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Hammer className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-100">
                        Wall Break Mode
                      </h3>
                      <p className="text-xs text-slate-400">Strategic Breaking</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 text-left">
                    Break through walls strategically. Limited breaks make every
                    decision count.
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700 animate-slide-in-left animate-delay-100">
              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                Select Level
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {LEVELS.map((level, index) => {
                  const levelBestScores = allBestScores[level.name];
                  const noWallBest = levelBestScores?.NO_WALL_BREAK;
                  const wallBreakBest = levelBestScores?.WALL_BREAK;
                  const hasBestScore = noWallBest || wallBreakBest;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedLevel(index)}
                      className={`stagger-item w-full p-4 rounded-xl border-2 transition-all text-left transform hover:scale-102 ${
                        selectedLevel === index
                          ? 'bg-emerald-900/40 border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'bg-slate-700/50 border-slate-600 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-100">
                            {index + 1}. {level.name}
                          </h3>
                          {hasBestScore && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            index === 0
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : index <= 2
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {index === 0
                            ? 'Easy'
                            : index <= 2
                            ? 'Medium'
                            : 'Hard'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">
                        {level.description}
                      </p>
                      <div className="flex gap-3 text-xs text-slate-400 mb-2">
                        <span>
                          Grid: {level.grid.length} × {level.grid[0].length}
                        </span>
                        <span>•</span>
                        <span>Max Breaks: {level.maxWallBreaks}</span>
                        <span>•</span>
                        <span>Portals: {level.portals.size}</span>
                      </div>
                      {hasBestScore && (
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-600">
                          {noWallBest && (
                            <div className="bg-blue-500/10 rounded px-2 py-1.5 border border-blue-500/30">
                              <p className="text-xs text-blue-300 font-semibold mb-0.5">No Break Best</p>
                              <p className="text-xs text-slate-300">{noWallBest.steps} steps • {noWallBest.efficiency.toFixed(0)}%</p>
                            </div>
                          )}
                          {wallBreakBest && (
                            <div className="bg-orange-500/10 rounded px-2 py-1.5 border border-orange-500/30">
                              <p className="text-xs text-orange-300 font-semibold mb-0.5">Break Best</p>
                              <p className="text-xs text-slate-300">{wallBreakBest.steps} steps • {wallBreakBest.efficiency.toFixed(0)}%</p>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700 animate-slide-in-right">
              <h3 className="text-xl font-bold text-slate-100 mb-4">
                Mission Briefing
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">
                    Selected Level
                  </p>
                  <p className="text-lg font-bold text-slate-100">
                    {currentLevel.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">
                    Game Mode
                  </p>
                  <p className="text-lg font-bold text-slate-100">
                    {selectedMode === GameMode.NO_WALL_BREAK
                      ? 'No Wall Break'
                      : 'Wall Break Mode'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">
                    Max Wall Breaks
                  </p>
                  <p className="text-lg font-bold text-slate-100">
                    {selectedMode === GameMode.WALL_BREAK
                      ? currentLevel.maxWallBreaks
                      : 'Not Available'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm font-semibold text-slate-300 mb-2">
                    Controls:
                  </p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• WASD / Arrow Keys - Move</li>
                    <li>• ENTER - Teleport (on portal)</li>
                    {selectedMode === GameMode.WALL_BREAK && (
                      <li>• SHIFT + Move - Break wall</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEnterArena(currentLevel, selectedMode)}
              className="w-full px-6 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-xl font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transform hover:scale-105 animate-slide-in-right animate-delay-200"
            >
              <Play className="w-6 h-6" />
              Enter Arena
            </button>

            <button
              onClick={onViewLeaderboard}
              className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-105 animate-slide-in-right animate-delay-300"
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </button>

            <button
              onClick={onCreateCustomMap}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-105 animate-slide-in-right animate-delay-400"
            >
              <Edit className="w-5 h-5" />
              Create Custom Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
