import { MazeData, Cell, CellType, Position } from '../types/game';

const E: Cell = { type: CellType.EMPTY };
const W: Cell = { type: CellType.WALL };
const S: Cell = { type: CellType.START };
const G: Cell = { type: CellType.GOAL };
const P = (color: string): Cell => ({ type: CellType.PORTAL, portalColor: color });

export const LEVELS: MazeData[] = [
  {
    name: 'Tutorial',
    description: 'Learn the basics: movement and portals',
    maxWallBreaks: 2,
    grid: [
      [S, E, E, W, E, E, E],
      [E, W, E, W, E, W, E],
      [E, W, E, E, E, W, E],
      [E, W, W, W, P('blue'), W, E],
      [E, E, E, E, E, W, E],
      [W, W, W, W, E, W, E],
      [P('blue'), E, E, E, E, E, G],
    ],
    start: { row: 0, col: 0 },
    goal: { row: 6, col: 6 },
    portals: new Map([
      ['blue', [{ row: 3, col: 4 }, { row: 6, col: 0 }]],
    ]),
  },
  {
    name: 'Portal Shortcut',
    description: 'Use portals strategically to find the shortest path',
    maxWallBreaks: 1,
    grid: [
      [S, E, W, E, E, E, E, E, E],
      [E, E, W, E, W, W, W, W, E],
      [W, E, W, E, W, P('red'), E, W, E],
      [W, E, E, E, W, E, E, W, E],
      [W, W, W, E, W, W, E, W, E],
      [E, E, E, E, E, E, E, W, E],
      [E, W, W, W, W, W, W, W, E],
      [E, W, P('red'), E, E, E, E, E, E],
      [E, E, E, W, W, W, W, W, G],
    ],
    start: { row: 0, col: 0 },
    goal: { row: 8, col: 8 },
    portals: new Map([
      ['red', [{ row: 2, col: 5 }, { row: 7, col: 2 }]],
    ]),
  },
  {
    name: 'Multi-Portal Maze',
    description: 'Navigate through multiple portal pairs',
    maxWallBreaks: 3,
    grid: [
      [S, E, W, P('blue'), E, E, W, E, E, E],
      [E, E, W, W, W, E, W, E, W, E],
      [E, E, E, E, E, E, W, E, W, E],
      [W, W, W, W, W, E, W, E, W, E],
      [P('green'), E, E, E, E, E, E, E, W, E],
      [W, W, W, E, W, W, W, W, W, E],
      [E, E, E, E, E, E, E, E, E, E],
      [E, W, W, W, W, W, W, W, W, P('green')],
      [E, E, E, P('blue'), E, E, E, E, E, E],
      [W, W, E, W, W, W, W, W, W, G],
    ],
    start: { row: 0, col: 0 },
    goal: { row: 9, col: 9 },
    portals: new Map([
      ['blue', [{ row: 0, col: 3 }, { row: 8, col: 3 }]],
      ['green', [{ row: 4, col: 0 }, { row: 7, col: 9 }]],
    ]),
  },
  {
    name: 'The Wall Breaker',
    description: 'Wall-breaking is essential to reach the goal',
    maxWallBreaks: 4,
    grid: [
      [S, E, E, E, W, E, E, E, E],
      [W, W, W, E, W, E, W, W, W],
      [E, E, E, E, W, E, E, E, E],
      [E, W, W, W, W, W, W, W, E],
      [E, E, E, E, W, P('yellow'), E, E, E],
      [W, W, W, E, W, W, W, W, W],
      [E, E, E, E, W, E, E, E, E],
      [E, W, W, W, W, W, W, W, E],
      [E, E, E, E, P('yellow'), E, E, E, G],
    ],
    start: { row: 0, col: 0 },
    goal: { row: 8, col: 8 },
    portals: new Map([
      ['yellow', [{ row: 4, col: 5 }, { row: 8, col: 4 }]],
    ]),
  },
  {
    name: 'Labyrinth',
    description: 'A complex maze requiring strategic thinking',
    maxWallBreaks: 2,
    grid: [
      [S, E, W, E, E, E, W, E, E, E, E, E],
      [E, E, W, W, W, E, W, W, W, W, W, E],
      [E, E, E, E, W, E, E, E, E, E, E, E],
      [E, W, W, E, W, W, W, E, W, W, W, W],
      [E, W, P('cyan'), E, E, E, E, E, E, E, E, E],
      [E, W, W, W, W, W, W, W, W, E, W, E],
      [E, E, E, E, E, E, E, E, E, E, W, E],
      [W, W, W, E, W, W, W, W, W, E, W, E],
      [E, E, E, E, W, P('cyan'), E, E, E, E, W, E],
      [E, W, W, W, W, W, W, W, W, W, W, E],
      [E, E, E, E, E, E, E, E, E, E, E, E],
      [W, W, W, W, W, W, W, W, W, W, W, G],
    ],
    start: { row: 0, col: 0 },
    goal: { row: 11, col: 11 },
    portals: new Map([
      ['cyan', [{ row: 4, col: 2 }, { row: 8, col: 5 }]],
    ]),
  },
  {
    name: 'Portal Chain',
    description: 'Chain multiple portals together for the optimal path',
    maxWallBreaks: 3,
    grid: [
      [S, E, E, W, P('red'), W, E, E, E, W, P('blue'), W],
      [E, W, E, W, E, W, E, W, E, W, E, W],
      [E, W, E, E, E, W, E, W, E, E, E, W],
      [E, W, W, W, W, W, E, W, W, W, W, W],
      [E, E, E, E, E, E, E, E, E, E, E, E],
      [W, W, W, W, W, W, E, W, W, W, W, W],
      [P('red'), E, E, W, E, E, E, W, E, E, P('blue'), W],
      [W, W, E, W, E, W, W, W, E, W, W, W],
      [E, E, E, W, E, E, E, E, E, E, E, E],
      [E, W, W, W, W, W, W, W, W, W, W, E],
      [E, E, E, E, E, E, E, E, E, E, E, E],
      [W, W, W, W, W, W, W, W, W, W, W, G],
    ],
    start: { row: 0, col: 0 },
    goal: { row: 11, col: 11 },
    portals: new Map([
      ['red', [{ row: 0, col: 4 }, { row: 6, col: 0 }]],
      ['blue', [{ row: 0, col: 10 }, { row: 6, col: 10 }]],
    ]),
  },
];
