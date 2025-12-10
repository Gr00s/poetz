import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
}

const Logo = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let timeoutId: number;

    const createSparkle = () => {
      const sparkle: Sparkle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 12,
      };
      setSparkles((prev) => [...prev, sparkle]);

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
      }, 700);

      // Schedule next sparkle with random delay
      timeoutId = window.setTimeout(createSparkle, 800 + Math.random() * 1200);
    };

    // Start first sparkle
    timeoutId = window.setTimeout(createSparkle, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="absolute left-4 bottom-8 sm:bottom-8 z-50 ios-safe-bottom">
      <div className="relative">
        <img
          src="/assets/Poetz-logo-800.png"
          alt="Poetz logo"
          className="w-[120px] md:w-[150px]"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.35)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.2))',
          }}
          draggable={false}
        />
        {/* Sparkles */}
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
  );
};

export default Logo;
