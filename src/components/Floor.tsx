import { useMemo } from 'react';
import { PlaneGeometry, MeshStandardMaterial } from 'three';

const Floor = () => {
  const geometry = useMemo(() => new PlaneGeometry(40, 40), []);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#0f1f38',
        metalness: 0.6,
        roughness: 0.35,
        opacity: 0.75,
        transparent: true
      }),
    []
  );

  return <mesh geometry={geometry} material={material} rotation-x={-Math.PI / 2} position={[0, -2, 0]} receiveShadow />;
};

export default Floor;



