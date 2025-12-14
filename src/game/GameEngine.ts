import {
  Cell,
  CellType,
  GameMode,
  GameMetrics,
  MazeData,
  Position,
} from '../types/game';
import {
  findShortestPathNoWallBreak,
  findShortestPathWithWallBreaks,
} from '../algorithms/pathfinding';

export class GameEngine {
  private maze: MazeData;
  private playerPos: Position;
  private mode: GameMode;
  private wallsBroken: number;
  private visitedCells: Set<string>;
  private startTime: number;
  private optimalPathLength: number;
  private originalGrid: Cell[][];
  private optimalPath: Position[];
  private hintUsed: boolean;
  private showingHint: boolean;

  constructor(maze: MazeData, mode: GameMode) {
    const gridCopy = JSON.parse(JSON.stringify(maze.grid));
    const portalsCopy = new Map(maze.portals);

    this.maze = {
      ...maze,
      grid: gridCopy,
      portals: portalsCopy,
    };
    this.originalGrid = JSON.parse(JSON.stringify(maze.grid));
    this.playerPos = { ...maze.start };
    this.mode = mode;
    this.wallsBroken = 0;
    this.visitedCells = new Set();
    this.startTime = Date.now();
    this.hintUsed = false;
    this.showingHint = false;

    const pathResult = this.calculateOptimalPath();
    this.optimalPathLength = pathResult.length;
    this.optimalPath = pathResult.path;
  }

  private calculateOptimalPath(): { length: number; path: Position[] } {
    if (this.mode === GameMode.NO_WALL_BREAK) {
      const result = findShortestPathNoWallBreak({
        ...this.maze,
        grid: this.originalGrid,
      });
      return {
        length: result.exists ? result.length : Infinity,
        path: result.path,
      };
    } else {
      const result = findShortestPathWithWallBreaks(
        { ...this.maze, grid: this.originalGrid },
        this.maze.maxWallBreaks
      );
      return {
        length: result.exists ? result.length : Infinity,
        path: result.path,
      };
    }
  }

  public getPlayerPosition(): Position {
    return { ...this.playerPos };
  }

  public getGrid(): Cell[][] {
    return this.maze.grid;
  }

  public getMode(): GameMode {
    return this.mode;
  }

  public getWallsBroken(): number {
    return this.wallsBroken;
  }

  public getRemainingWallBreaks(): number {
    return Math.max(0, this.maze.maxWallBreaks - this.wallsBroken);
  }

  public getMaxWallBreaks(): number {
    return this.maze.maxWallBreaks;
  }

  public getMetrics(): GameMetrics {
    const stepCount = this.visitedCells.size;
    const timeElapsed = (Date.now() - this.startTime) / 1000;
    const efficiency =
      this.optimalPathLength === 0
        ? 100
        : Math.max(0, Math.min(100, (this.optimalPathLength / stepCount) * 100));

    return {
      stepCount,
      wallsBroken: this.wallsBroken,
      timeElapsed,
      visitedCells: new Set(this.visitedCells),
      optimalPathLength: this.optimalPathLength,
      efficiency,
    };
  }

  public isGoalReached(): boolean {
    return (
      this.playerPos.row === this.maze.goal.row &&
      this.playerPos.col === this.maze.goal.col
    );
  }

  public move(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    const dirMap = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };

    const dir = dirMap[direction];
    const newRow = this.playerPos.row + dir.row;
    const newCol = this.playerPos.col + dir.col;

    if (!this.isValidPosition(newRow, newCol)) {
      return false;
    }

    const targetCell = this.maze.grid[newRow][newCol];

    if (targetCell.type === CellType.WALL) {
      return false;
    }

    this.playerPos = { row: newRow, col: newCol };
    this.visitedCells.add(`${newRow},${newCol}`);

    return true;
  }

  public breakWall(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    if (this.mode === GameMode.NO_WALL_BREAK) {
      return false;
    }

    if (this.wallsBroken >= this.maze.maxWallBreaks) {
      return false;
    }

    const dirMap = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };

    const dir = dirMap[direction];
    const newRow = this.playerPos.row + dir.row;
    const newCol = this.playerPos.col + dir.col;

    if (!this.isValidPosition(newRow, newCol)) {
      return false;
    }

    const targetCell = this.maze.grid[newRow][newCol];

    if (targetCell.type !== CellType.WALL) {
      return false;
    }

    this.maze.grid[newRow][newCol] = { type: CellType.EMPTY };
    this.wallsBroken++;

    this.playerPos = { row: newRow, col: newCol };
    this.visitedCells.add(`${newRow},${newCol}`);

    return true;
  }

  public teleport(): boolean {
    const currentCell = this.maze.grid[this.playerPos.row][this.playerPos.col];

    if (currentCell.type !== CellType.PORTAL || !currentCell.portalColor) {
      return false;
    }

    const portalPair = this.maze.portals.get(currentCell.portalColor);
    if (!portalPair) {
      return false;
    }

    const [pos1, pos2] = portalPair;
    const teleportTarget =
      this.playerPos.row === pos1.row && this.playerPos.col === pos1.col
        ? pos2
        : pos1;

    this.playerPos = { ...teleportTarget };
    this.visitedCells.add(`${teleportTarget.row},${teleportTarget.col}`);

    return true;
  }

  public canTeleport(): boolean {
    const currentCell = this.maze.grid[this.playerPos.row][this.playerPos.col];
    return currentCell.type === CellType.PORTAL && !!currentCell.portalColor;
  }

  private isValidPosition(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.maze.grid.length &&
      col >= 0 &&
      col < this.maze.grid[0].length
    );
  }

  public getMazeName(): string {
    return this.maze.name;
  }

  public getMazeDescription(): string {
    return this.maze.description;
  }

  public getOptimalPath(): Position[] {
    return this.optimalPath;
  }

  public getNextHintSteps(): Position[] {
    if (!this.showingHint || this.optimalPath.length === 0) {
      return [];
    }

    const currentPath = this.mode === GameMode.NO_WALL_BREAK
      ? findShortestPathNoWallBreak(this.maze)
      : findShortestPathWithWallBreaks(this.maze, this.getRemainingWallBreaks());

    if (!currentPath.exists || currentPath.path.length === 0) {
      return [];
    }

    const nextSteps = currentPath.path.slice(0, 3);
    return nextSteps;
  }

  public canUseHint(): boolean {
    return !this.hintUsed;
  }

  public isHintActive(): boolean {
    return this.showingHint;
  }

  public toggleHint(): boolean {
    if (!this.hintUsed) {
      this.hintUsed = true;
      this.showingHint = true;
      return true;
    }
    return false;
  }

  public hideHint(): void {
    this.showingHint = false;
  }
}
