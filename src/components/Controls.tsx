import { GameMode } from '../types/game';
import { Hammer } from 'lucide-react';

interface ControlsProps {
  mode: GameMode;
  canTeleport: boolean;
}

export function Controls({ mode, canTeleport }: ControlsProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl p-4 border border-slate-700">
      <div className="space-y-3">
        <div className="text-center">
          <h4 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 uppercase tracking-wider">
            Keyboard Controls
          </h4>
        </div>

        <div className="space-y-2 text-[11px] text-slate-300">
          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-800/50 rounded">
            <span className="font-semibold">Move</span>
            <span className="text-amber-400 font-bold">WASD / Arrow Keys</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-800/50 rounded">
            <span className="font-semibold">Teleport</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">ENTER</span>
              {canTeleport && (
                <span className="text-emerald-400 text-[9px] font-black animate-pulse">READY</span>
              )}
            </div>
          </div>

          {mode === GameMode.WALL_BREAK && (
            <div className="flex items-center justify-between px-2 py-1.5 bg-slate-800/50 rounded">
              <span className="font-semibold">Break Wall</span>
              <div className="flex items-center gap-1">
                <Hammer className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 font-bold">SHIFT + DIR</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700">
        <h4 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 uppercase tracking-wider text-center">
          Legend
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1.5 group">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded border border-blue-400 shadow group-hover:scale-110 transition-transform"></div>
            <span className="text-slate-300 font-semibold">Start</span>
          </div>
          <div className="flex items-center gap-1.5 group">
            <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded border border-yellow-300 shadow group-hover:scale-110 transition-transform"></div>
            <span className="text-slate-300 font-semibold">Goal</span>
          </div>
          <div className="flex items-center gap-1.5 group">
            <div className="w-4 h-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded border border-slate-600 shadow group-hover:scale-110 transition-transform"></div>
            <span className="text-slate-300 font-semibold">Wall</span>
          </div>
          <div className="flex items-center gap-1.5 group">
            <div className="w-4 h-4 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full border border-fuchsia-300 shadow animate-pulse group-hover:scale-110 transition-transform"></div>
            <span className="text-slate-300 font-semibold">Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
