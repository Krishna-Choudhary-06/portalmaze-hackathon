import { ArrowLeft, Target, Zap, Hammer, Flag } from 'lucide-react';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 animate-slide-down"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            How to Play
          </h1>
          <p className="text-xl text-blue-200">Master the art of PortalMaze</p>
        </div>

        <div className="space-y-6">
          <div className="stagger-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">
                  Objective
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Navigate from the blue START cell to the golden GOAL cell.
                  Your goal is to reach it using the fewest steps possible while
                  achieving the highest efficiency score.
                </p>
              </div>
            </div>
          </div>

          <div className="stagger-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              Basic Controls
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center gap-3 mb-2">
                  <kbd className="px-3 py-2 bg-slate-600 rounded text-white font-mono text-sm">
                    W A S D
                  </kbd>
                  <span className="text-slate-400">or</span>
                  <kbd className="px-3 py-2 bg-slate-600 rounded text-white font-mono text-sm">
                    Arrow Keys
                  </kbd>
                </div>
                <p className="text-sm text-slate-300">
                  Move one cell in any direction (up, down, left, right)
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center gap-3 mb-2">
                  <kbd className="px-3 py-2 bg-emerald-600 rounded text-white font-mono text-sm">
                    ENTER
                  </kbd>
                </div>
                <p className="text-sm text-slate-300">
                  Teleport to the paired portal when standing on a portal cell
                </p>
              </div>
            </div>
          </div>

          <div className="stagger-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">
                  Portal Mechanics
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Portals are color-coded and exist in pairs. When you stand on
                  a portal and press ENTER, you instantly teleport to its paired
                  portal. Portals are optional but can provide strategic shortcuts.
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-slate-300">Red Portals</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-slate-300">Blue Portals</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-slate-300">Green Portals</span>
              </div>
            </div>
          </div>

          <div className="stagger-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">
                  Wall-Breaking Mode
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  In Wall-Break Mode, you can destroy walls to create new paths.
                  Each level has a limited number of wall breaks. Use them wisely!
                </p>
              </div>
            </div>
            <div className="bg-orange-900/40 rounded-xl p-4 border-2 border-orange-500/30">
              <div className="flex items-center gap-3 mb-2">
                <kbd className="px-3 py-2 bg-orange-600 rounded text-white font-mono text-sm">
                  SHIFT
                </kbd>
                <span className="text-slate-300">+</span>
                <kbd className="px-3 py-2 bg-orange-600 rounded text-white font-mono text-sm">
                  Movement Key
                </kbd>
              </div>
              <p className="text-sm text-slate-300">
                Break a wall in the movement direction and move into that cell
              </p>
            </div>
          </div>

          <div className="stagger-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">
                  Game Modes
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-900/40 rounded-xl p-4 border-2 border-blue-500/30">
                <h3 className="font-bold text-slate-100 mb-2">
                  No Wall Break Mode
                </h3>
                <p className="text-sm text-slate-300">
                  Pure navigation challenge. Find the optimal path using only
                  movement and portals. Wall-breaking is completely disabled.
                </p>
              </div>

              <div className="bg-orange-900/40 rounded-xl p-4 border-2 border-orange-500/30">
                <h3 className="font-bold text-slate-100 mb-2">
                  Wall Break Mode
                </h3>
                <p className="text-sm text-slate-300">
                  Strategic challenge. Use limited wall breaks to create new
                  paths. Every break counts toward your strategy.
                </p>
              </div>
            </div>
          </div>

          <div className="stagger-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              Scoring System
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 font-bold text-blue-300 border border-blue-500/30">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-100 mb-1">
                    Step Count
                  </p>
                  <p className="text-sm text-slate-300">
                    Number of unique cells visited after leaving START. Fewer
                    steps means better performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 font-bold text-blue-300 border border-blue-500/30">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-100 mb-1">
                    Optimal Path
                  </p>
                  <p className="text-sm text-slate-300">
                    The game calculates the shortest possible path internally.
                    Your goal is to match or beat this optimal solution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 font-bold text-blue-300 border border-blue-500/30">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-100 mb-1">
                    Efficiency Score
                  </p>
                  <p className="text-sm text-slate-300">
                    Calculated as (Optimal Steps / Your Steps) × 100. Higher
                    efficiency means you're closer to the perfect solution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 font-bold text-blue-300 border border-blue-500/30">
                  4
                </div>
                <div>
                  <p className="font-semibold text-slate-100 mb-1">
                    Completion Time
                  </p>
                  <p className="text-sm text-slate-300">
                    Used as a tiebreaker when efficiency scores match.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="stagger-item bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-center border border-blue-500/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Play?
            </h2>
            <p className="text-blue-100 mb-6">
              Test your pathfinding skills and compete on the global leaderboard!
            </p>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg border-2 border-white/30 hover:border-white/50 transform hover:scale-105"
            >
              Start Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
