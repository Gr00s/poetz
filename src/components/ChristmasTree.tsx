import { useEffect, useMemo, useRef } from 'react';
import {
  InstancedMesh,
  BufferGeometry,
  SphereGeometry,
  Shape,
  ExtrudeGeometry,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Object3D,
  Material
} from 'three';
import { useFrame } from '@react-three/fiber';
import { DisplayMode } from '../types';
import { generateFullLogoPositions } from '../utils/svgSampler';

const TREE_HEIGHT = 16;
const TREE_RADIUS = 5.5;

interface Props {
  mode: DisplayMode;
  isMobile: boolean;
}

// Create 4-pointed diamond star
const createDiamondStarGeometry = (size: number = 0.2): BufferGeometry => {
  const shape = new Shape();
  shape.moveTo(0, size);
  shape.lineTo(size * 0.3, 0);
  shape.lineTo(0, -size);
  shape.lineTo(-size * 0.3, 0);
  shape.closePath();
  return new ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
};

// Create 6-pointed star
const createSixPointStarGeometry = (size: number = 0.18): BufferGeometry => {
  const shape = new Shape();
  const points = 6;
  const outerRadius = size;
  const innerRadius = size * 0.5;
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
};

// 4 geometry types
const createGeometries = () => ({
  ballLarge: new SphereGeometry(0.22, 10, 8),
  ballSmall: new SphereGeometry(0.14, 8, 6),
  diamondStar: createDiamondStarGeometry(0.2),
  sixPointStar: createSixPointStarGeometry(0.18)
});

// 6 materials - metallic for gold/silver, shiny for Poetz colors
const createMaterials = (): Record<string, Material> => ({
  // Metallic gold - shiny and reflective
  gold: new MeshStandardMaterial({
    color: '#FFD700',
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.0
  }),
  // Metallic silver - shiny and reflective
  silver: new MeshStandardMaterial({
    color: '#E8E8E8',
    metalness: 0.95,
    roughness: 0.15,
    envMapIntensity: 1.0
  }),
  // Poetz colors - glossy plastic look
  poetzBlue: new MeshPhongMaterial({
    color: '#007BA4',
    shininess: 80,
    specular: '#444444'
  }),
  poetzTeal: new MeshPhongMaterial({
    color: '#24B1A0',
    shininess: 80,
    specular: '#444444'
  }),
  poetzOrange: new MeshPhongMaterial({
    color: '#E85127',
    shininess: 80,
    specular: '#444444'
  }),
  // Warm white lights - glowing
  warmWhite: new MeshStandardMaterial({
    color: '#FFF8E7',
    emissive: '#FFD700',
    emissiveIntensity: 0.5,
    metalness: 0,
    roughness: 0.8
  })
});

type GeometryType = 'ballLarge' | 'ballSmall' | 'diamondStar' | 'sixPointStar';
type MaterialType = 'gold' | 'silver' | 'poetzBlue' | 'poetzTeal' | 'poetzOrange' | 'warmWhite';

interface ItemConfig {
  geometry: GeometryType;
  material: MaterialType;
  count: number;
}

const generateConePositions = (count: number) => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const hRand = Math.random();
    const hNorm = 1 - Math.sqrt(1 - hRand);
    const h = hNorm * TREE_HEIGHT;
    const r = (1 - h / TREE_HEIGHT) * TREE_RADIUS * (0.8 + Math.random() * 0.2);
    const angle = Math.random() * Math.PI * 2;
    const dist = (0.6 + Math.random() * 0.4) * r;
    arr[i * 3] = Math.cos(angle) * dist;
    arr[i * 3 + 1] = h - TREE_HEIGHT * 0.5;
    arr[i * 3 + 2] = Math.sin(angle) * dist;
  }
  return arr;
};

const generateChaosPositions = (count: number) => {
  return generateFullLogoPositions(count, 16, 2);
};

const ChristmasTree = ({ mode, isMobile }: Props) => {
  // Increased item count: 550 desktop, 280 mobile
  const total = isMobile ? 280 : 550;

  // Item distribution - geometry + material combinations
  // Reduced from 21 to 12 combinations for better performance
  const itemConfigs = useMemo<ItemConfig[]>(() => {
    const configs: ItemConfig[] = [
      // Large balls (25%)
      { geometry: 'ballLarge', material: 'gold', count: Math.round(total * 0.10) },
      { geometry: 'ballLarge', material: 'silver', count: Math.round(total * 0.10) },
      { geometry: 'ballLarge', material: 'poetzBlue', count: Math.round(total * 0.03) },
      { geometry: 'ballLarge', material: 'poetzTeal', count: Math.round(total * 0.02) },

      // Small balls / lights (10%) - these will twinkle
      { geometry: 'ballSmall', material: 'warmWhite', count: Math.round(total * 0.10) },

      // Diamond stars (35%)
      { geometry: 'diamondStar', material: 'gold', count: Math.round(total * 0.18) },
      { geometry: 'diamondStar', material: 'silver', count: Math.round(total * 0.12) },
      { geometry: 'diamondStar', material: 'poetzOrange', count: Math.round(total * 0.05) },

      // Six-point stars (30%)
      { geometry: 'sixPointStar', material: 'gold', count: Math.round(total * 0.15) },
      { geometry: 'sixPointStar', material: 'silver', count: Math.round(total * 0.10) },
      { geometry: 'sixPointStar', material: 'poetzTeal', count: Math.round(total * 0.05) }
    ];

    // Adjust last item to match total exactly
    const allocated = configs.reduce((sum, c) => sum + c.count, 0);
    if (allocated !== total) {
      configs[configs.length - 1].count += total - allocated;
    }

    return configs;
  }, [total]);

  // Calculate segments (start/end indices for each config)
  const segments = useMemo(() => {
    const segs: { config: ItemConfig; start: number; end: number; key: string }[] = [];
    let cursor = 0;
    itemConfigs.forEach((config, idx) => {
      segs.push({
        config,
        start: cursor,
        end: cursor + config.count,
        key: `${config.geometry}-${config.material}-${idx}`
      });
      cursor += config.count;
    });
    return segs;
  }, [itemConfigs]);

  const geometries = useMemo(() => createGeometries(), []);
  const materials = useMemo(() => createMaterials(), []);

  const formedPositions = useMemo(() => generateConePositions(total), [total]);
  const chaosPositions = useMemo(
    () => generateChaosPositions(total),
    [total]
  );

  const currentPositions = useRef<Float32Array>(new Float32Array(total * 3));
  const meshRefs = useRef<Record<string, InstancedMesh | null>>({});
  const dummy = useRef(new Object3D());

  // Initialize positions
  useEffect(() => {
    currentPositions.current.set(formedPositions);

    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [formedPositions, geometries, materials]);

  useFrame((state, delta) => {
    const lerp = 1 - Math.exp(-delta * 2.5);
    const time = state.clock.getElapsedTime();

    segments.forEach((seg) => {
      const mesh = meshRefs.current[seg.key];
      if (!mesh) return;

      const isLight = seg.config.material === 'warmWhite';

      for (let i = 0; i < seg.config.count; i++) {
        const globalIndex = seg.start + i;
        const idx = globalIndex * 3;
        const targetArr = mode === 'formed' ? formedPositions : chaosPositions;

        // Lerp positions
        const cx = currentPositions.current[idx];
        const cy = currentPositions.current[idx + 1];
        const cz = currentPositions.current[idx + 2];

        const nx = cx + (targetArr[idx] - cx) * lerp;
        const ny = cy + (targetArr[idx + 1] - cy) * lerp;
        const nz = cz + (targetArr[idx + 2] - cz) * lerp;

        currentPositions.current[idx] = nx;
        currentPositions.current[idx + 1] = ny;
        currentPositions.current[idx + 2] = nz;

        // Set transform
        dummy.current.position.set(nx, ny, nz);
        dummy.current.rotation.y = ((globalIndex + 1) * 13.37) % Math.PI;

        // Twinkle effect for lights
        if (isLight) {
          const twinkle = 0.7 + Math.sin(time * 4 + globalIndex * 0.5) * 0.3;
          dummy.current.scale.setScalar(twinkle);
        } else {
          dummy.current.scale.setScalar(1);
        }

        dummy.current.updateMatrix();
        mesh.setMatrixAt(i, dummy.current.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    });

    // Animate emissive intensity for lights
    const warmWhiteMat = materials.warmWhite as MeshStandardMaterial;
    if (warmWhiteMat) {
      warmWhiteMat.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group>
      {segments.map((seg) => (
        <instancedMesh
          key={seg.key}
          ref={(ref) => {
            meshRefs.current[seg.key] = ref;
          }}
          args={[geometries[seg.config.geometry], materials[seg.config.material], seg.config.count]}
          frustumCulled
        />
      ))}
    </group>
  );
};

export default ChristmasTree;
