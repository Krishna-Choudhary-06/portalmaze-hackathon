import { useState, useEffect } from 'react';
import { Cell, CellType, MazeData, Position } from '../types/game';
import { validateMaze } from '../algorithms/pathfinding';
import {
  Square,
  CircleDot,
  Flag,
  Home,
  CheckCircle2,
  XCircle,
  Play,
  Trash2,
} from 'lucide-react';

interface MapEditorProps {
  onPlayMap: (maze: MazeData) => void;
  onBack: () => void;
}

const PORTAL_COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
  'cyan',
  'purple',
  'orange',
  'pink',
];

export function MapEditor({ onPlayMap, onBack }: MapEditorProps) {
  const [gridSize, setGridSize] = useState({ rows: 8, cols: 8 });
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedTool, setSelectedTool] = useState<CellType>(CellType.WALL);
  const [selectedPortalColor, setSelectedPortalColor] = useState<string>('red');
  const [maxWallBreaks, setMaxWallBreaks] = useState(3);
  const [mapName, setMapName] = useState('Custom Map');
  const [validation, setValidation] = useState<{
    valid: boolean;
    errors: string[];
    reachableWithoutBreaks: boolean;
    reachableWithBreaks: boolean;
  } | null>(null);

  useEffect(() => {
    initializeGrid(gridSize.rows, gridSize.cols);
  }, []);

  const initializeGrid = (rows: number, cols: number) => {
    const newGrid: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        if (r === 0 && c === 0) {
          row.push({ type: CellType.START });
        } else if (r === rows - 1 && c === cols - 1) {
          row.push({ type: CellType.GOAL });
        } else {
          row.push({ type: CellType.EMPTY });
        }
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setValidation(null);
  };

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid.map(r => [...r])];

    if (selectedTool === CellType.PORTAL) {
      newGrid[row][col] = {
        type: CellType.PORTAL,
        portalColor: selectedPortalColor,
      };
    } else {
      newGrid[row][col] = { type: selectedTool };
    }

    setGrid(newGrid);
    setValidation(null);
  };

  const handleValidate = () => {
    const maze = buildMazeData();
    const result = validateMaze(maze);
    setValidation(result);
  };

  const handlePlay = () => {
    const maze = buildMazeData();
    const result = validateMaze(maze);

    if (!result.valid) {
      setValidation(result);
      return;
    }

    if (!result.reachableWithBreaks) {
      setValidation(result);
      alert('Goal is not reachable even with wall breaks!');
      return;
    }

    onPlayMap(maze);
  };

  const buildMazeData = (): MazeData => {
    let start: Position = { row: 0, col: 0 };
    let goal: Position = { row: 0, col: 0 };
    const portals = new Map<string, [Position, Position]>();
    const portalPositions = new Map<string, Position[]>();

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell.type === CellType.START) {
          start = { row: r, col: c };
        } else if (cell.type === CellType.GOAL) {
          goal = { row: r, col: c };
        } else if (cell.type === CellType.PORTAL && cell.portalColor) {
          if (!portalPositions.has(cell.portalColor)) {
            portalPositions.set(cell.portalColor, []);
          }
          portalPositions.get(cell.portalColor)!.push({ row: r, col: c });
        }
      }
    }

    portalPositions.forEach((positions, color) => {
      if (positions.length >= 2) {
        portals.set(color, [positions[0], positions[1]]);
      }
    });

    return {
      name: mapName,
      description: 'Custom created map',
      grid,
      maxWallBreaks,
      start,
      goal,
      portals,
    };
  };

  const handleResize = () => {
    if (
      gridSize.rows >= 5 &&
      gridSize.rows <= 20 &&
      gridSize.cols >= 5 &&
      gridSize.cols <= 20
    ) {
      initializeGrid(gridSize.rows, gridSize.cols);
    }
  };

  const getCellStyle = (cell: Cell): string => {
    switch (cell.type) {
      case CellType.WALL:
        return 'bg-slate-800 border border-slate-700';
      case CellType.START:
        return 'bg-blue-600 border border-blue-700';
      case CellType.GOAL:
        return 'bg-amber-500 border border-amber-600';
      case CellType.PORTAL:
        const colors: Record<string, string> = {
          red: 'bg-red-500',
          blue: 'bg-blue-500',
          green: 'bg-green-500',
          yellow: 'bg-yellow-500',
          cyan: 'bg-cyan-500',
          purple: 'bg-purple-500',
          orange: 'bg-orange-500',
          pink: 'bg-pink-500',
        };
        return `${colors[cell.portalColor || 'red']} border-2 border-white`;
      case CellType.EMPTY:
      default:
        return 'bg-slate-200 border border-slate-300';
    }
  };

  const getCellIcon = (cell: Cell) => {
    switch (cell.type) {
      case CellType.START:
        return <Home className="w-3 h-3 text-white" />;
      case CellType.GOAL:
        return <Flag className="w-3 h-3 text-white" />;
      case CellType.PORTAL:
        return <CircleDot className="w-3 h-3 text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Map Editor</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Map Name
              </label>
              <input
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Grid Size (5-20)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="5"
                  max="20"
                  value={gridSize.rows}
                  onChange={(e) =>
                    setGridSize({ ...gridSize, rows: parseInt(e.target.value) || 5 })
                  }
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Rows"
                />
                <span className="flex items-center text-slate-500">×</span>
                <input
                  type="number"
                  min="5"
                  max="20"
                  value={gridSize.cols}
                  onChange={(e) =>
                    setGridSize({ ...gridSize, cols: parseInt(e.target.value) || 5 })
                  }
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Cols"
                />
                <button
                  onClick={handleResize}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Resize
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Wall Breaks
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={maxWallBreaks}
                onChange={(e) => setMaxWallBreaks(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Tools</h2>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTool(CellType.EMPTY)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedTool === CellType.EMPTY
                      ? 'bg-slate-200 border-2 border-slate-400'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Square className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Empty</span>
                </button>

                <button
                  onClick={() => setSelectedTool(CellType.WALL)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedTool === CellType.WALL
                      ? 'bg-slate-800 text-white border-2 border-slate-900'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  <Square className="w-5 h-5" fill="currentColor" />
                  <span className="font-medium">Wall</span>
                </button>

                <button
                  onClick={() => setSelectedTool(CellType.START)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedTool === CellType.START
                      ? 'bg-blue-600 text-white border-2 border-blue-800'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Start</span>
                </button>

                <button
                  onClick={() => setSelectedTool(CellType.GOAL)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedTool === CellType.GOAL
                      ? 'bg-amber-500 text-white border-2 border-amber-700'
                      : 'bg-amber-400 text-white hover:bg-amber-500'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                  <span className="font-medium">Goal</span>
                </button>

                <button
                  onClick={() => setSelectedTool(CellType.PORTAL)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedTool === CellType.PORTAL
                      ? 'bg-green-600 text-white border-2 border-green-800'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  <CircleDot className="w-5 h-5" />
                  <span className="font-medium">Portal</span>
                </button>

                {selectedTool === CellType.PORTAL && (
                  <div className="pl-4 space-y-1">
                    {PORTAL_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedPortalColor(color)}
                        className={`w-full p-2 rounded flex items-center gap-2 transition-all ${
                          selectedPortalColor === color
                            ? 'ring-2 ring-slate-800'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-${color}-500`}
                          style={{
                            backgroundColor:
                              color === 'red'
                                ? '#ef4444'
                                : color === 'blue'
                                ? '#3b82f6'
                                : color === 'green'
                                ? '#10b981'
                                : color === 'yellow'
                                ? '#eab308'
                                : color === 'cyan'
                                ? '#06b6d4'
                                : color === 'purple'
                                ? '#a855f7'
                                : color === 'orange'
                                ? '#f97316'
                                : '#ec4899',
                          }}
                        ></div>
                        <span className="text-sm capitalize text-slate-700">
                          {color}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => initializeGrid(gridSize.rows, gridSize.cols)}
                  className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Grid
                </button>

                <button
                  onClick={handleValidate}
                  className="w-full p-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Validate
                </button>

                <button
                  onClick={handlePlay}
                  className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Play Map
                </button>

                <button
                  onClick={onBack}
                  className="w-full p-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Back to Menu
                </button>
              </div>

              {validation && (
                <div className="mt-4 p-4 rounded-lg border">
                  {validation.valid ? (
                    <div className="flex items-start gap-2 text-green-700">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Valid Map!</p>
                        <p className="text-sm mt-1">
                          Reachable without breaks:{' '}
                          {validation.reachableWithoutBreaks ? 'Yes' : 'No'}
                        </p>
                        <p className="text-sm">
                          Reachable with breaks:{' '}
                          {validation.reachableWithBreaks ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-red-700">
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Invalid Map</p>
                        <ul className="text-sm mt-1 space-y-1">
                          {validation.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center">
                <div
                  className="inline-grid gap-0.5 bg-slate-700 p-2 rounded-lg"
                  style={{
                    gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
                  }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`
                          w-8 h-8 flex items-center justify-center
                          transition-all duration-100 rounded-sm
                          hover:ring-2 hover:ring-blue-400 hover:z-10
                          ${getCellStyle(cell)}
                        `}
                      >
                        {getCellIcon(cell)}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
