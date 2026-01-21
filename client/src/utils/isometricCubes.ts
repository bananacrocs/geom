/**
 * Definizioni dei cubi isometrici - SVG puliti e precisi
 */

import { getCubePaths, getOrbitPoint } from './isometricGeometry';
import type { IsometricCubeConfig } from '../stores/isometricStore';

// Colori Attio-style
const C = {
  top: '#ffffff',
  left: '#e8e8e8',
  right: '#f4f4f4',
  stroke: '#c8c8c8',
  strokeLight: '#b0b0b0'
};

// Formatta numero per SVG
const f = (n: number): string => Number(n.toFixed(2)).toString();

/**
 * SVG Header standard
 */
const svgOpen = (w: number, h: number): string =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;

const svgClose = '</svg>';

/**
 * 1. Cubo Solid - Cubo pieno standard
 */
export function createSolidCube(): string {
  const size = 50, cx = 60, topY = 15;
  const p = getCubePaths(cx, topY, size);

  return `${svgOpen(120, 130)}
  <path d="${p.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${p.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${p.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/**
 * 2. Cubo Wireframe - Solo bordi, nascosti tratteggiati
 */
export function createWireframeCube(): string {
  const size = 50, cx = 60, topY = 15;
  const p = getCubePaths(cx, topY, size);
  const v = p.vertices;

  // Bordi nascosti (dal centro verso bottom, bottomLeft, bottomRight)
  const hidden = [
    `<line x1="${f(v.center[0])}" y1="${f(v.center[1])}" x2="${f(v.bottom[0])}" y2="${f(v.bottom[1])}" stroke="${C.strokeLight}" stroke-width="1.5" stroke-dasharray="4 3"/>`,
    `<line x1="${f(v.center[0])}" y1="${f(v.center[1])}" x2="${f(v.bottomLeft[0])}" y2="${f(v.bottomLeft[1])}" stroke="${C.strokeLight}" stroke-width="1.5" stroke-dasharray="4 3"/>`,
    `<line x1="${f(v.center[0])}" y1="${f(v.center[1])}" x2="${f(v.bottomRight[0])}" y2="${f(v.bottomRight[1])}" stroke="${C.strokeLight}" stroke-width="1.5" stroke-dasharray="4 3"/>`
  ].join('\n  ');

  // Bordi visibili
  const visible = [
    // Contorno esterno
    `<line x1="${f(v.top[0])}" y1="${f(v.top[1])}" x2="${f(v.left[0])}" y2="${f(v.left[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`,
    `<line x1="${f(v.top[0])}" y1="${f(v.top[1])}" x2="${f(v.right[0])}" y2="${f(v.right[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`,
    `<line x1="${f(v.left[0])}" y1="${f(v.left[1])}" x2="${f(v.bottomLeft[0])}" y2="${f(v.bottomLeft[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`,
    `<line x1="${f(v.right[0])}" y1="${f(v.right[1])}" x2="${f(v.bottomRight[0])}" y2="${f(v.bottomRight[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`,
    `<line x1="${f(v.bottomLeft[0])}" y1="${f(v.bottomLeft[1])}" x2="${f(v.bottom[0])}" y2="${f(v.bottom[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`,
    `<line x1="${f(v.bottomRight[0])}" y1="${f(v.bottomRight[1])}" x2="${f(v.bottom[0])}" y2="${f(v.bottom[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`,
    // Bordi interni visibili
    `<line x1="${f(v.left[0])}" y1="${f(v.left[1])}" x2="${f(v.center[0])}" y2="${f(v.center[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`,
    `<line x1="${f(v.right[0])}" y1="${f(v.right[1])}" x2="${f(v.center[0])}" y2="${f(v.center[1])}" stroke="${C.stroke}" stroke-width="1.5"/>`
  ].join('\n  ');

  return `${svgOpen(120, 130)}
  ${hidden}
  ${visible}
${svgClose}`;
}

/**
 * 3. Cubo Dashed - Tutto tratteggiato
 */
export function createDashedCube(): string {
  const size = 50, cx = 60, topY = 15;
  const p = getCubePaths(cx, topY, size);

  return `${svgOpen(120, 130)}
  <path d="${p.outline}" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4" stroke-linejoin="round"/>
  <path d="M${f(p.vertices.left[0])},${f(p.vertices.left[1])} L${f(p.vertices.center[0])},${f(p.vertices.center[1])} L${f(p.vertices.right[0])},${f(p.vertices.right[1])}" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4"/>
  <line x1="${f(p.vertices.center[0])}" y1="${f(p.vertices.center[1])}" x2="${f(p.vertices.bottom[0])}" y2="${f(p.vertices.bottom[1])}" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4"/>
${svgClose}`;
}

/**
 * 4. Cubo con Connettori - Nodi agli angoli
 */
export function createConnectorsCube(): string {
  const size = 50, cx = 60, topY = 15;
  const p = getCubePaths(cx, topY, size);
  const v = p.vertices;
  const r = 4; // raggio nodi

  // Linee
  const lines = [
    `<line x1="${f(v.top[0])}" y1="${f(v.top[1])}" x2="${f(v.left[0])}" y2="${f(v.left[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.top[0])}" y1="${f(v.top[1])}" x2="${f(v.right[0])}" y2="${f(v.right[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.left[0])}" y1="${f(v.left[1])}" x2="${f(v.bottomLeft[0])}" y2="${f(v.bottomLeft[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.right[0])}" y1="${f(v.right[1])}" x2="${f(v.bottomRight[0])}" y2="${f(v.bottomRight[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.bottomLeft[0])}" y1="${f(v.bottomLeft[1])}" x2="${f(v.bottom[0])}" y2="${f(v.bottom[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.bottomRight[0])}" y1="${f(v.bottomRight[1])}" x2="${f(v.bottom[0])}" y2="${f(v.bottom[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.left[0])}" y1="${f(v.left[1])}" x2="${f(v.center[0])}" y2="${f(v.center[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.right[0])}" y1="${f(v.right[1])}" x2="${f(v.center[0])}" y2="${f(v.center[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`,
    `<line x1="${f(v.center[0])}" y1="${f(v.center[1])}" x2="${f(v.bottom[0])}" y2="${f(v.bottom[1])}" stroke="${C.strokeLight}" stroke-width="1.5"/>`
  ].join('\n  ');

  // Nodi (solo vertici visibili)
  const nodes = [
    `<circle cx="${f(v.top[0])}" cy="${f(v.top[1])}" r="${r}" fill="${C.stroke}"/>`,
    `<circle cx="${f(v.left[0])}" cy="${f(v.left[1])}" r="${r}" fill="${C.stroke}"/>`,
    `<circle cx="${f(v.right[0])}" cy="${f(v.right[1])}" r="${r}" fill="${C.stroke}"/>`,
    `<circle cx="${f(v.bottomLeft[0])}" cy="${f(v.bottomLeft[1])}" r="${r}" fill="${C.stroke}"/>`,
    `<circle cx="${f(v.bottomRight[0])}" cy="${f(v.bottomRight[1])}" r="${r}" fill="${C.stroke}"/>`,
    `<circle cx="${f(v.bottom[0])}" cy="${f(v.bottom[1])}" r="${r}" fill="${C.stroke}"/>`
  ].join('\n  ');

  return `${svgOpen(120, 130)}
  ${lines}
  ${nodes}
${svgClose}`;
}

/**
 * 5. Stack di Cubi - 3 cubi sovrapposti
 */
export function createStackCubes(): string {
  const size = 32;
  const cx = 60;
  const cubes: string[] = [];

  // Dal basso verso l'alto
  for (let i = 2; i >= 0; i--) {
    const topY = 15 + i * (size * 0.75);
    const p = getCubePaths(cx, topY, size);
    cubes.push(`<g>
    <path d="${p.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${p.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${p.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>`);
  }

  return `${svgOpen(120, 160)}
  ${cubes.join('\n  ')}
${svgClose}`;
}

/**
 * 6. Cubi Affiancati - 2 cubi side by side
 */
export function createSideBySideCubes(): string {
  const size = 36;
  const w = size * Math.sqrt(3) / 2;
  const cx1 = 55;
  const cx2 = cx1 + w * 2 + 8;
  const topY = 15;
  const width = 170;

  const cubes: string[] = [];
  [cx1, cx2].forEach(cx => {
    const p = getCubePaths(cx, topY, size);
    cubes.push(`<g>
    <path d="${p.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${p.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${p.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>`);
  });

  return `${svgOpen(width, 110)}
  ${cubes.join('\n  ')}
${svgClose}`;
}

/**
 * 7. Cubo Nested - Cubo dentro cubo
 */
export function createNestedCube(): string {
  const outerSize = 50, innerSize = 26;
  const cx = 60, topY = 15;
  const innerTopY = topY + (outerSize - innerSize) / 2;

  const pOuter = getCubePaths(cx, topY, outerSize);
  const pInner = getCubePaths(cx, innerTopY, innerSize);

  return `${svgOpen(120, 130)}
  <path d="${pOuter.outline}" fill="none" stroke="${C.strokeLight}" stroke-width="1.5" stroke-dasharray="5 3" stroke-linejoin="round"/>
  <path d="M${f(pOuter.vertices.left[0])},${f(pOuter.vertices.left[1])} L${f(pOuter.vertices.center[0])},${f(pOuter.vertices.center[1])} L${f(pOuter.vertices.right[0])},${f(pOuter.vertices.right[1])}" fill="none" stroke="${C.strokeLight}" stroke-width="1.5" stroke-dasharray="5 3"/>
  <line x1="${f(pOuter.vertices.center[0])}" y1="${f(pOuter.vertices.center[1])}" x2="${f(pOuter.vertices.bottom[0])}" y2="${f(pOuter.vertices.bottom[1])}" stroke="${C.strokeLight}" stroke-width="1.5" stroke-dasharray="5 3"/>
  <path d="${pInner.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${pInner.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${pInner.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/**
 * 8. Cubo con Ombra
 */
export function createShadowCube(): string {
  const size = 48, cx = 65, topY = 12;
  const p = getCubePaths(cx, topY, size);

  const shadowCx = cx + 5;
  const shadowCy = topY + size * 2 + 12;
  const shadowRx = size * 0.85;
  const shadowRy = size * 0.28;

  return `${svgOpen(130, 135)}
  <defs>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.12)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>
  <ellipse cx="${f(shadowCx)}" cy="${f(shadowCy)}" rx="${f(shadowRx)}" ry="${f(shadowRy)}" fill="url(#shadow)"/>
  <path d="${p.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${p.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${p.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/**
 * 9. Piramide di Cubi - 3 base + 1 top
 */
export function createPyramidCubes(): string {
  const size = 28;
  const w = size * Math.sqrt(3) / 2;
  const h = size * 0.5;
  const cx = 100;
  const baseY = 55;

  // Base: 3 cubi (sinistra, centro-basso, destra)
  const positions = [
    { cx: cx - w, y: baseY },           // sinistra
    { cx: cx + w, y: baseY },           // destra
    { cx: cx, y: baseY + h },           // centro-basso (dietro)
  ];

  // Renderizza dal più lontano al più vicino
  const baseCubes = [2, 0, 1].map(i => {
    const pos = positions[i];
    const p = getCubePaths(pos.cx, pos.y, size);
    return `<g>
    <path d="${p.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${p.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${p.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>`;
  });

  // Top cube
  const topP = getCubePaths(cx, baseY - size + h, size);
  const topCube = `<g>
    <path d="${topP.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${topP.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${topP.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>`;

  return `${svgOpen(200, 160)}
  ${baseCubes.join('\n  ')}
  ${topCube}
${svgClose}`;
}

/**
 * 10. Cubo con Orbita
 */
export function createOrbitCube(): string {
  const size = 40, cx = 70, topY = 30;
  const p = getCubePaths(cx, topY, size);

  const orbitCy = topY + size * 0.5;
  const orbitRx = size * 1.1;
  const orbitRy = size * 0.45;

  // 3 punti sull'orbita
  const dots = [0, 120, 240].map(angle => {
    const pt = getOrbitPoint(cx, orbitCy, orbitRx, angle);
    return `<circle cx="${f(pt.x)}" cy="${f(pt.y)}" r="4" fill="${C.stroke}"/>`;
  }).join('\n  ');

  return `${svgOpen(140, 130)}
  <ellipse cx="${f(cx)}" cy="${f(orbitCy)}" rx="${f(orbitRx)}" ry="${f(orbitRy)}" fill="none" stroke="${C.strokeLight}" stroke-width="1" stroke-dasharray="4 3"/>
  ${dots}
  <path d="${p.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${p.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="${p.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/**
 * 11. Database Stack - Cilindri
 */
export function createDatabaseStack(): string {
  const cx = 60;
  const diskW = 38; // semi-larghezza
  const diskH = 6;  // semi-altezza ellisse
  const bodyH = 20; // altezza corpo cilindro
  const gap = 8;    // gap tra dischi
  const startY = 20;

  const disks: string[] = [];

  for (let i = 2; i >= 0; i--) {
    const y = startY + i * (bodyH + gap);
    const topEllipse = `<ellipse cx="${cx}" cy="${y}" rx="${diskW}" ry="${diskH}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5"/>`;
    const body = `<path d="M${cx - diskW},${y} L${cx - diskW},${y + bodyH} A${diskW},${diskH} 0 0,0 ${cx + diskW},${y + bodyH} L${cx + diskW},${y} A${diskW},${diskH} 0 0,1 ${cx - diskW},${y}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5"/>`;
    disks.push(`<g>\n    ${body}\n    ${topEllipse}\n  </g>`);
  }

  return `${svgOpen(120, 130)}
  ${disks.join('\n  ')}
${svgClose}`;
}

/**
 * 12. Cubo Esploso - Facce separate
 */
export function createExplodedCube(): string {
  const size = 38, cx = 80, topY = 35;
  const p = getCubePaths(cx, topY, size);
  const offset = 10;

  // Offset isometrico per ogni faccia
  const topOff = { x: 0, y: -offset };
  const leftOff = { x: -offset * 0.866, y: offset * 0.5 };
  const rightOff = { x: offset * 0.866, y: offset * 0.5 };

  return `${svgOpen(160, 150)}
  <g transform="translate(${f(leftOff.x)}, ${f(leftOff.y)})">
    <path d="${p.leftFace}" fill="${C.left}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
  <g transform="translate(${f(rightOff.x)}, ${f(rightOff.y)})">
    <path d="${p.rightFace}" fill="${C.right}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
  <g transform="translate(${f(topOff.x)}, ${f(topOff.y)})">
    <path d="${p.topFace}" fill="${C.top}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
${svgClose}`;
}

/**
 * Genera tutti i cubi disponibili
 */
export function generateAllCubes(): IsometricCubeConfig[] {
  return [
    { id: 'solid', name: 'Solid', type: 'solid', svg: createSolidCube(), width: 120, height: 130 },
    { id: 'wireframe', name: 'Wireframe', type: 'wireframe', svg: createWireframeCube(), width: 120, height: 130 },
    { id: 'dashed', name: 'Dashed', type: 'dashed', svg: createDashedCube(), width: 120, height: 130 },
    { id: 'connectors', name: 'Connectors', type: 'connectors', svg: createConnectorsCube(), width: 120, height: 130 },
    { id: 'stack', name: 'Stack', type: 'stack', svg: createStackCubes(), width: 120, height: 160 },
    { id: 'side-by-side', name: 'Side by Side', type: 'side-by-side', svg: createSideBySideCubes(), width: 170, height: 110 },
    { id: 'nested', name: 'Nested', type: 'nested', svg: createNestedCube(), width: 120, height: 130 },
    { id: 'shadow', name: 'Shadow', type: 'shadow', svg: createShadowCube(), width: 130, height: 135 },
    { id: 'pyramid', name: 'Pyramid', type: 'pyramid', svg: createPyramidCubes(), width: 200, height: 160 },
    { id: 'orbit', name: 'Orbit', type: 'orbit', svg: createOrbitCube(), width: 140, height: 130 },
    { id: 'database', name: 'Database', type: 'database', svg: createDatabaseStack(), width: 120, height: 130 },
    { id: 'exploded', name: 'Exploded', type: 'exploded', svg: createExplodedCube(), width: 160, height: 150 }
  ];
}
