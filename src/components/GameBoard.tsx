import { Cell, CellType, Position } from '../types/game';
import { User, Flag, Circle } from 'lucide-react';

interface GameBoardProps {
  grid: Cell[][];
  playerPos: Position;
  canTeleport: boolean;
  hintPath?: Position[];
  showHint?: boolean;
}

const PORTAL_COLORS: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
};

export function GameBoard({ grid, playerPos, canTeleport, hintPath = [], showHint = false }: GameBoardProps) {
  const isOnHintPath = (row: number, col: number): boolean => {
    if (!showHint) return false;
    return hintPath.some(pos => pos.row === row && pos.col === col);
  };

  const getCellStyle = (cell: Cell, row: number, col: number): string => {
    const isPlayer = row === playerPos.row && col === playerPos.col;
    const onHintPath = isOnHintPath(row, col);

    if (isPlayer) {
      return canTeleport
        ? 'bg-emerald-400 border-2 border-emerald-600'
        : 'bg-emerald-500 border-2 border-emerald-700';
    }

    if (onHintPath && !isPlayer) {
      return 'bg-yellow-300 border-2 border-yellow-500 shadow-lg shadow-yellow-400/50';
    }

    switch (cell.type) {
      case CellType.WALL:
        return 'bg-slate-800 border border-slate-700';
      case CellType.START:
        return 'bg-blue-600 border border-blue-700';
      case CellType.GOAL:
        return 'bg-amber-500 border border-amber-600';
      case CellType.PORTAL:
        const colorClass = PORTAL_COLORS[cell.portalColor || 'blue'];
        return `${colorClass} border-2 border-white`;
      case CellType.EMPTY:
      default:
        return 'bg-slate-200 border border-slate-300';
    }
  };

  const getCellContent = (cell: Cell, row: number, col: number) => {
    const isPlayer = row === playerPos.row && col === playerPos.col;

    if (isPlayer) {
      return <User className="w-6 h-6 text-white" strokeWidth={3} />;
    }

    switch (cell.type) {
      case CellType.GOAL:
        return <Flag className="w-6 h-6 text-white" strokeWidth={2.5} />;
      case CellType.PORTAL:
        return <Circle className="w-5 h-5 text-white" fill="currentColor" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div
        className="inline-grid gap-1 bg-slate-700 p-3 rounded-xl shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-14 h-14 flex items-center justify-center
                transition-all duration-150 rounded
                ${getCellStyle(cell, rowIndex, colIndex)}
              `}
            >
              {getCellContent(cell, rowIndex, colIndex)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
