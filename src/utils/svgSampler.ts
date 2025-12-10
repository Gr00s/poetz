/**
 * Sample points from an SVG path to create 3D positions
 */

// Simplified Poetz cloud shape as sampled points (pre-computed from SVG)
// The cloud SVG viewBox is 0 0 127.22 62.78
const CLOUD_POINTS: [number, number][] = [];

// Sample the cloud outline by tracing the main shape
// These are normalized coordinates (0-1) representing the cloud silhouette
const generateCloudPoints = (count: number): [number, number][] => {
  const points: [number, number][] = [];

  // Cloud shape approximation - main outline points
  // Normalized to 0-1 range based on viewBox 127.22 x 62.78
  const cloudOutline: [number, number][] = [
    // Bottom left curve
    [0.02, 0.65], [0.04, 0.55], [0.03, 0.45], [0.02, 0.35],
    [0.05, 0.25], [0.10, 0.18], [0.15, 0.12], [0.22, 0.08],
    // Top left bump
    [0.30, 0.06], [0.38, 0.05], [0.45, 0.06], [0.50, 0.10],
    // Top middle
    [0.55, 0.08], [0.62, 0.05], [0.70, 0.04], [0.78, 0.06],
    // Top right bump
    [0.85, 0.10], [0.90, 0.16], [0.94, 0.24], [0.96, 0.32],
    // Right side
    [0.98, 0.42], [0.97, 0.52], [0.94, 0.60], [0.90, 0.68],
    // Bottom right
    [0.85, 0.75], [0.78, 0.82], [0.70, 0.88], [0.60, 0.92],
    // Bottom middle
    [0.50, 0.95], [0.40, 0.96], [0.30, 0.94], [0.20, 0.90],
    // Bottom left
    [0.12, 0.84], [0.06, 0.76], [0.03, 0.70]
  ];

  // Generate points by interpolating along the outline and filling interior
  for (let i = 0; i < count; i++) {
    const t = i / count;

    // 70% on outline, 30% interior fill
    if (Math.random() < 0.7) {
      // Sample along outline
      const idx = Math.floor(t * cloudOutline.length);
      const nextIdx = (idx + 1) % cloudOutline.length;
      const localT = (t * cloudOutline.length) % 1;

      const p1 = cloudOutline[idx];
      const p2 = cloudOutline[nextIdx];

      // Interpolate with some noise
      const x = p1[0] + (p2[0] - p1[0]) * localT + (Math.random() - 0.5) * 0.05;
      const y = p1[1] + (p2[1] - p1[1]) * localT + (Math.random() - 0.5) * 0.05;

      points.push([x, y]);
    } else {
      // Interior point - simple rejection sampling
      let x = 0.1 + Math.random() * 0.8;
      let y = 0.1 + Math.random() * 0.8;

      // Simple cloud shape check (rough approximation)
      const centerX = 0.5;
      const centerY = 0.5;
      const dx = (x - centerX) * 1.5; // Stretch horizontally
      const dy = y - centerY;

      // Accept if within ellipse-ish cloud shape
      if (dx * dx + dy * dy < 0.4) {
        points.push([x, y]);
      } else {
        // Fallback to outline
        const idx = Math.floor(Math.random() * cloudOutline.length);
        points.push([
          cloudOutline[idx][0] + (Math.random() - 0.5) * 0.08,
          cloudOutline[idx][1] + (Math.random() - 0.5) * 0.08
        ]);
      }
    }
  }

  return points;
};

/**
 * Generate 3D positions that form the Poetz cloud shape
 * @param count Number of positions to generate
 * @param scale Scale factor for the shape
 * @param depth Depth variation (z-axis)
 */
export const generateCloudShapePositions = (
  count: number,
  scale: number = 12,
  depth: number = 2
): Float32Array => {
  const positions = new Float32Array(count * 3);
  const points = generateCloudPoints(count);

  for (let i = 0; i < count; i++) {
    const [nx, ny] = points[i] || [0.5, 0.5];

    // Convert normalized coords to 3D space
    // Center the shape and apply scale
    const x = (nx - 0.5) * scale;
    const y = (0.5 - ny) * scale * 0.5; // Flip Y and reduce height
    const z = (Math.random() - 0.5) * depth;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
};

/**
 * Generate 3D positions that form the POETZ text
 */
export const generateTextShapePositions = (
  count: number,
  scale: number = 14,
  depth: number = 1.5
): Float32Array => {
  const positions = new Float32Array(count * 3);

  // Simplified letter shapes for P-O-E-T-Z
  // Each letter is defined by key points, normalized 0-1 within letter bounds
  const letters: { char: string; points: [number, number][]; width: number }[] = [
    {
      char: 'P',
      width: 0.15,
      points: [
        [0, 1], [0, 0.5], [0, 0], // stem
        [0.1, 0], [0.15, 0.1], [0.15, 0.25], [0.1, 0.35], [0, 0.35] // bowl
      ]
    },
    {
      char: 'O',
      width: 0.18,
      points: [
        [0.09, 0], [0.18, 0.2], [0.18, 0.8], [0.09, 1], // right
        [0.09, 1], [0, 0.8], [0, 0.2], [0.09, 0] // left
      ]
    },
    {
      char: 'E',
      width: 0.14,
      points: [
        [0, 0], [0.14, 0], // top
        [0, 0], [0, 0.5], [0, 1], // stem
        [0, 0.5], [0.12, 0.5], // middle
        [0, 1], [0.14, 1] // bottom
      ]
    },
    {
      char: 'T',
      width: 0.16,
      points: [
        [0, 0], [0.16, 0], // top bar
        [0.08, 0], [0.08, 1] // stem
      ]
    },
    {
      char: 'Z',
      width: 0.14,
      points: [
        [0, 0], [0.14, 0], // top
        [0.14, 0], [0, 1], // diagonal
        [0, 1], [0.14, 1] // bottom
      ]
    }
  ];

  const totalWidth = letters.reduce((sum, l) => sum + l.width, 0) + 0.04 * 4; // + spacing
  let currentX = 0;

  // Assign points per letter proportionally
  const pointsPerLetter = Math.floor(count / letters.length);
  let pointIndex = 0;

  letters.forEach((letter, letterIdx) => {
    const letterPoints = letter.points;
    const numPoints = letterIdx === letters.length - 1
      ? count - pointIndex
      : pointsPerLetter;

    for (let i = 0; i < numPoints && pointIndex < count; i++) {
      // Pick a random segment of the letter
      const segIdx = Math.floor(Math.random() * (letterPoints.length - 1));
      const p1 = letterPoints[segIdx];
      const p2 = letterPoints[(segIdx + 1) % letterPoints.length];

      // Interpolate along segment with noise
      const t = Math.random();
      const lx = p1[0] + (p2[0] - p1[0]) * t;
      const ly = p1[1] + (p2[1] - p1[1]) * t;

      // Convert to world coords
      const x = ((currentX + lx) / totalWidth - 0.5) * scale;
      const y = (0.5 - ly) * scale * 0.4;
      const z = (Math.random() - 0.5) * depth;

      positions[pointIndex * 3] = x + (Math.random() - 0.5) * 0.3;
      positions[pointIndex * 3 + 1] = y + (Math.random() - 0.5) * 0.3;
      positions[pointIndex * 3 + 2] = z;

      pointIndex++;
    }

    currentX += letter.width + 0.04;
  });

  return positions;
};

/**
 * Generate 3D positions for the complete Poetz logo (cloud + text)
 * Cloud outline with POETZ text inside
 */
export const generateFullLogoPositions = (
  count: number,
  scale: number = 14,
  depth: number = 2
): Float32Array => {
  const positions = new Float32Array(count * 3);

  // Cloud outline (same as before but scaled to match logo proportions)
  // viewBox: 0 0 121.39 61.02
  const cloudOutline: [number, number][] = [
    // Left side curve
    [0.03, 0.87], [0.02, 0.75], [0.03, 0.60], [0.05, 0.45],
    [0.08, 0.30], [0.12, 0.18], [0.18, 0.10], [0.26, 0.05],
    // Top bumps (3 bumps like in the logo)
    [0.34, 0.08], [0.38, 0.12], [0.42, 0.08], [0.48, 0.04],
    [0.55, 0.08], [0.60, 0.04], [0.68, 0.02], [0.76, 0.06],
    // Right top curve
    [0.82, 0.12], [0.86, 0.20], [0.88, 0.28],
    // Right side notch (where the logo has a dip)
    [0.92, 0.32], [0.95, 0.28], [0.98, 0.32], [0.99, 0.40],
    // Right side down
    [0.98, 0.52], [0.95, 0.62], [0.90, 0.72],
    // Bottom right
    [0.82, 0.82], [0.72, 0.90], [0.60, 0.95],
    // Bottom middle
    [0.48, 0.97], [0.36, 0.96], [0.24, 0.92],
    // Bottom left
    [0.14, 0.88], [0.06, 0.82], [0.03, 0.75]
  ];

  // POETZ text positioned inside the cloud
  // Positioned roughly in center-bottom of cloud
  const textPoints: [number, number][] = [];

  // P - positioned at left
  const pBase = { x: 0.15, y: 0.35 };
  const pHeight = 0.45;
  const pWidth = 0.08;
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    textPoints.push([pBase.x, pBase.y + t * pHeight]); // stem
  }
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (i / 5) * Math.PI;
    textPoints.push([
      pBase.x + pWidth * 0.5 + Math.cos(angle) * pWidth * 0.5,
      pBase.y + pHeight * 0.15 + Math.sin(angle) * pHeight * 0.15
    ]);
  }

  // O
  const oBase = { x: 0.30, y: 0.35 };
  const oRadius = 0.05;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    textPoints.push([
      oBase.x + Math.cos(angle) * oRadius,
      oBase.y + pHeight * 0.5 + Math.sin(angle) * pHeight * 0.25
    ]);
  }

  // E
  const eBase = { x: 0.42, y: 0.35 };
  for (let i = 0; i < 6; i++) textPoints.push([eBase.x, eBase.y + (i / 5) * pHeight]); // stem
  for (let i = 0; i < 4; i++) textPoints.push([eBase.x + (i / 3) * pWidth, eBase.y]); // top
  for (let i = 0; i < 3; i++) textPoints.push([eBase.x + (i / 2) * pWidth * 0.8, eBase.y + pHeight * 0.5]); // mid
  for (let i = 0; i < 4; i++) textPoints.push([eBase.x + (i / 3) * pWidth, eBase.y + pHeight]); // bottom

  // T
  const tBase = { x: 0.56, y: 0.35 };
  for (let i = 0; i < 6; i++) textPoints.push([tBase.x + pWidth * 0.5, tBase.y + (i / 5) * pHeight]); // stem
  for (let i = 0; i < 5; i++) textPoints.push([tBase.x + (i / 4) * pWidth, tBase.y]); // top bar

  // Z
  const zBase = { x: 0.68, y: 0.35 };
  for (let i = 0; i < 4; i++) textPoints.push([zBase.x + (i / 3) * pWidth, zBase.y]); // top
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    textPoints.push([zBase.x + pWidth - t * pWidth, zBase.y + t * pHeight]); // diagonal
  }
  for (let i = 0; i < 4; i++) textPoints.push([zBase.x + (i / 3) * pWidth, zBase.y + pHeight]); // bottom

  // Distribute points: 40% cloud outline, 60% text
  const cloudCount = Math.floor(count * 0.4);
  const textCount = count - cloudCount;

  // Generate cloud outline points
  for (let i = 0; i < cloudCount; i++) {
    const t = i / cloudCount;
    const idx = Math.floor(t * cloudOutline.length);
    const nextIdx = (idx + 1) % cloudOutline.length;
    const localT = (t * cloudOutline.length) % 1;

    const p1 = cloudOutline[idx];
    const p2 = cloudOutline[nextIdx];

    const x = p1[0] + (p2[0] - p1[0]) * localT + (Math.random() - 0.5) * 0.03;
    const y = p1[1] + (p2[1] - p1[1]) * localT + (Math.random() - 0.5) * 0.03;

    positions[i * 3] = (x - 0.5) * scale;
    positions[i * 3 + 1] = (0.5 - y) * scale * 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * depth;
  }

  // Generate text points
  for (let i = 0; i < textCount; i++) {
    const idx = Math.floor(Math.random() * textPoints.length);
    const [px, py] = textPoints[idx];

    const x = px + (Math.random() - 0.5) * 0.02;
    const y = py + (Math.random() - 0.5) * 0.02;

    positions[(cloudCount + i) * 3] = (x - 0.5) * scale;
    positions[(cloudCount + i) * 3 + 1] = (0.5 - y) * scale * 0.5;
    positions[(cloudCount + i) * 3 + 2] = (Math.random() - 0.5) * depth;
  }

  return positions;
};

/**
 * Generate 3D positions for filled Poetz logo (solid cloud with text cutout effect)
 * This fills the cloud interior with particles, making text visible as negative space
 */
export const generateFilledLogoPositions = (
  count: number,
  scale: number = 14,
  depth: number = 2
): Float32Array => {
  const positions = new Float32Array(count * 3);

  // Cloud boundary for rejection sampling
  const isInsideCloud = (x: number, y: number): boolean => {
    // Approximate cloud shape as combination of ellipses
    // Main body
    const centerX = 0.5;
    const centerY = 0.55;
    const dx = (x - centerX) / 0.48;
    const dy = (y - centerY) / 0.42;

    if (dx * dx + dy * dy > 1) return false;

    // Cut off top bumps area more precisely
    if (y < 0.15) {
      // Only allow in bump regions
      const inBump1 = Math.abs(x - 0.25) < 0.12 && y > 0.05;
      const inBump2 = Math.abs(x - 0.50) < 0.12 && y > 0.03;
      const inBump3 = Math.abs(x - 0.75) < 0.15 && y > 0.05;
      if (!inBump1 && !inBump2 && !inBump3) return false;
    }

    return true;
  };

  // Text regions to avoid (creates negative space for letters)
  const isInsideText = (x: number, y: number): boolean => {
    const textY = y > 0.32 && y < 0.85;
    if (!textY) return false;

    // P region
    if (x > 0.12 && x < 0.24) {
      if (x < 0.16) return true; // P stem
      if (y < 0.55) return true; // P bowl area
    }
    // O region
    if (x > 0.26 && x < 0.38) {
      const ox = (x - 0.32) / 0.06;
      const oy = (y - 0.58) / 0.25;
      if (ox * ox + oy * oy < 1) return true;
    }
    // E region
    if (x > 0.40 && x < 0.52) {
      if (x < 0.44) return true; // E stem
      if (y < 0.40 || y > 0.75 || (y > 0.54 && y < 0.62)) return true; // E bars
    }
    // T region
    if (x > 0.54 && x < 0.66) {
      if (y < 0.42) return true; // T top bar
      if (x > 0.58 && x < 0.62) return true; // T stem
    }
    // Z region
    if (x > 0.68 && x < 0.80) {
      if (y < 0.40 || y > 0.78) return true; // Z top/bottom bars
      // Z diagonal
      const zt = (y - 0.35) / 0.50;
      const expectedX = 0.78 - zt * 0.10;
      if (Math.abs(x - expectedX) < 0.03) return true;
    }

    return false;
  };

  let generated = 0;
  let attempts = 0;
  const maxAttempts = count * 20;

  while (generated < count && attempts < maxAttempts) {
    attempts++;

    const x = 0.05 + Math.random() * 0.90;
    const y = 0.03 + Math.random() * 0.94;

    // Must be inside cloud but NOT inside text (text becomes negative space)
    if (isInsideCloud(x, y) && !isInsideText(x, y)) {
      positions[generated * 3] = (x - 0.5) * scale;
      positions[generated * 3 + 1] = (0.5 - y) * scale * 0.5;
      positions[generated * 3 + 2] = (Math.random() - 0.5) * depth;
      generated++;
    }
  }

  // Fill remaining with random cloud points if needed
  while (generated < count) {
    const x = 0.2 + Math.random() * 0.6;
    const y = 0.2 + Math.random() * 0.6;
    positions[generated * 3] = (x - 0.5) * scale;
    positions[generated * 3 + 1] = (0.5 - y) * scale * 0.5;
    positions[generated * 3 + 2] = (Math.random() - 0.5) * depth;
    generated++;
  }

  return positions;
};
