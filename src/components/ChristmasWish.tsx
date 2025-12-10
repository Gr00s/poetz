import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ParticleKind = 'snow' | 'tooth' | 'star';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  kind: ParticleKind;
  size: number;
}

const MAX_PARTICLES = 80;

const randomKind = () => {
  const r = Math.random();
  if (r < 0.4) return 'snow';
  if (r < 0.7) return 'tooth';
  return 'star';
};

const colorFor = (kind: ParticleKind) => {
  if (kind === 'snow') return 'rgba(255,248,231,0.9)';
  if (kind === 'tooth') return 'rgba(255,255,255,0.95)';
  return 'rgba(255,215,0,0.9)';
};

const ChristmasWish = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [textVisible, setTextVisible] = useState(true);
  const rafRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const spawnParticles = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const baseX = rect.width / 2;
    const initial = Array.from({ length: MAX_PARTICLES }).map((_, i) => ({
      id: i,
      x: baseX + (Math.random() - 0.5) * rect.width * 0.4,
      y: rect.height * 0.2,
      vx: (Math.random() - 0.5) * 120,
      vy: -Math.random() * 80,
      life: 2.2 + Math.random() * 1.2,
      kind: randomKind(),
      size: 6 + Math.random() * 6
    }));
    setParticles(initial);
    setTextVisible(false);
  };

  useEffect(() => {
    if (!particles.length) return;
    let last = performance.now();
    const loop = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.033);
      last = time;
      let hasAny = false;
      setParticles((prev) => {
        const next = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt + dt * 60,
            vy: p.vy + dt * 40,
            life: p.life - dt
          }))
          .filter((p) => p.life > 0);
        hasAny = next.length > 0;
        return next;
      });
      if (hasAny) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    const timer = window.setTimeout(() => setTextVisible(true), 2500);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(timer);
    };
  }, [particles.length]);

  return (
    <div className="relative w-full flex justify-center select-none py-4 px-3" ref={containerRef}>
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
      <AnimatePresence>
        {textVisible && (
          <motion.div
            className="text-center font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="cursor-pointer text-shimmer"
              style={{
                fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
                fontWeight: 700
              }}
              whileHover={{ y: -2, scale: 1.01 }}
              onClick={spawnParticles}
            >
              Wij wensen u prettige kerstdagen en een stralend 2026!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: p.kind === 'star' ? '20%' : '9999px',
              background: colorFor(p.kind),
              filter: p.kind === 'star' ? 'drop-shadow(0 0 6px #FFD700)' : 'none',
              opacity: Math.max(0, p.life / 2.5)
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChristmasWish;

