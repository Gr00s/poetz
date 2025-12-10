import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Matrix4, MeshStandardMaterial, Vector3, BufferGeometry, BoxGeometry, SphereGeometry, Shape, ExtrudeGeometry } from 'three';
import { useFrame } from '@react-three/fiber';
import { DisplayMode, ShapeVariant } from '../types';
import { generateCloudShapePositions, generateTextShapePositions, generateFullLogoPositions, generateFilledLogoPositions } from '../utils/svgSampler';

const TREE_HEIGHT = 16;
const TREE_RADIUS = 5.5;

interface Props {
  mode: DisplayMode;
  isMobile: boolean;
  shapeVariant: ShapeVariant;
}

interface ShapeConfig {
  key: string;
  geometry: BufferGeometry;
  material: MeshStandardMaterial;
  count: number;
}

// Create 4-pointed diamond star
const createDiamondStarGeometry = (size: number = 0.2): BufferGeometry => {
  const shape = new Shape();
  shape.moveTo(0, size);           // top
  shape.lineTo(size * 0.3, 0);     // right
  shape.lineTo(0, -size);          // bottom
  shape.lineTo(-size * 0.3, 0);    // left
  shape.closePath();

  return new ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
};

// Create 6-pointed star (Star of David style)
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

// Create simple gift box shape
const createGiftGeometry = (): BufferGeometry => {
  return new BoxGeometry(0.28, 0.28, 0.28);
};

const generateConePositions = (count: number) => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Uniform distribution within cone volume
    // For a cone, we need to account for the varying cross-sectional area
    const hRand = Math.random();
    // Use 1 - sqrt(1-rand) to get more items where cone is wider (bottom)
    const hNorm = 1 - Math.sqrt(1 - hRand);
    const h = hNorm * TREE_HEIGHT;

    // Radius at this height
    const r = (1 - h / TREE_HEIGHT) * TREE_RADIUS * (0.8 + Math.random() * 0.2);
    const angle = Math.random() * Math.PI * 2;
    // Position items toward the surface of the cone (not inside)
    const dist = (0.6 + Math.random() * 0.4) * r;

    arr[i * 3] = Math.cos(angle) * dist;
    arr[i * 3 + 1] = h - TREE_HEIGHT * 0.5;
    arr[i * 3 + 2] = Math.sin(angle) * dist;
  }
  return arr;
};

const generateChaosPositions = (count: number, variant: ShapeVariant) => {
  switch (variant) {
    case 'cloud':
      return generateCloudShapePositions(count, 14, 2.5);
    case 'text':
      return generateTextShapePositions(count, 16, 2);
    case 'logo':
      return generateFullLogoPositions(count, 16, 2);
    case 'logo-filled':
      return generateFilledLogoPositions(count, 16, 2);
    default:
      return generateFullLogoPositions(count, 16, 2);
  }
};

const createShapes = (total: number): ShapeConfig[] => {
  // Kleuren: 90% goud/zilver, 10% Poetz kleuren
  const colors = {
    blue: '#007BA4',      // Poetz blauw
    teal: '#24B1A0',      // Poetz zeegroen
    orange: '#E85127'     // Poetz oranje
  };

  const clampCount = (value: number) => Math.max(0, Math.round(value));

  // Christmas geometries
  const ornamentGeometry = new SphereGeometry(0.24, 16, 12);
  const smallOrnamentGeometry = new SphereGeometry(0.16, 12, 10);
  const diamondStarGeometry = createDiamondStarGeometry(0.22);
  const sixPointStarGeometry = createSixPointStarGeometry(0.2);
  const smallDiamondGeometry = createDiamondStarGeometry(0.15);
  const smallSixPointGeometry = createSixPointStarGeometry(0.14);
  const giftGeometry = createGiftGeometry();
  const lightGeometry = new SphereGeometry(0.1, 8, 6);

  // Metallic gold material (glanzend goud)
  const goldMaterial = new MeshStandardMaterial({
    color: '#FFD700',
    metalness: 0.9,
    roughness: 0.2
  });

  // Metallic silver material (glanzend zilver)
  const silverMaterial = new MeshStandardMaterial({
    color: '#E8E8E8',
    metalness: 0.95,
    roughness: 0.15
  });

  // Poetz kleuren (mat, niet metallic)
  const blueMaterial = new MeshStandardMaterial({ color: colors.blue, metalness: 0.3, roughness: 0.6 });
  const tealMaterial = new MeshStandardMaterial({ color: colors.teal, metalness: 0.3, roughness: 0.6 });
  const orangeMaterial = new MeshStandardMaterial({ color: colors.orange, metalness: 0.3, roughness: 0.6 });

  // Light material
  const lightMaterial = new MeshStandardMaterial({
    color: '#FFF8E7',
    emissive: '#FFD700',
    emissiveIntensity: 0.6,
    metalness: 0,
    roughness: 0.8
  });

  const shapes: ShapeConfig[] = [
    // === STERREN (55% totaal) ===

    // Diamant sterren - goud (20%)
    {
      key: 'diamond-star-gold',
      geometry: diamondStarGeometry,
      material: goldMaterial,
      count: clampCount(total * 0.12)
    },
    {
      key: 'diamond-star-gold-small',
      geometry: smallDiamondGeometry,
      material: goldMaterial,
      count: clampCount(total * 0.08)
    },

    // Diamant sterren - zilver (10%)
    {
      key: 'diamond-star-silver',
      geometry: diamondStarGeometry,
      material: silverMaterial,
      count: clampCount(total * 0.06)
    },
    {
      key: 'diamond-star-silver-small',
      geometry: smallDiamondGeometry,
      material: silverMaterial,
      count: clampCount(total * 0.04)
    },

    // 6-puntige sterren - goud (12%)
    {
      key: 'six-star-gold',
      geometry: sixPointStarGeometry,
      material: goldMaterial,
      count: clampCount(total * 0.07)
    },
    {
      key: 'six-star-gold-small',
      geometry: smallSixPointGeometry,
      material: goldMaterial,
      count: clampCount(total * 0.05)
    },

    // 6-puntige sterren - zilver (8%)
    {
      key: 'six-star-silver',
      geometry: sixPointStarGeometry,
      material: silverMaterial,
      count: clampCount(total * 0.05)
    },
    {
      key: 'six-star-silver-small',
      geometry: smallSixPointGeometry,
      material: silverMaterial,
      count: clampCount(total * 0.03)
    },

    // Sterren - Poetz kleuren (5%)
    {
      key: 'diamond-star-blue',
      geometry: smallDiamondGeometry,
      material: blueMaterial,
      count: clampCount(total * 0.02)
    },
    {
      key: 'six-star-teal',
      geometry: smallSixPointGeometry,
      material: tealMaterial,
      count: clampCount(total * 0.02)
    },
    {
      key: 'diamond-star-orange',
      geometry: smallDiamondGeometry,
      material: orangeMaterial,
      count: clampCount(total * 0.01)
    },

    // === KERSTBALLEN (25% totaal) ===

    // Kerstballen - goud (10%)
    {
      key: 'ornament-gold',
      geometry: ornamentGeometry,
      material: goldMaterial,
      count: clampCount(total * 0.06)
    },
    {
      key: 'small-ornament-gold',
      geometry: smallOrnamentGeometry,
      material: goldMaterial,
      count: clampCount(total * 0.04)
    },

    // Kerstballen - zilver (10%)
    {
      key: 'ornament-silver',
      geometry: ornamentGeometry,
      material: silverMaterial,
      count: clampCount(total * 0.06)
    },
    {
      key: 'small-ornament-silver',
      geometry: smallOrnamentGeometry,
      material: silverMaterial,
      count: clampCount(total * 0.04)
    },

    // Kerstballen - Poetz kleuren (5%)
    {
      key: 'ornament-blue',
      geometry: smallOrnamentGeometry,
      material: blueMaterial,
      count: clampCount(total * 0.02)
    },
    {
      key: 'ornament-teal',
      geometry: smallOrnamentGeometry,
      material: tealMaterial,
      count: clampCount(total * 0.02)
    },
    {
      key: 'ornament-orange',
      geometry: smallOrnamentGeometry,
      material: orangeMaterial,
      count: clampCount(total * 0.01)
    },

    // === CADEAUTJES (8%) ===
    {
      key: 'gift-gold',
      geometry: giftGeometry,
      material: goldMaterial,
      count: clampCount(total * 0.04)
    },
    {
      key: 'gift-silver',
      geometry: giftGeometry,
      material: silverMaterial,
      count: clampCount(total * 0.03)
    },
    {
      key: 'gift-orange',
      geometry: giftGeometry,
      material: orangeMaterial,
      count: clampCount(total * 0.01)
    },

    // === LICHTJES (12%) ===
    {
      key: 'light-warm',
      geometry: lightGeometry,
      material: lightMaterial,
      count: clampCount(total * 0.12)
    }
  ];

  const filtered = shapes.filter((s) => s.count > 0);
  const allocated = filtered.reduce((sum, s) => sum + s.count, 0);
  if (allocated < total && filtered.length) {
    filtered[0].count += total - allocated;
  } else if (allocated > total && filtered.length) {
    const extra = allocated - total;
    filtered[filtered.length - 1].count = Math.max(0, filtered[filtered.length - 1].count - extra);
  }

  return filtered;
};

const ChristmasTree = ({ mode, isMobile, shapeVariant }: Props) => {
  const total = isMobile ? 175 : 320;
  const shapes = useMemo(() => createShapes(total), [total]);
  const formedPositions = useMemo(() => generateConePositions(total), [total]);
  const chaosPositions = useMemo(() => generateChaosPositions(total, shapeVariant), [total, shapeVariant]);
  const currentPositions = useRef<Float32Array>(new Float32Array(total * 3));
  const matrix = useRef(new Matrix4());
  const rotationMatrix = useRef(new Matrix4());
  const temp = useRef(new Vector3());
  const meshRefs = useRef<Record<string, InstancedMesh>>({});

  const segments = useMemo(() => {
    const segs: { key: string; start: number; end: number; geometry: BufferGeometry; material: MeshStandardMaterial }[] = [];
    let cursor = 0;
    shapes.forEach((s) => {
      segs.push({ key: s.key, start: cursor, end: cursor + s.count, geometry: s.geometry, material: s.material });
      cursor += s.count;
    });
    return segs;
  }, [shapes]);

  useEffect(() => {
    currentPositions.current.set(formedPositions);
    return () => {
      shapes.forEach((s) => {
        s.geometry.dispose();
        s.material.dispose();
      });
    };
  }, [formedPositions, shapes]);

  useFrame((_, delta) => {
    const lerp = 1 - Math.exp(-delta * 2.5);
    segments.forEach((seg) => {
      let instanceIndex = 0;
      for (let i = seg.start; i < seg.end; i++) {
        const idx = i * 3;
        const targetArr = mode === 'formed' ? formedPositions : chaosPositions;
        const cx = currentPositions.current[idx];
        const cy = currentPositions.current[idx + 1];
        const cz = currentPositions.current[idx + 2];
        const tx = targetArr[idx];
        const ty = targetArr[idx + 1];
        const tz = targetArr[idx + 2];

        const nx = cx + (tx - cx) * lerp;
        const ny = cy + (ty - cy) * lerp;
        const nz = cz + (tz - cz) * lerp;

        currentPositions.current[idx] = nx;
        currentPositions.current[idx + 1] = ny;
        currentPositions.current[idx + 2] = nz;

        temp.current.set(nx, ny, nz);
        matrix.current.makeTranslation(temp.current.x, temp.current.y, temp.current.z);
        rotationMatrix.current.makeRotationY(((i + 1) * 13.37) % Math.PI);
        matrix.current.multiply(rotationMatrix.current);
        const mesh = meshRefs.current[seg.key];
        mesh?.setMatrixAt(instanceIndex, matrix.current);
        instanceIndex++;
      }
    });
    Object.values(meshRefs.current).forEach((mesh) => mesh.instanceMatrix.needsUpdate = true);
  });

  return (
    <group>
      {segments.map((seg) => (
        <instancedMesh
          key={seg.key}
          ref={(ref) => {
            if (ref) meshRefs.current[seg.key] = ref;
          }}
          args={[seg.geometry, seg.material, seg.end - seg.start]}
          frustumCulled
        />
      ))}
    </group>
  );
};

export default ChristmasTree;

