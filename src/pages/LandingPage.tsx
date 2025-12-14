import { Zap, Target, Layers } from 'lucide-react';
import { MazeBackground } from '../components/MazeBackground';
import { RunningAvatar } from '../components/RunningAvatar';

interface LandingPageProps {
  onStart: () => void;
  onHowToPlay: () => void;
}

export function LandingPage({ onStart, onHowToPlay }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <RunningAvatar />
      <MazeBackground />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent"></div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-8">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="mazeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="portalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0abfc" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <circle cx="100" cy="100" r="95" fill="url(#mazeGradient)" opacity="0.1"/>

              <g stroke="url(#mazeGradient)" strokeWidth="4" fill="none" strokeLinecap="round" filter="url(#glow)">
                <circle cx="100" cy="100" r="85" opacity="0.9"/>
                <circle cx="100" cy="100" r="70" opacity="0.85"/>
                <circle cx="100" cy="100" r="55" opacity="0.8"/>
                <circle cx="100" cy="100" r="40" opacity="0.75"/>
                <circle cx="100" cy="100" r="25" opacity="0.7"/>

                <path d="M 100 15 L 100 45" opacity="0.9"/>
                <path d="M 100 155 L 100 185" opacity="0.9"/>
                <path d="M 15 100 L 45 100" opacity="0.9"/>
                <path d="M 155 100 L 185 100" opacity="0.9"/>

                <path d="M 35 35 L 60 60" opacity="0.85"/>
                <path d="M 140 140 L 165 165" opacity="0.85"/>
                <path d="M 35 165 L 60 140" opacity="0.85"/>
                <path d="M 140 60 L 165 35" opacity="0.85"/>

                <path d="M 70 30 L 70 50" opacity="0.8"/>
                <path d="M 130 30 L 130 50" opacity="0.8"/>
                <path d="M 70 150 L 70 170" opacity="0.8"/>
                <path d="M 130 150 L 130 170" opacity="0.8"/>

                <path d="M 30 70 L 50 70" opacity="0.8"/>
                <path d="M 150 70 L 170 70" opacity="0.8"/>
                <path d="M 30 130 L 50 130" opacity="0.8"/>
                <path d="M 150 130 L 170 130" opacity="0.8"/>
              </g>

              <circle cx="100" cy="100" r="12" fill="url(#portalGradient)" opacity="0.9" />
              <circle cx="100" cy="100" r="8" fill="#ffffff" opacity="0.6" />
            </svg>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            PortalMaze
          </h1>

          <p className="text-3xl md:text-4xl text-blue-200 font-semibold mb-4">
            Think. Teleport. Break. Escape.
          </p>

          <p className="text-lg text-blue-300 max-w-2xl mx-auto leading-relaxed">
            Navigate complex mazes using strategic movement, color-paired portals,
            and wall-breaking abilities. Race against the optimal path to prove your mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Strategic Pathfinding</h3>
            <p className="text-blue-200 text-sm">
              Find the optimal route through challenging mazes with multiple solutions
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Portal Mechanics</h3>
            <p className="text-blue-200 text-sm">
              Master color-paired teleportation to discover creative shortcuts
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dual Game Modes</h3>
            <p className="text-blue-200 text-sm">
              Choose pure navigation or wall-breaking mode for different challenges
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStart}
            className="px-12 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-2xl"
          >
            Start Game
          </button>

          <button
            onClick={onHowToPlay}
            className="px-12 py-5 bg-white/10 backdrop-blur-sm text-white text-xl font-bold rounded-2xl border-2 border-white/30"
          >
            How to Play
          </button>
        </div>
      </div>
    </div>
  );
}
