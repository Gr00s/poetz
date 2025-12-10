/**
 * Sample points from an SVG path to create 3D positions
 */

// Shuffle positions array to mix different item types when displayed
const shufflePositions = (positions: Float32Array): Float32Array => {
  const count = positions.length / 3;
  // Fisher-Yates shuffle on triplets
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap position i and j (each position is 3 floats)
    for (let k = 0; k < 3; k++) {
      const temp = positions[i * 3 + k];
      positions[i * 3 + k] = positions[j * 3 + k];
      positions[j * 3 + k] = temp;
    }
  }
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

  return shufflePositions(positions);
};
