import { useState, useEffect, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameBoard } from './components/GameBoard';
import { GameStats } from './components/GameStats';
import { Controls } from './components/Controls';
import { VictoryModal } from './components/VictoryModal';
import { MapEditor } from './components/MapEditor';
import { Countdown } from './components/Countdown';
import { MazeBackground } from './components/MazeBackground';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ArenaSelection } from './pages/ArenaSelection';
import { GameOpening } from './pages/GameOpening';
import { Leaderboard } from './pages/Leaderboard';
import { HowToPlay } from './pages/HowToPlay';
import { LEVELS } from './data/levels';
import { GameMode, MazeData } from './types/game';
import { getPlayerName, loadGameData } from './lib/localStorage';

type AppState =
  | 'LANDING'
  | 'LOGIN'
  | 'HOW_TO_PLAY'
  | 'ARENA_SELECTION'
  | 'GAME_OPENING'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'WON'
  | 'EDITOR'
  | 'LEADERBOARD';

function App() {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [playerName, setPlayerName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<MazeData | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.NO_WALL_BREAK);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    loadGameData();
    const storedName = getPlayerName();
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const startGame = useCallback((maze: MazeData, mode: GameMode) => {
    const engine = new GameEngine(maze, mode);
    setGameEngine(engine);
    setSelectedLevel(maze);
    setSelectedMode(mode);
    setAppState('PLAYING');
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameEngine || appState !== 'PLAYING') return;

      const key = event.key.toLowerCase();
      let handled = false;

      if (event.shiftKey) {
        if (key === 'w' || key === 'arrowup') {
          gameEngine.breakWall('up');
          handled = true;
        } else if (key === 's' || key === 'arrowdown') {
          gameEngine.breakWall('down');
          handled = true;
        } else if (key === 'a' || key === 'arrowleft') {
          gameEngine.breakWall('left');
          handled = true;
        } else if (key === 'd' || key === 'arrowright') {
          gameEngine.breakWall('right');
          handled = true;
        }
      } else {
        if (key === 'w' || key === 'arrowup') {
          gameEngine.move('up');
          handled = true;
        } else if (key === 's' || key === 'arrowdown') {
          gameEngine.move('down');
          handled = true;
        } else if (key === 'a' || key === 'arrowleft') {
          gameEngine.move('left');
          handled = true;
        } else if (key === 'd' || key === 'arrowright') {
          gameEngine.move('right');
          handled = true;
        } else if (key === 'enter') {
          gameEngine.teleport();
          handled = true;
        }
      }

      if (handled) {
        event.preventDefault();
        forceUpdate({});

        if (gameEngine.isGoalReached()) {
          setAppState('WON');
        }
      }
    },
    [gameEngine, appState]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleEnterArena = (level: MazeData, mode: GameMode) => {
    setSelectedLevel(level);
    setSelectedMode(mode);
    const levelIndex = LEVELS.findIndex((l) => l.name === level.name);
    if (levelIndex !== -1) {
      setCurrentLevelIndex(levelIndex);
    }
    setAppState('GAME_OPENING');
  };

  const handleStartMission = () => {
    setAppState('COUNTDOWN');
  };

  const handleCountdownComplete = () => {
    if (selectedLevel) {
      startGame(selectedLevel, selectedMode);
    }
  };

  const handleNextLevel = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < LEVELS.length) {
      setCurrentLevelIndex(nextIndex);
      setSelectedLevel(LEVELS[nextIndex]);
      setAppState('GAME_OPENING');
    } else {
      setAppState('ARENA_SELECTION');
    }
  };

  const handlePlayCustomMap = (maze: MazeData) => {
    setSelectedLevel(maze);
    setSelectedMode(GameMode.WALL_BREAK);
    setAppState('GAME_OPENING');
  };

  if (appState === 'LANDING') {
    return (
      <LandingPage
        onStart={() => setAppState('LOGIN')}
        onHowToPlay={() => setAppState('HOW_TO_PLAY')}
      />
    );
  }

  if (appState === 'HOW_TO_PLAY') {
    return <HowToPlay onBack={() => setAppState('LANDING')} />;
  }

  if (appState === 'LOGIN') {
    return (
      <LoginPage
        onContinue={(name) => {
          setPlayerName(name);
          setAppState('ARENA_SELECTION');
        }}
        onBack={() => setAppState('LANDING')}
      />
    );
  }

  if (appState === 'ARENA_SELECTION') {
    return (
      <ArenaSelection
        playerName={playerName}
        onEnterArena={handleEnterArena}
        onBack={() => setAppState('LOGIN')}
        onViewLeaderboard={() => setAppState('LEADERBOARD')}
        onCreateCustomMap={() => setAppState('EDITOR')}
      />
    );
  }

  if (appState === 'LEADERBOARD') {
    return <Leaderboard onBack={() => setAppState('ARENA_SELECTION')} />;
  }

  if (appState === 'EDITOR') {
    return (
      <MapEditor
        onPlayMap={handlePlayCustomMap}
        onBack={() => setAppState('ARENA_SELECTION')}
      />
    );
  }

  if (appState === 'GAME_OPENING' && selectedLevel) {
    return (
      <GameOpening
        playerName={playerName}
        level={selectedLevel}
        mode={selectedMode}
        onStartMission={handleStartMission}
        onBack={() => setAppState('ARENA_SELECTION')}
      />
    );
  }

  if (appState === 'COUNTDOWN') {
    return <Countdown onComplete={handleCountdownComplete} />;
  }

  if (!gameEngine) return null;

  const handleHintToggle = () => {
    if (gameEngine) {
      gameEngine.toggleHint();
      forceUpdate({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-4 lg:p-6 relative">
      <MazeBackground />
      <div className="max-w-[1800px] mx-auto h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-3 lg:gap-4 h-full">
          <div className="flex items-center justify-center animate-fade-in">
            <GameBoard
              grid={gameEngine.getGrid()}
              playerPos={gameEngine.getPlayerPosition()}
              canTeleport={gameEngine.canTeleport()}
              hintPath={gameEngine.getNextHintSteps()}
              showHint={gameEngine.isHintActive()}
            />
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto">
            <div className="animate-slide-in-right">
              <GameStats
                mode={gameEngine.getMode()}
                metrics={gameEngine.getMetrics()}
                wallsRemaining={gameEngine.getRemainingWallBreaks()}
                maxWallBreaks={gameEngine.getMaxWallBreaks()}
                mazeName={gameEngine.getMazeName()}
              />
            </div>

            {gameEngine.canUseHint() && (
              <div className="flex justify-center animate-slide-in-right animate-delay-100">
                <button
                  onClick={handleHintToggle}
                  className="group relative p-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-bold rounded-full transition-all shadow-lg transform hover:scale-110"
                  title="Show Hint"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700">
                    Hint (One-Time)
                  </div>
                </button>
              </div>
            )}

            {gameEngine.isHintActive() && (
              <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300 text-sm font-semibold text-center animate-pulse-subtle">
                Next steps shown in yellow
              </div>
            )}

            <div className="animate-slide-in-right animate-delay-200">
              <Controls
                mode={gameEngine.getMode()}
                canTeleport={gameEngine.canTeleport()}
              />
            </div>
            <button
              onClick={() => setAppState('ARENA_SELECTION')}
              className="w-full p-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-100 font-semibold rounded-lg transition-all border border-slate-600 shadow-lg animate-slide-in-right animate-delay-300 transform hover:scale-105"
            >
              Back to Arena
            </button>
          </div>
        </div>
      </div>

      {appState === 'WON' && selectedLevel && (
        <VictoryModal
          playerName={playerName}
          levelName={selectedLevel.name}
          mode={selectedMode}
          metrics={gameEngine.getMetrics()}
          onNextLevel={handleNextLevel}
          onMainMenu={() => setAppState('ARENA_SELECTION')}
          onViewLeaderboard={() => setAppState('LEADERBOARD')}
          hasNextLevel={currentLevelIndex < LEVELS.length - 1}
          optimalPath={gameEngine.getOptimalPath()}
          grid={gameEngine.getGrid()}
        />
      )}
    </div>
  );
}

export default App;
