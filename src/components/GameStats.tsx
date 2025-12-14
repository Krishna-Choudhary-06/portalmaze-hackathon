import { GameMode, GameMetrics } from '../types/game';
import { TrendingUp, Clock, Footprints, Hammer } from 'lucide-react';

interface GameStatsProps {
  mode: GameMode;
  metrics: GameMetrics;
  wallsRemaining: number;
  maxWallBreaks: number;
  mazeName: string;
}

export function GameStats({
  mode,
  metrics,
  wallsRemaining,
  maxWallBreaks,
  mazeName,
}: GameStatsProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 space-y-4 border border-slate-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">{mazeName}</h2>
        <div className="mt-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
              mode === GameMode.NO_WALL_BREAK
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
            }`}
          >
            {mode === GameMode.NO_WALL_BREAK
              ? 'No Wall Break Mode'
              : 'Wall Break Mode'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-2 text-slate-300 mb-1">
            <Footprints className="w-4 h-4" />
            <span className="text-sm font-medium">Steps</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {metrics.stepCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Optimal: {metrics.optimalPathLength}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-2 text-slate-300 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Time</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {metrics.timeElapsed.toFixed(1)}s
          </div>
        </div>

        {mode === GameMode.WALL_BREAK && (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 text-slate-300 mb-1">
              <Hammer className="w-4 h-4" />
              <span className="text-sm font-medium">Wall Breaks</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">
              {metrics.wallsBroken} / {maxWallBreaks}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {wallsRemaining} remaining
            </div>
          </div>
        )}

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-2 text-slate-300 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Efficiency</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {metrics.efficiency.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
