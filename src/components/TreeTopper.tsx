import { useEffect, useMemo, useRef } from 'react';
import {
  ExtrudeGeometry,
  MeshBasicMaterial,
  PointLight,
  RingGeometry,
  Shape,
  SphereGeometry,
  InstancedMesh,
  Matrix4,
  Vector3,
  Color,
  MeshLambertMaterial,
  Mesh
} from 'three';
import { useFrame } from '@react-three/fiber';

interface Props {
  isMobile: boolean;
}

const TreeTopper = ({ isMobile }: Props) => {
  const sparkles = useRef<InstancedMesh | null>(null);
  const sparkleMatrix = useRef(new Matrix4());
  const temp = useRef(new Vector3());

  const starGeometry = useMemo(() => {
    const shape = new Shape();
    const spikes = 5;
    const outer = 0.7;
    const inner = 0.3;
    shape.moveTo(0, outer);
    for (let i = 1; i <= spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outer : inner;
      shape.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
    }
    return new ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: false });
  }, []);

  const starMaterial = useMemo(
    () => new MeshLambertMaterial({ color: '#FFD700', emissive: new Color('#FFD700'), emissiveIntensity: 0.6 }),
    []
  );

  const haloGeometry = useMemo(() => new RingGeometry(0.9, 1.1, 32), []);
  const haloMaterial = useMemo(
    () => new MeshBasicMaterial({ color: '#FFD700', transparent: true, opacity: 0.35, side: 2 }),
    []
  );

  const sparkleGeometry = useMemo(() => new SphereGeometry(0.05, 6, 4), []);
  const sparkleMaterial = useMemo(
    () => new MeshBasicMaterial({ color: '#FFF8E7', transparent: true, opacity: 0.9 }),
    []
  );

  const sparkleCount = isMobile ? 18 : 28;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    starMaterial.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.2;
    if (sparkles.current) {
      for (let i = 0; i < sparkleCount; i++) {
        const angle = (i / sparkleCount) * Math.PI * 2 + t * 0.6;
        const radius = 1 + Math.sin(t * 1.5 + i) * 0.15;
        const y = Math.sin(t * 2 + i) * 0.2;
        temp.current.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        sparkleMatrix.current.makeTranslation(temp.current.x, temp.current.y, temp.current.z);
        sparkles.current.setMatrixAt(i, sparkleMatrix.current);
      }
      sparkles.current.instanceMatrix.needsUpdate = true;
      sparkles.current.rotation.y += delta * 0.4;
    }
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.6;
      starRef.current.scale.setScalar(pulse);
    }
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.3;
    }
  });

  const starRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  useEffect(
    () => () => {
      starGeometry.dispose();
      starMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      sparkleGeometry.dispose();
      sparkleMaterial.dispose();
    },
    [haloGeometry, haloMaterial, sparkleGeometry, sparkleMaterial, starGeometry, starMaterial]
  );

  return (
    <group position={[0, TREE_TOP_Y, 0]}>
      <mesh ref={starRef} geometry={starGeometry} material={starMaterial} castShadow />
      <mesh ref={haloRef} geometry={haloGeometry} material={haloMaterial} rotation-x={Math.PI / 2} />
      <instancedMesh ref={sparkles} args={[sparkleGeometry, sparkleMaterial, sparkleCount]} />
      <pointLight ref={lightRef} intensity={1.4} distance={8} color="#FFD700" />
    </group>
  );
};

const TREE_TOP_Y = 16;

export default TreeTopper;

