export function MazeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mazeGrid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" className="text-blue-400" />
            <rect x="10" y="10" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" className="text-cyan-400" />
            <rect x="20" y="20" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" className="text-emerald-400" />

            <line x1="40" y1="0" x2="40" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.4" className="text-blue-300" />
            <line x1="0" y1="40" x2="20" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.4" className="text-blue-300" />
            <line x1="60" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.4" className="text-blue-300" />
            <line x1="40" y1="60" x2="40" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.4" className="text-blue-300" />

            <rect x="37" y="37" width="6" height="6" fill="currentColor" opacity="0.3" className="text-cyan-500" />
          </pattern>

          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopOpacity="0.1" />
            <stop offset="50%" stopOpacity="0.3" />
            <stop offset="100%" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#mazeGrid)" opacity="0.6" />
        <rect width="100%" height="100%" fill="url(#fadeGradient)" />
      </svg>

      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500/10"></div>
      <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-cyan-500/10"></div>
    </div>
  );
}
