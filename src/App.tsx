import { useEffect, useMemo, useState } from 'react';
import Scene from './components/Scene';
import ChristmasWish from './components/ChristmasWish';
import ControlPanel from './components/ControlPanel';
import Logo from './components/Logo';
import HandOverlay from './components/HandOverlay';
import { DisplayMode, GestureType, ShapeVariant } from './types';
import { useMobileDetect } from './hooks/useMobileDetect';
import { useAutoRotate } from './hooks/useAutoRotate';
import { useHandTracking } from './hooks/useHandTracking';

const shapeVariants: ShapeVariant[] = ['cloud', 'text', 'logo', 'logo-filled'];

const App = () => {
  const isMobile = useMobileDetect();
  const [mode, setMode] = useState<DisplayMode>('formed');
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [gestureRotation, setGestureRotation] = useState(0);
  const [hasHand, setHasHand] = useState(false);
  const autoRotate = useAutoRotate({ baseSpeed: 0.4, resumeDelayMs: 3000 });
  const [hideOverlay, setHideOverlay] = useState(false);
  const [shapeVariant, setShapeVariant] = useState<ShapeVariant>('logo');

  const cycleShape = () => {
    setShapeVariant((current) => {
      const idx = shapeVariants.indexOf(current);
      return shapeVariants[(idx + 1) % shapeVariants.length];
    });
  };

  useEffect(() => {
    const update = () => setHideOverlay(window.innerWidth < 480);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleGesture = (g: GestureType) => {
    if (g === 'open') setMode('chaos');
    if (g === 'pinch' || g === 'fist') setMode('formed');
    if (g !== 'point') setGestureRotation(0);
  };

  const handlePointMove = (dx: number) => {
    setGestureRotation(dx * 1.8);
    autoRotate.pause();
  };

  const { gesture, hasCameraPermission, start, stop, videoRef, canvasRef } = useHandTracking({
    enabled: gesturesEnabled,
    onGesture: handleGesture,
    onPointMove: handlePointMove,
    onHandPresenceChange: setHasHand,
    isMobile
  });

  useEffect(() => {
    if (!gesturesEnabled) {
      setGestureRotation(0);
      autoRotate.resume();
    }
  }, [gesturesEnabled, autoRotate]);

  useEffect(() => {
    if (!gesturesEnabled) return;
    if (hasHand) {
      autoRotate.pause();
    } else {
      const t = window.setTimeout(() => autoRotate.resume(), 5000);
      return () => window.clearTimeout(t);
    }
  }, [hasHand, gesturesEnabled, autoRotate]);

  const toggleGestures = () => {
    setGesturesEnabled((v) => {
      if (v) {
        stop();
        return false;
      }
      return true;
    });
  };

  const toggleMode = () => setMode((m) => (m === 'formed' ? 'chaos' : 'formed'));

  const autoRotateEnabled = useMemo(() => autoRotate.isAuto && !hasHand, [autoRotate.isAuto, hasHand]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050a10] text-white">
      <ControlPanel gesturesEnabled={gesturesEnabled} onToggleGestures={toggleGestures} onToggleMode={toggleMode} mode={mode} shapeVariant={shapeVariant} onCycleShape={cycleShape} />
      <div className="absolute top-0 left-0 right-0 z-10">
        <ChristmasWish />
      </div>
      <div className="absolute inset-0">
        <Scene
          mode={mode}
          isMobile={isMobile}
          autoRotateEnabled={autoRotateEnabled}
          autoRotateSpeed={autoRotate.speed}
          gestureRotation={gestureRotation}
          onUserInteraction={autoRotate.pause}
          onUserRelease={autoRotate.pause}
          shapeVariant={shapeVariant}
        />
      </div>
      <Logo />
      <HandOverlay
        enabled={gesturesEnabled}
        gesture={gesture}
        hasHand={hasHand}
        hasPermission={hasCameraPermission}
        onRequestCamera={start}
        videoRef={videoRef}
        canvasRef={canvasRef}
        hiddenOnTiny={hideOverlay}
      />
    </div>
  );
};

export default App;

