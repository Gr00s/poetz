import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Matrix4, Vector3, SphereGeometry, MeshBasicMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

interface Props {
  isMobile: boolean;
}

const Snowfall = ({ isMobile }: Props) => {
  const count = isMobile ? 50 : 100;
  const positions = useRef<Array<{ pos: Vector3; speed: number }>>([]);
  const meshRef = useRef<InstancedMesh | null>(null);
  const matrix = useRef(new Matrix4());

  const geometry = useMemo(() => new SphereGeometry(0.06, 6, 6), []);
  const material = useMemo(
    () => new MeshBasicMaterial({ color: '#FFF8E7', transparent: true, opacity: 0.8 }),
    []
  );

  useEffect(() => {
    positions.current = Array.from({ length: count }).map(() => ({
      pos: new Vector3((Math.random() - 0.5) * 18, Math.random() * 10 + 2, (Math.random() - 0.5) * 18),
      speed: 0.5 + Math.random() * 0.6
    }));
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [count, geometry, material]);

  useFrame((_, delta) => {
    positions.current.forEach((p, i) => {
      p.pos.y -= p.speed * delta * 1.2;
      p.pos.x += Math.sin((i + 1) * 0.5 + performance.now() * 0.001) * delta * 0.2;
      if (p.pos.y < -6) {
        p.pos.y = 10 + Math.random() * 4;
        p.pos.x = (Math.random() - 0.5) * 18;
        p.pos.z = (Math.random() - 0.5) * 18;
      }
      matrix.current.makeTranslation(p.pos.x, p.pos.y, p.pos.z);
      meshRef.current?.setMatrixAt(i, matrix.current);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

export default Snowfall;



