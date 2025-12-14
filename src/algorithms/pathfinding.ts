import { Cell, CellType, Position, PathResult, MazeData } from '../types/game';

const DIRECTIONS = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

function isValidPosition(row: number, col: number, grid: Cell[][]): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function positionKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

function stateKey(row: number, col: number, wallsUsed: number): string {
  return `${row},${col},${wallsUsed}`;
}

export function findShortestPathNoWallBreak(maze: MazeData): PathResult {
  const { grid, start, goal, portals } = maze;
  const queue: Array<{ pos: Position; distance: number; parent?: Position }> = [];
  const visited = new Set<string>();
  const parentMap = new Map<string, Position>();

  queue.push({ pos: start, distance: 0 });
  visited.add(positionKey(start));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { pos, distance } = current;

    if (pos.row === goal.row && pos.col === goal.col) {
      const path = reconstructPath(parentMap, start, goal);
      return {
        length: path.length - 1,
        path,
        exists: true,
      };
    }

    const currentCell = grid[pos.row][pos.col];
    let nextPositions: Position[] = [];

    DIRECTIONS.forEach(dir => {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;

      if (!isValidPosition(newRow, newCol, grid)) return;

      const nextCell = grid[newRow][newCol];
      const key = positionKey({ row: newRow, col: newCol });

      if (!visited.has(key) && nextCell.type !== CellType.WALL) {
        nextPositions.push({ row: newRow, col: newCol });
      }
    });

    if (currentCell.type === CellType.PORTAL && currentCell.portalColor) {
      const portalPair = portals.get(currentCell.portalColor);
      if (portalPair) {
        const [pos1, pos2] = portalPair;
        const teleportTarget =
          pos.row === pos1.row && pos.col === pos1.col ? pos2 : pos1;
        const key = positionKey(teleportTarget);
        if (!visited.has(key)) {
          nextPositions.push(teleportTarget);
        }
      }
    }

    nextPositions.forEach(nextPos => {
      const key = positionKey(nextPos);
      visited.add(key);
      parentMap.set(key, pos);
      queue.push({ pos: nextPos, distance: distance + 1 });
    });
  }

  return {
    length: Infinity,
    path: [],
    exists: false,
  };
}

export function findShortestPathWithWallBreaks(
  maze: MazeData,
  maxWallBreaks: number
): PathResult {
  const { grid, start, goal, portals } = maze;

  interface State {
    pos: Position;
    wallsUsed: number;
    distance: number;
    parent?: { pos: Position; wallsUsed: number };
  }

  const queue: State[] = [];
  const visited = new Set<string>();
  const parentMap = new Map<string, { pos: Position; wallsUsed: number }>();

  queue.push({ pos: start, wallsUsed: 0, distance: 0 });
  visited.add(stateKey(start.row, start.col, 0));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { pos, wallsUsed, distance } = current;

    if (pos.row === goal.row && pos.col === goal.col) {
      const path = reconstructPathWithStates(parentMap, start, goal, wallsUsed);
      return {
        length: path.length - 1,
        path,
        exists: true,
      };
    }

    const currentCell = grid[pos.row][pos.col];
    let nextStates: State[] = [];

    DIRECTIONS.forEach(dir => {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;

      if (!isValidPosition(newRow, newCol, grid)) return;

      const nextCell = grid[newRow][newCol];

      if (nextCell.type === CellType.WALL) {
        if (wallsUsed < maxWallBreaks) {
          const newWallsUsed = wallsUsed + 1;
          const key = stateKey(newRow, newCol, newWallsUsed);
          if (!visited.has(key)) {
            nextStates.push({
              pos: { row: newRow, col: newCol },
              wallsUsed: newWallsUsed,
              distance: distance + 1,
            });
          }
        }
      } else {
        const key = stateKey(newRow, newCol, wallsUsed);
        if (!visited.has(key)) {
          nextStates.push({
            pos: { row: newRow, col: newCol },
            wallsUsed,
            distance: distance + 1,
          });
        }
      }
    });

    if (currentCell.type === CellType.PORTAL && currentCell.portalColor) {
      const portalPair = portals.get(currentCell.portalColor);
      if (portalPair) {
        const [pos1, pos2] = portalPair;
        const teleportTarget =
          pos.row === pos1.row && pos.col === pos1.col ? pos2 : pos1;
        const key = stateKey(teleportTarget.row, teleportTarget.col, wallsUsed);
        if (!visited.has(key)) {
          nextStates.push({
            pos: teleportTarget,
            wallsUsed,
            distance: distance + 1,
          });
        }
      }
    }

    nextStates.forEach(nextState => {
      const key = stateKey(nextState.pos.row, nextState.pos.col, nextState.wallsUsed);
      visited.add(key);
      parentMap.set(key, { pos, wallsUsed });
      queue.push(nextState);
    });
  }

  return {
    length: Infinity,
    path: [],
    exists: false,
  };
}

function reconstructPath(
  parentMap: Map<string, Position>,
  start: Position,
  goal: Position
): Position[] {
  const path: Position[] = [];
  let current: Position | undefined = goal;

  while (current) {
    path.unshift(current);
    if (current.row === start.row && current.col === start.col) break;
    current = parentMap.get(positionKey(current));
  }

  return path;
}

function reconstructPathWithStates(
  parentMap: Map<string, { pos: Position; wallsUsed: number }>,
  start: Position,
  goal: Position,
  finalWallsUsed: number
): Position[] {
  const path: Position[] = [];
  let currentPos: Position | undefined = goal;
  let currentWalls = finalWallsUsed;

  while (currentPos) {
    path.unshift(currentPos);
    if (currentPos.row === start.row && currentPos.col === start.col) break;
    const parent = parentMap.get(stateKey(currentPos.row, currentPos.col, currentWalls));
    if (!parent) break;
    currentPos = parent.pos;
    currentWalls = parent.wallsUsed;
  }

  return path;
}

export function validateMaze(maze: MazeData): {
  valid: boolean;
  errors: string[];
  reachableWithoutBreaks: boolean;
  reachableWithBreaks: boolean;
} {
  const errors: string[] = [];

  if (maze.grid.length === 0 || maze.grid[0].length === 0) {
    errors.push('Maze grid is empty');
  }

  let startCount = 0;
  let goalCount = 0;
  const portalCounts = new Map<string, number>();

  for (let row = 0; row < maze.grid.length; row++) {
    for (let col = 0; col < maze.grid[row].length; col++) {
      const cell = maze.grid[row][col];
      if (cell.type === CellType.START) startCount++;
      if (cell.type === CellType.GOAL) goalCount++;
      if (cell.type === CellType.PORTAL && cell.portalColor) {
        portalCounts.set(
          cell.portalColor,
          (portalCounts.get(cell.portalColor) || 0) + 1
        );
      }
    }
  }

  if (startCount === 0) errors.push('No START cell found');
  if (startCount > 1) errors.push('Multiple START cells found');
  if (goalCount === 0) errors.push('No GOAL cell found');
  if (goalCount > 1) errors.push('Multiple GOAL cells found');

  portalCounts.forEach((count, color) => {
    if (count !== 2) {
      errors.push(`Portal color ${color} must have exactly 2 cells, found ${count}`);
    }
  });

  const pathNoBreak = findShortestPathNoWallBreak(maze);
  const pathWithBreaks = findShortestPathWithWallBreaks(maze, maze.maxWallBreaks);

  return {
    valid: errors.length === 0,
    errors,
    reachableWithoutBreaks: pathNoBreak.exists,
    reachableWithBreaks: pathWithBreaks.exists,
  };
}
