import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
}

const ChristmasWish = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Sparkle effect on text
  useEffect(() => {
    let timeoutId: number;

    const createSparkle = () => {
      const sparkle: Sparkle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 10 + Math.random() * 14,
      };
      setSparkles((prev) => [...prev, sparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
      }, 700);

      // Schedule next sparkle with random delay
      timeoutId = window.setTimeout(createSparkle, 600 + Math.random() * 1000);
    };

    // Start first sparkle
    timeoutId = window.setTimeout(createSparkle, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative w-full flex justify-center select-none py-4 px-3">
      <style>{`
        @keyframes shimmer-glow {
          0% {
            background-position: -100% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .text-shimmer {
          background: linear-gradient(
            90deg,
            #DAA520 0%,
            #FFD700 40%,
            #FFEC8B 50%,
            #FFD700 60%,
            #DAA520 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer-glow 6s ease-in-out infinite;
          filter: drop-shadow(1px 2px 1px rgba(0, 0, 0, 0.5));
        }
      `}</style>
      <div className="text-center font-bold">
        <div className="relative">
          <p
            className="text-shimmer"
            style={{
              fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
              fontWeight: 700
            }}
          >
            Wij wensen u prettige kerstdagen en een stralend 2026!
          </p>
          {/* Text sparkles */}
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="absolute pointer-events-none animate-sparkle"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: sparkle.size,
                height: sparkle.size,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 0L13.5 9L22 12L13.5 15L12 24L10.5 15L2 12L10.5 9L12 0Z"
                  fill="#FFD700"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChristmasWish;

