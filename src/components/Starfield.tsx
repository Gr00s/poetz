import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Matrix4, Vector3, SphereGeometry, MeshBasicMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

interface Props {
  isMobile: boolean;
}

const Starfield = ({ isMobile }: Props) => {
  const count = isMobile ? 750 : 1500;
  const meshRef = useRef<InstancedMesh | null>(null);
  const matrix = useRef(new Matrix4());
  const positions = useRef<Vector3[]>([]);

  const geometry = useMemo(() => new SphereGeometry(0.04, 4, 4), []);
  const material = useMemo(() => new MeshBasicMaterial({ color: '#FFF8E7', transparent: true, opacity: 0.8 }), []);

  useEffect(() => {
    positions.current = Array.from({ length: count }).map(() => {
      const dir = new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
      const dist = 25 + Math.random() * 15;
      return dir.multiplyScalar(dist);
    });
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [count, geometry, material]);

  useFrame((state) => {
    const twinkle = 0.75 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    if (meshRef.current) {
      material.opacity = twinkle;
      positions.current.forEach((p, i) => {
        matrix.current.makeTranslation(p.x, p.y, p.z);
        meshRef.current?.setMatrixAt(i, matrix.current);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

export default Starfield;



