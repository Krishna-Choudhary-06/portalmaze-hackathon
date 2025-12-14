interface BestScore {
  steps: number;
  time: number;
  efficiency: number;
}

interface RecentRun {
  levelName: string;
  mode: 'NO_WALL_BREAK' | 'WALL_BREAK';
  steps: number;
  time: number;
  efficiency: number;
  timestamp: number;
}

interface GameData {
  playerName: string;
  bestScores: {
    [levelName: string]: {
      NO_WALL_BREAK?: BestScore;
      WALL_BREAK?: BestScore;
    };
  };
  recentRuns: RecentRun[];
}

const STORAGE_KEY = 'portalMazeData';
const MAX_RECENT_RUNS = 20;

function getDefaultData(): GameData {
  return {
    playerName: '',
    bestScores: {},
    recentRuns: [],
  };
}

export function loadGameData(): GameData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultData = getDefaultData();
      saveGameData(defaultData);
      return defaultData;
    }

    const parsed = JSON.parse(stored);

    return {
      playerName: parsed.playerName || '',
      bestScores: parsed.bestScores || {},
      recentRuns: Array.isArray(parsed.recentRuns) ? parsed.recentRuns : [],
    };
  } catch (error) {
    console.error('Failed to load game data from localStorage:', error);
    return getDefaultData();
  }
}

export function saveGameData(data: GameData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save game data to localStorage:', error);
    return false;
  }
}

export function setPlayerName(name: string): boolean {
  try {
    const data = loadGameData();
    data.playerName = name;
    return saveGameData(data);
  } catch (error) {
    console.error('Failed to set player name:', error);
    return false;
  }
}

export function updateBestScore(
  levelName: string,
  mode: 'NO_WALL_BREAK' | 'WALL_BREAK',
  steps: number,
  time: number,
  efficiency: number
): boolean {
  try {
    const data = loadGameData();

    if (!data.bestScores[levelName]) {
      data.bestScores[levelName] = {};
    }

    const currentBest = data.bestScores[levelName][mode];

    const isNewBest = !currentBest || steps < currentBest.steps;

    if (isNewBest) {
      data.bestScores[levelName][mode] = {
        steps,
        time,
        efficiency,
      };
      return saveGameData(data);
    }

    return false;
  } catch (error) {
    console.error('Failed to update best score:', error);
    return false;
  }
}

export function addRecentRun(
  levelName: string,
  mode: 'NO_WALL_BREAK' | 'WALL_BREAK',
  steps: number,
  time: number,
  efficiency: number
): boolean {
  try {
    const data = loadGameData();

    const newRun: RecentRun = {
      levelName,
      mode,
      steps,
      time,
      efficiency,
      timestamp: Date.now(),
    };

    data.recentRuns.unshift(newRun);

    if (data.recentRuns.length > MAX_RECENT_RUNS) {
      data.recentRuns = data.recentRuns.slice(0, MAX_RECENT_RUNS);
    }

    return saveGameData(data);
  } catch (error) {
    console.error('Failed to add recent run:', error);
    return false;
  }
}

export function getBestScore(
  levelName: string,
  mode: 'NO_WALL_BREAK' | 'WALL_BREAK'
): BestScore | null {
  try {
    const data = loadGameData();
    return data.bestScores[levelName]?.[mode] || null;
  } catch (error) {
    console.error('Failed to get best score:', error);
    return null;
  }
}

export function getRecentRuns(limit?: number): RecentRun[] {
  try {
    const data = loadGameData();
    return limit ? data.recentRuns.slice(0, limit) : data.recentRuns;
  } catch (error) {
    console.error('Failed to get recent runs:', error);
    return [];
  }
}

export function getPlayerName(): string {
  try {
    const data = loadGameData();
    return data.playerName;
  } catch (error) {
    console.error('Failed to get player name:', error);
    return '';
  }
}

export function getAllBestScores(): GameData['bestScores'] {
  try {
    const data = loadGameData();
    return data.bestScores;
  } catch (error) {
    console.error('Failed to get all best scores:', error);
    return {};
  }
}
