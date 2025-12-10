import { useCallback, useEffect, useRef, useState } from 'react';

interface AutoRotateOptions {
  baseSpeed?: number;
  resumeDelayMs?: number;
}

export const useAutoRotate = (options: AutoRotateOptions = {}) => {
  const { baseSpeed = 0.4, resumeDelayMs = 3000 } = options;
  const [isAuto, setIsAuto] = useState(true);
  const lastInteraction = useRef<number>(Date.now());
  const [speed, setSpeed] = useState(baseSpeed);

  const pause = useCallback(() => {
    lastInteraction.current = Date.now();
    setIsAuto(false);
  }, []);

  const bumpSpeed = useCallback((delta: number) => {
    setSpeed(delta);
    pause();
  }, [pause]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!isAuto && Date.now() - lastInteraction.current > resumeDelayMs) {
        setSpeed(baseSpeed);
        setIsAuto(true);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [baseSpeed, isAuto, resumeDelayMs]);

  return {
    isAuto,
    speed,
    pause,
    resume: () => setIsAuto(true),
    bumpSpeed
  };
};



