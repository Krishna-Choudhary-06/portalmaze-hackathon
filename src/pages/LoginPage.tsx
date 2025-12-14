import { useState, useEffect } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { getPlayerName, setPlayerName as savePlayerName } from '../lib/localStorage';

interface LoginPageProps {
  onContinue: (playerName: string) => void;
  onBack: () => void;
}

export function LoginPage({ onContinue, onBack }: LoginPageProps) {
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const storedName = getPlayerName();
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      savePlayerName(playerName.trim());
      onContinue(playerName.trim());
    }
  };

  const handleGuestMode = () => {
    const guestName = `Guest${Math.floor(Math.random() * 9999)}`;
    savePlayerName(guestName);
    onContinue(guestName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl mb-6 shadow-2xl animate-scale-in">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Player Identity</h1>
          <p className="text-blue-200">
            Enter your name to track your achievements
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="playerName"
                className="block text-sm font-semibold text-slate-200 mb-2"
              >
                Player Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-slate-100 placeholder-slate-400 transition-all"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">
                This name will appear on the leaderboard
              </p>
            </div>

            <button
              type="submit"
              disabled={!playerName.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg transform hover:scale-105 disabled:hover:scale-100"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-slate-400 font-medium">
                  or
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGuestMode}
              className="w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Continue as Guest
            </button>
          </form>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-6 px-6 py-3 text-white/80 hover:text-white font-medium transition-colors animate-slide-up animate-delay-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
