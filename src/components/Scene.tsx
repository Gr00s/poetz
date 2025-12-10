import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Group } from 'three';
import { DisplayMode, ShapeVariant } from '../types';
import ChristmasTree from './ChristmasTree';
import TreeTopper from './TreeTopper';
import Snowfall from './Snowfall';
import Starfield from './Starfield';

interface SceneProps {
  mode: DisplayMode;
  isMobile: boolean;
  autoRotateEnabled: boolean;
  autoRotateSpeed: number;
  gestureRotation: number;
  onUserInteraction: () => void;
  onUserRelease: () => void;
  shapeVariant: ShapeVariant;
}

const SceneInner = ({
  mode,
  isMobile,
  autoRotateEnabled,
  autoRotateSpeed,
  gestureRotation,
  shapeVariant
}: Omit<SceneProps, 'onUserInteraction' | 'onUserRelease'>) => {
  const groupRef = useRef<Group | null>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (autoRotateEnabled) {
      groupRef.current.rotation.y += delta * autoRotateSpeed;
    }
    if (gestureRotation !== 0) {
      groupRef.current.rotation.y += delta * gestureRotation * 2.2;
    }
  });

  return (
    <>
      <color attach="background" args={['#050a10']} />
      <Environment preset="night" />
      <ambientLight intensity={0.4} />
      <directionalLight intensity={0.8} position={[6, 10, 6]} color="#FFF8E7" />
      <directionalLight intensity={0.4} position={[-6, 8, -4]} color="#FFD700" />
      <pointLight intensity={1.5} distance={30} position={[0, 12, 0]} color="#FFD700" />
      <group ref={groupRef} position={[0, -2, 0]}>
        <ChristmasTree mode={mode} isMobile={isMobile} shapeVariant={shapeVariant} />
        <TreeTopper isMobile={isMobile} />
      </group>
      <Snowfall isMobile={isMobile} />
      <Starfield isMobile={isMobile} />
      {!isMobile && (
        <EffectComposer multisampling={0} resolutionScale={0.5}>
          <Bloom luminanceThreshold={0.7} intensity={1.2} />
          <Vignette offset={0.3} darkness={0.5} />
        </EffectComposer>
      )}
    </>
  );
};

const Scene = ({
  mode,
  isMobile,
  autoRotateEnabled,
  autoRotateSpeed,
  gestureRotation,
  onUserInteraction,
  onUserRelease,
  shapeVariant
}: SceneProps) => {
  return (
    <Canvas shadows dpr={[1, 1.5]}>
      <PerspectiveCamera makeDefault position={[0, 6, 18]} fov={60} />
      <Suspense fallback={null}>
        <SceneInner
          mode={mode}
          isMobile={isMobile}
          autoRotateEnabled={autoRotateEnabled}
          autoRotateSpeed={autoRotateSpeed}
          gestureRotation={gestureRotation}
          shapeVariant={shapeVariant}
        />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={22}
        onStart={onUserInteraction}
        onEnd={onUserRelease}
      />
    </Canvas>
  );
};

export default Scene;



