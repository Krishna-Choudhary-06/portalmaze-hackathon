import { GameMode, MazeData } from '../types/game';
import { Play, Shield, Hammer, Map, Trophy } from 'lucide-react';
import { getBestScore } from '../lib/localStorage';

interface GameOpeningProps {
  playerName: string;
  level: MazeData;
  mode: GameMode;
  onStartMission: () => void;
  onBack: () => void;
}

export function GameOpening({
  playerName,
  level,
  mode,
  onStartMission,
  onBack,
}: GameOpeningProps) {
  const bestScore = getBestScore(
    level.name,
    mode === GameMode.NO_WALL_BREAK ? 'NO_WALL_BREAK' : 'WALL_BREAK'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full animate-scale-in">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl mb-6 shadow-xl animate-pulse-subtle">
              <Map className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Mission Ready
            </h1>
            <p className="text-xl text-blue-200">Prepare for deployment</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 mb-8 space-y-4 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-300 mb-1">
                  Agent
                </p>
                <p className="text-2xl font-bold text-white">{playerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Map className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-300 mb-1">
                  Mission
                </p>
                <p className="text-2xl font-bold text-white">{level.name}</p>
                <p className="text-sm text-blue-200 mt-1">
                  {level.description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  mode === GameMode.NO_WALL_BREAK
                    ? 'bg-blue-500/20'
                    : 'bg-orange-500/20'
                }`}
              >
                {mode === GameMode.NO_WALL_BREAK ? (
                  <Shield className="w-6 h-6 text-blue-400" />
                ) : (
                  <Hammer className="w-6 h-6 text-orange-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-300 mb-1">
                  Game Mode
                </p>
                <p className="text-2xl font-bold text-white">
                  {mode === GameMode.NO_WALL_BREAK
                    ? 'No Wall Break'
                    : 'Wall Break Mode'}
                </p>
                {mode === GameMode.WALL_BREAK && (
                  <p className="text-sm text-orange-300 mt-1">
                    Max Wall Breaks: {level.maxWallBreaks}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 mb-8 animate-slide-up animate-delay-100">
            <h3 className="text-lg font-bold text-white mb-4">
              Mission Objectives
            </h3>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold shrink-0">1.</span>
                <span>Navigate from START to GOAL using optimal pathfinding</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold shrink-0">2.</span>
                <span>
                  Use color-paired portals strategically to find shortcuts
                </span>
              </li>
              {mode === GameMode.WALL_BREAK && (
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">3.</span>
                  <span>
                    Break walls wisely - you have {level.maxWallBreaks} breaks
                    available
                  </span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold shrink-0">
                  {mode === GameMode.WALL_BREAK ? '4.' : '3.'}
                </span>
                <span>Minimize steps to maximize efficiency score</span>
              </li>
            </ul>
          </div>

          {bestScore && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl p-6 mb-8 border border-yellow-500/30 animate-slide-up animate-delay-200">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Your Best Score</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-blue-300 mb-1">Steps</p>
                  <p className="text-2xl font-bold text-white">{bestScore.steps}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-300 mb-1">Time</p>
                  <p className="text-2xl font-bold text-white">{bestScore.time.toFixed(1)}s</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-300 mb-1">Efficiency</p>
                  <p className="text-2xl font-bold text-yellow-400">{bestScore.efficiency.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-2xl p-6 mb-8 animate-slide-up animate-delay-300">
            <h3 className="text-lg font-bold text-white mb-4">Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-3 py-1 bg-slate-700 rounded text-white font-mono">
                  W A S D
                </kbd>
                <span className="text-blue-200">Movement</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-3 py-1 bg-slate-700 rounded text-white font-mono">
                  ↑ ↓ ← →
                </kbd>
                <span className="text-blue-200">Alt Movement</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-3 py-1 bg-emerald-600 rounded text-white font-mono">
                  ENTER
                </kbd>
                <span className="text-blue-200">Teleport (on portal)</span>
              </div>
              {mode === GameMode.WALL_BREAK && (
                <div className="flex items-center gap-2">
                  <kbd className="px-3 py-1 bg-orange-600 rounded text-white font-mono">
                    SHIFT + Move
                  </kbd>
                  <span className="text-blue-200">Break Wall</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 animate-slide-up animate-delay-400">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border-2 border-white/20 hover:border-white/40 transform hover:scale-105"
            >
              Back
            </button>
            <button
              onClick={onStartMission}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-lg transform hover:scale-105 animate-pulse-subtle"
            >
              <Play className="w-6 h-6" />
              Start Mission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
