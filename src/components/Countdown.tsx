import { useState, useEffect, useRef } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

export function Countdown({ onComplete }: CountdownProps) {
  const [currentNumber, setCurrentNumber] = useState(3);
  const [isGo, setIsGo] = useState(false);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAnimationEnd = () => {
      if (isGo) {
        onComplete();
      } else if (currentNumber > 1) {
        setCurrentNumber(currentNumber - 1);
      } else {
        setIsGo(true);
      }
    };

    const element = numberRef.current;
    if (element) {
      element.addEventListener('animationend', handleAnimationEnd);
      return () => element.removeEventListener('animationend', handleAnimationEnd);
    }
  }, [currentNumber, isGo, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent animate-pulse-glow"></div>

        {!isGo ? (
          <div
            ref={numberRef}
            key={currentNumber}
            className="countdown-number text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-300 to-emerald-400"
            style={{
              textShadow: '0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)',
            }}
          >
            {currentNumber}
          </div>
        ) : (
          <div
            ref={numberRef}
            className="countdown-go text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-green-300 to-cyan-400"
            style={{
              textShadow: '0 0 60px rgba(16, 185, 129, 0.6), 0 0 120px rgba(6, 182, 212, 0.4)',
            }}
          >
            GO!
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes countdownSwing {
          0% {
            transform: scale(0) rotate(-180deg) translateY(100px);
            opacity: 0;
          }
          30% {
            transform: scale(1.3) rotate(10deg) translateY(-20px);
            opacity: 1;
          }
          50% {
            transform: scale(0.95) rotate(-5deg) translateY(0);
          }
          70% {
            transform: scale(1.05) rotate(2deg) translateY(-5px);
          }
          85% {
            transform: scale(1) rotate(0deg) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(0.5) rotate(90deg) translateY(-80px);
            opacity: 0;
          }
        }

        @keyframes goExplosion {
          0% {
            transform: scale(0) rotate(-90deg);
            opacity: 0;
          }
          40% {
            transform: scale(1.5) rotate(5deg);
            opacity: 1;
          }
          60% {
            transform: scale(1.2) rotate(-2deg);
          }
          80% {
            transform: scale(1.4) rotate(1deg);
            opacity: 1;
          }
          100% {
            transform: scale(2) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }

        .countdown-number {
          animation: countdownSwing 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          will-change: transform, opacity;
        }

        .countdown-go {
          animation: goExplosion 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          will-change: transform, opacity;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-particle-float {
          animation: particleFloat 3s ease-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
