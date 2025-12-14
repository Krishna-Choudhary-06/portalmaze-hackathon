export enum CellType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  START = 'START',
  GOAL = 'GOAL',
  PORTAL = 'PORTAL',
}

export enum GameMode {
  NO_WALL_BREAK = 'NO_WALL_BREAK',
  WALL_BREAK = 'WALL_BREAK',
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  WON = 'WON',
  EDITOR = 'EDITOR',
}

export interface Cell {
  type: CellType;
  portalColor?: string;
}

export interface Position {
  row: number;
  col: number;
}

export interface PathNode {
  position: Position;
  wallsUsed: number;
  distance: number;
  parent?: PathNode;
}

export interface PathResult {
  length: number;
  path: Position[];
  exists: boolean;
}

export interface MazeData {
  name: string;
  description: string;
  grid: Cell[][];
  maxWallBreaks: number;
  start: Position;
  goal: Position;
  portals: Map<string, [Position, Position]>;
}

export interface GameMetrics {
  stepCount: number;
  wallsBroken: number;
  timeElapsed: number;
  visitedCells: Set<string>;
  optimalPathLength: number;
  efficiency: number;
}
