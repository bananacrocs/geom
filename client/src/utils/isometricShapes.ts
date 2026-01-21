/**
 * Forme e componenti tech per post Instagram
 * Stile minimalista Attio-like
 */

import type { ShapeConfig } from '../stores/isometricStore';

// Colori consistenti
const C = {
  stroke: '#c8c8c8',
  strokeLight: '#b0b0b0',
  fill: '#e8e8e8',
  fillLight: '#f4f4f4',
  white: '#ffffff',
  dot: '#c8c8c8'
};

const f = (n: number): string => Number(n.toFixed(2)).toString();

const svgOpen = (w: number, h: number): string =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;

const svgClose = '</svg>';

// ============ GEOMETRIC SHAPES ============

/** Esagono */
export function createHexagon(): string {
  const w = 80, h = 90;
  const cx = w / 2, cy = h / 2;
  const r = 32;
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }
  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Esagono tratteggiato */
export function createHexagonDashed(): string {
  const w = 80, h = 90;
  const cx = w / 2, cy = h / 2;
  const r = 32;
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }
  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4" stroke-linejoin="round"/>
${svgClose}`;
}

/** Triangolo */
export function createTriangle(): string {
  const w = 80, h = 80;
  const cx = w / 2;
  return `${svgOpen(w, h)}
  <polygon points="${cx},12 ${w - 12},${h - 12} 12,${h - 12}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Triangolo invertito */
export function createTriangleDown(): string {
  const w = 80, h = 80;
  const cx = w / 2;
  return `${svgOpen(w, h)}
  <polygon points="12,12 ${w - 12},12 ${cx},${h - 12}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Diamante / Rombo */
export function createDiamond(): string {
  const w = 70, h = 90;
  const cx = w / 2, cy = h / 2;
  return `${svgOpen(w, h)}
  <polygon points="${cx},10 ${w - 10},${cy} ${cx},${h - 10} 10,${cy}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Pentagono */
export function createPentagon(): string {
  const w = 80, h = 85;
  const cx = w / 2, cy = h / 2 + 3;
  const r = 32;
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }
  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Ottagono */
export function createOctagon(): string {
  const w = 80, h = 80;
  const cx = w / 2, cy = h / 2;
  const r = 32;
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i - Math.PI / 8;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }
  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Stella a 6 punte */
export function createStar6(): string {
  const w = 80, h = 90;
  const cx = w / 2, cy = h / 2;
  const outerR = 35, innerR = 18;
  const points: string[] = [];
  for (let i = 0; i < 12; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 6) * i - Math.PI / 2;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }
  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Stella a 5 punte */
export function createStar5(): string {
  const w = 80, h = 85;
  const cx = w / 2, cy = h / 2;
  const outerR = 35, innerR = 14;
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }
  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Croce / Plus */
export function createCross(): string {
  const w = 70, h = 70;
  const t = 14;
  const cx = w / 2, cy = h / 2;
  return `${svgOpen(w, h)}
  <path d="M${cx - t / 2},10 L${cx + t / 2},10 L${cx + t / 2},${cy - t / 2} L${w - 10},${cy - t / 2} L${w - 10},${cy + t / 2} L${cx + t / 2},${cy + t / 2} L${cx + t / 2},${h - 10} L${cx - t / 2},${h - 10} L${cx - t / 2},${cy + t / 2} L10,${cy + t / 2} L10,${cy - t / 2} L${cx - t / 2},${cy - t / 2} Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Cerchio */
export function createCircle(): string {
  const w = 70, h = 70;
  return `${svgOpen(w, h)}
  <circle cx="35" cy="35" r="28" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Cerchio tratteggiato */
export function createCircleDashed(): string {
  const w = 70, h = 70;
  return `${svgOpen(w, h)}
  <circle cx="35" cy="35" r="28" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4"/>
${svgClose}`;
}

/** Semicerchio */
export function createSemicircle(): string {
  const w = 80, h = 50;
  return `${svgOpen(w, h)}
  <path d="M10,40 A30,30 0 0,1 70,40" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="10" y1="40" x2="70" y2="40" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Parallelogramma */
export function createParallelogram(): string {
  const w = 100, h = 60;
  return `${svgOpen(w, h)}
  <polygon points="25,10 90,10 75,50 10,50" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Trapezio */
export function createTrapezoid(): string {
  const w = 100, h = 60;
  return `${svgOpen(w, h)}
  <polygon points="30,10 70,10 90,50 10,50" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Freccia destra */
export function createArrowRight(): string {
  const w = 100, h = 50;
  return `${svgOpen(w, h)}
  <polygon points="10,18 60,18 60,8 90,25 60,42 60,32 10,32" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Chevron */
export function createChevron(): string {
  const w = 70, h = 70;
  return `${svgOpen(w, h)}
  <path d="M20,15 L50,35 L20,55" fill="none" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

/** Doppio chevron */
export function createDoubleChevron(): string {
  const w = 80, h = 70;
  return `${svgOpen(w, h)}
  <path d="M15,15 L40,35 L15,55" fill="none" stroke="${C.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40,15 L65,35 L40,55" fill="none" stroke="${C.strokeLight}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

// ============ TECH ELEMENTS ============

/** Chip / Processore */
export function createChip(): string {
  const w = 100, h = 100;
  const size = 50;
  const cx = w / 2, cy = h / 2;
  const pinLen = 12;
  const pinW = 4;
  const pins = 4;

  let pinsPath = '';
  for (let i = 0; i < pins; i++) {
    const x = cx - size / 2 + 8 + i * 12;
    pinsPath += `<rect x="${f(x)}" y="${f(cy - size / 2 - pinLen)}" width="${pinW}" height="${pinLen}" fill="${C.stroke}" rx="1"/>`;
  }
  for (let i = 0; i < pins; i++) {
    const x = cx - size / 2 + 8 + i * 12;
    pinsPath += `<rect x="${f(x)}" y="${f(cy + size / 2)}" width="${pinW}" height="${pinLen}" fill="${C.stroke}" rx="1"/>`;
  }
  for (let i = 0; i < pins; i++) {
    const y = cy - size / 2 + 8 + i * 12;
    pinsPath += `<rect x="${f(cx - size / 2 - pinLen)}" y="${f(y)}" width="${pinLen}" height="${pinW}" fill="${C.stroke}" rx="1"/>`;
  }
  for (let i = 0; i < pins; i++) {
    const y = cy - size / 2 + 8 + i * 12;
    pinsPath += `<rect x="${f(cx + size / 2)}" y="${f(y)}" width="${pinLen}" height="${pinW}" fill="${C.stroke}" rx="1"/>`;
  }

  return `${svgOpen(w, h)}
  ${pinsPath}
  <rect x="${f(cx - size / 2)}" y="${f(cy - size / 2)}" width="${size}" height="${size}" rx="4" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <rect x="${f(cx - 12)}" y="${f(cy - 12)}" width="24" height="24" rx="2" fill="${C.white}" stroke="${C.stroke}" stroke-width="1"/>
${svgClose}`;
}

/** GPU - Graphics Processing Unit con dettagli realistici */
export function createGPU(): string {
  const w = 130, h = 100;

  // Pin PCI-E in basso
  let pins = '';
  for (let i = 0; i < 12; i++) {
    pins += `<rect x="${18 + i * 8}" y="82" width="4" height="10" fill="${C.stroke}" rx="0.5"/>`;
  }

  // Fan grilles
  let fanLines = '';
  for (let i = 0; i < 5; i++) {
    fanLines += `<line x1="22" y1="${38 + i * 8}" x2="48" y2="${38 + i * 8}" stroke="${C.strokeLight}" stroke-width="1.5"/>`;
    fanLines += `<line x1="72" y1="${38 + i * 8}" x2="98" y2="${38 + i * 8}" stroke="${C.strokeLight}" stroke-width="1.5"/>`;
  }

  return `${svgOpen(w, h)}
  <!-- Main PCB -->
  <rect x="10" y="15" width="110" height="67" rx="3" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Backplate -->
  <rect x="10" y="15" width="110" height="8" rx="3" fill="${C.strokeLight}" stroke="${C.stroke}" stroke-width="1"/>

  <!-- Fan areas -->
  <rect x="18" y="32" width="35" height="42" rx="4" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  <rect x="68" y="32" width="35" height="42" rx="4" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>

  <!-- Fan circles -->
  <circle cx="35.5" cy="53" r="16" fill="none" stroke="${C.stroke}" stroke-width="1"/>
  <circle cx="35.5" cy="53" r="4" fill="${C.stroke}"/>
  <circle cx="85.5" cy="53" r="16" fill="none" stroke="${C.stroke}" stroke-width="1"/>
  <circle cx="85.5" cy="53" r="4" fill="${C.stroke}"/>

  ${fanLines}

  <!-- Power connectors -->
  <rect x="108" y="28" width="8" height="16" rx="1" fill="${C.white}" stroke="${C.stroke}" stroke-width="1"/>
  <rect x="108" y="50" width="8" height="16" rx="1" fill="${C.white}" stroke="${C.stroke}" stroke-width="1"/>

  <!-- Video outputs -->
  <rect x="12" y="20" width="6" height="4" fill="${C.stroke}" rx="0.5"/>
  <rect x="20" y="20" width="6" height="4" fill="${C.stroke}" rx="0.5"/>
  <rect x="28" y="20" width="6" height="4" fill="${C.stroke}" rx="0.5"/>

  <!-- PCI-E slot -->
  <rect x="15" y="82" width="100" height="12" rx="2" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  ${pins}
${svgClose}`;
}

/** Server Rack */
export function createServerRack(): string {
  const w = 90, h = 110;
  const rackW = 60, slotH = 16;
  const cx = w / 2;
  const startY = 15;
  const slots = 5;

  let slotsPath = '';
  for (let i = 0; i < slots; i++) {
    const y = startY + i * (slotH + 4);
    slotsPath += `<rect x="${f(cx - rackW / 2)}" y="${y}" width="${rackW}" height="${slotH}" rx="2" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>`;
    slotsPath += `<circle cx="${f(cx - rackW / 2 + 8)}" cy="${f(y + slotH / 2)}" r="2.5" fill="${C.stroke}"/>`;
    slotsPath += `<circle cx="${f(cx - rackW / 2 + 16)}" cy="${f(y + slotH / 2)}" r="2.5" fill="${C.strokeLight}"/>`;
    slotsPath += `<line x1="${f(cx + 5)}" y1="${f(y + 5)}" x2="${f(cx + rackW / 2 - 8)}" y2="${f(y + 5)}" stroke="${C.strokeLight}" stroke-width="1"/>`;
    slotsPath += `<line x1="${f(cx + 5)}" y1="${f(y + slotH / 2)}" x2="${f(cx + rackW / 2 - 8)}" y2="${f(y + slotH / 2)}" stroke="${C.strokeLight}" stroke-width="1"/>`;
    slotsPath += `<line x1="${f(cx + 5)}" y1="${f(y + slotH - 5)}" x2="${f(cx + rackW / 2 - 8)}" y2="${f(y + slotH - 5)}" stroke="${C.strokeLight}" stroke-width="1"/>`;
  }

  return `${svgOpen(w, h)}
  ${slotsPath}
${svgClose}`;
}

/** Cloud */
export function createCloud(): string {
  const w = 100, h = 70;
  return `${svgOpen(w, h)}
  <path d="M25,50 a15,15 0 0,1 0,-25 a20,20 0 0,1 35,-10 a15,15 0 0,1 25,15 a12,12 0 0,1 0,20 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Cloud tratteggiato */
export function createCloudDashed(): string {
  const w = 100, h = 70;
  return `${svgOpen(w, h)}
  <path d="M25,50 a15,15 0 0,1 0,-25 a20,20 0 0,1 35,-10 a15,15 0 0,1 25,15 a12,12 0 0,1 0,20 Z" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4" stroke-linejoin="round"/>
${svgClose}`;
}

/** Cloud con freccia upload */
export function createCloudUpload(): string {
  const w = 100, h = 80;
  return `${svgOpen(w, h)}
  <path d="M25,50 a15,15 0 0,1 0,-25 a20,20 0 0,1 35,-10 a15,15 0 0,1 25,15 a12,12 0 0,1 0,20 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M50,55 L50,35 M40,42 L50,32 L60,42" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

/** Cloud con freccia download */
export function createCloudDownload(): string {
  const w = 100, h = 80;
  return `${svgOpen(w, h)}
  <path d="M25,50 a15,15 0 0,1 0,-25 a20,20 0 0,1 35,-10 a15,15 0 0,1 25,15 a12,12 0 0,1 0,20 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M50,32 L50,52 M40,45 L50,55 L60,45" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

/** Database cilindrico */
export function createDatabase(): string {
  const w = 80, h = 90;
  const cx = w / 2;
  const diskW = 30, diskH = 8;
  const bodyH = 50;
  const y = 15;

  return `${svgOpen(w, h)}
  <path d="M${cx - diskW},${y + diskH} L${cx - diskW},${y + bodyH} A${diskW},${diskH} 0 0,0 ${cx + diskW},${y + bodyH} L${cx + diskW},${y + diskH}" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <ellipse cx="${cx}" cy="${y + diskH}" rx="${diskW}" ry="${diskH}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <ellipse cx="${cx}" cy="${y + bodyH / 3 + diskH}" rx="${diskW}" ry="${diskH}" fill="none" stroke="${C.strokeLight}" stroke-width="1" stroke-dasharray="4 3"/>
  <ellipse cx="${cx}" cy="${y + bodyH * 2 / 3 + diskH}" rx="${diskW}" ry="${diskH}" fill="none" stroke="${C.strokeLight}" stroke-width="1" stroke-dasharray="4 3"/>
${svgClose}`;
}

/** API endpoint */
export function createApiEndpoint(): string {
  const w = 100, h = 50;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="80" height="30" rx="15" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="50" y="30" text-anchor="middle" font-family="monospace" font-size="11" fill="${C.stroke}">/api</text>
${svgClose}`;
}

/** REST endpoint GET */
export function createApiGet(): string {
  const w = 100, h = 50;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="80" height="30" rx="6" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="50" y="30" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="${C.stroke}">GET</text>
${svgClose}`;
}

/** REST endpoint POST */
export function createApiPost(): string {
  const w = 100, h = 50;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="80" height="30" rx="6" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="50" y="30" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="${C.stroke}">POST</text>
${svgClose}`;
}

/** Code brackets */
export function createCodeBrackets(): string {
  const w = 90, h = 70;
  return `${svgOpen(w, h)}
  <path d="M25,15 L15,35 L25,55" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M65,15 L75,35 L65,55" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="35" y1="50" x2="55" y2="20" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>
${svgClose}`;
}

/** Curly braces */
export function createCurlyBraces(): string {
  const w = 80, h = 80;
  return `${svgOpen(w, h)}
  <path d="M25,10 Q15,10 15,20 L15,32 Q15,40 8,40 Q15,40 15,48 L15,60 Q15,70 25,70" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>
  <path d="M55,10 Q65,10 65,20 L65,32 Q65,40 72,40 Q65,40 65,48 L65,60 Q65,70 55,70" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>
${svgClose}`;
}

/** Terminal */
export function createTerminal(): string {
  const w = 100, h = 80;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="80" height="60" rx="6" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <rect x="10" y="10" width="80" height="16" rx="6" fill="${C.strokeLight}"/>
  <rect x="10" y="20" width="80" height="6" fill="${C.strokeLight}"/>
  <circle cx="20" cy="18" r="3" fill="#ff6b6b"/>
  <circle cx="30" cy="18" r="3" fill="#ffd93d"/>
  <circle cx="40" cy="18" r="3" fill="#6bcb77"/>
  <text x="20" y="45" font-family="monospace" font-size="10" fill="${C.stroke}">$ _</text>
${svgClose}`;
}

/** Browser window */
export function createBrowser(): string {
  const w = 110, h = 80;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="90" height="60" rx="6" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
  <rect x="10" y="10" width="90" height="16" rx="6" fill="${C.fillLight}"/>
  <rect x="10" y="20" width="90" height="6" fill="${C.fillLight}"/>
  <circle cx="20" cy="18" r="3" fill="${C.stroke}"/>
  <circle cx="30" cy="18" r="3" fill="${C.stroke}"/>
  <circle cx="40" cy="18" r="3" fill="${C.stroke}"/>
  <rect x="50" y="14" width="40" height="8" rx="4" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="1"/>
${svgClose}`;
}

/** Mobile phone - Smartphone moderno con notch e app */
export function createMobile(): string {
  const w = 70, h = 120;

  // App grid
  let apps = '';
  const appColors = [C.stroke, C.strokeLight, C.stroke, C.strokeLight, C.stroke, C.strokeLight];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const idx = row * 2 + col;
      apps += `<rect x="${20 + col * 18}" y="${45 + row * 18}" width="12" height="12" rx="3" fill="${appColors[idx]}"/>`;
    }
  }

  return `${svgOpen(w, h)}
  <!-- Phone body -->
  <rect x="10" y="5" width="50" height="110" rx="10" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Screen -->
  <rect x="14" y="18" width="42" height="84" rx="4" fill="${C.fillLight}" stroke="${C.strokeLight}" stroke-width="0.5"/>

  <!-- Notch -->
  <rect x="24" y="18" width="22" height="8" rx="4" fill="${C.white}"/>
  <circle cx="35" cy="22" r="2" fill="${C.stroke}"/>

  <!-- Speaker -->
  <rect x="28" y="10" width="14" height="3" rx="1.5" fill="${C.strokeLight}"/>

  <!-- Status bar -->
  <rect x="16" y="28" width="8" height="4" rx="1" fill="${C.stroke}"/>
  <rect x="44" y="28" width="10" height="4" rx="1" fill="${C.stroke}"/>
  <text x="54" y="32" font-family="monospace" font-size="5" fill="${C.stroke}">100</text>

  <!-- App icons -->
  ${apps}

  <!-- Bottom bar / home indicator -->
  <rect x="25" y="98" width="20" height="4" rx="2" fill="${C.stroke}"/>

  <!-- Side buttons -->
  <rect x="60" y="35" width="2" height="15" rx="1" fill="${C.stroke}"/>
  <rect x="60" y="55" width="2" height="8" rx="1" fill="${C.stroke}"/>
  <rect x="8" y="40" width="2" height="12" rx="1" fill="${C.stroke}"/>
${svgClose}`;
}

/** Laptop - MacBook-style con dettagli realistici */
export function createLaptop(): string {
  const w = 130, h = 95;

  // Keyboard keys
  let keys = '';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      keys += `<rect x="${22 + col * 9}" y="${72 + row * 6}" width="7" height="4" rx="0.5" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="0.5"/>`;
    }
  }

  return `${svgOpen(w, h)}
  <!-- Screen housing -->
  <rect x="15" y="5" width="100" height="58" rx="5" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Screen bezel -->
  <rect x="19" y="9" width="92" height="50" rx="3" fill="${C.strokeLight}"/>

  <!-- Actual screen -->
  <rect x="22" y="12" width="86" height="44" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="0.5"/>

  <!-- Camera -->
  <circle cx="65" cy="7" r="1.5" fill="${C.stroke}"/>

  <!-- Screen content hint -->
  <rect x="28" y="18" width="35" height="4" rx="1" fill="${C.fillLight}"/>
  <rect x="28" y="25" width="50" height="3" rx="1" fill="${C.strokeLight}"/>
  <rect x="28" y="30" width="45" height="3" rx="1" fill="${C.strokeLight}"/>
  <rect x="28" y="35" width="30" height="3" rx="1" fill="${C.strokeLight}"/>

  <!-- Menu bar -->
  <rect x="22" y="12" width="86" height="5" fill="${C.fillLight}"/>
  <circle cx="26" cy="14.5" r="1.5" fill="${C.stroke}"/>

  <!-- Base / keyboard area -->
  <path d="M5,63 L15,63 L15,65 L115,65 L115,63 L125,63 L125,85 Q125,90 120,90 L10,90 Q5,90 5,85 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Keyboard -->
  ${keys}

  <!-- Trackpad -->
  <rect x="45" y="74" width="40" height="24" rx="3" fill="${C.white}" stroke="${C.stroke}" stroke-width="1"/>

  <!-- Hinge -->
  <rect x="15" y="60" width="100" height="5" fill="${C.strokeLight}" stroke="${C.stroke}" stroke-width="0.5"/>
${svgClose}`;
}

/** Network node */
export function createNetworkNode(): string {
  const w = 100, h = 100;
  const cx = w / 2, cy = h / 2;
  const r = 15;

  const satellites = [
    { x: cx, y: 15 },
    { x: 85, y: cy },
    { x: cx, y: 85 },
    { x: 15, y: cy },
  ];

  let lines = satellites.map(s =>
    `<line x1="${cx}" y1="${cy}" x2="${s.x}" y2="${s.y}" stroke="${C.strokeLight}" stroke-width="1.5" stroke-dasharray="4 3"/>`
  ).join('\n  ');

  let nodes = satellites.map(s =>
    `<circle cx="${s.x}" cy="${s.y}" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>`
  ).join('\n  ');

  return `${svgOpen(w, h)}
  ${lines}
  ${nodes}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Network mesh */
export function createNetworkMesh(): string {
  const w = 120, h = 100;
  const nodes = [
    { x: 20, y: 50 },
    { x: 50, y: 20 },
    { x: 100, y: 25 },
    { x: 70, y: 50 },
    { x: 35, y: 80 },
    { x: 90, y: 75 },
  ];

  let lines = '';
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2));
      if (dist < 60) {
        lines += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${C.strokeLight}" stroke-width="1"/>`;
      }
    }
  }

  let circles = nodes.map(n =>
    `<circle cx="${n.x}" cy="${n.y}" r="6" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>`
  ).join('\n  ');

  return `${svgOpen(w, h)}
  ${lines}
  ${circles}
${svgClose}`;
}

/** WiFi signal - Router con antenne e onde */
export function createWifi(): string {
  const w = 100, h = 90;
  const cx = 50;

  return `${svgOpen(w, h)}
  <!-- Router base -->
  <rect x="20" y="55" width="60" height="25" rx="4" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Router details -->
  <rect x="25" y="60" width="20" height="3" rx="1" fill="${C.stroke}"/>
  <circle cx="70" cy="67" r="3" fill="${C.stroke}"/>
  <circle cx="60" cy="67" r="2" fill="${C.strokeLight}"/>

  <!-- Vent lines -->
  <line x1="28" y1="70" x2="42" y2="70" stroke="${C.strokeLight}" stroke-width="1"/>
  <line x1="28" y1="73" x2="42" y2="73" stroke="${C.strokeLight}" stroke-width="1"/>

  <!-- Antenna left -->
  <rect x="28" y="35" width="4" height="20" rx="2" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1"/>
  <circle cx="30" cy="33" r="3" fill="${C.stroke}"/>

  <!-- Antenna right -->
  <rect x="68" y="35" width="4" height="20" rx="2" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1"/>
  <circle cx="70" cy="33" r="3" fill="${C.stroke}"/>

  <!-- WiFi waves -->
  <path d="M${cx - 25},28 Q${cx},8 ${cx + 25},28" fill="none" stroke="${C.strokeLight}" stroke-width="2" stroke-linecap="round"/>
  <path d="M${cx - 18},22 Q${cx},8 ${cx + 18},22" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>
  <path d="M${cx - 10},16 Q${cx},8 ${cx + 10},16" fill="none" stroke="${C.stroke}" stroke-width="2.5" stroke-linecap="round"/>
${svgClose}`;
}

/** Bluetooth - Modulo BT con antenna e onde */
export function createBluetooth(): string {
  const w = 90, h = 90;

  return `${svgOpen(w, h)}
  <!-- Module board -->
  <rect x="25" y="25" width="40" height="55" rx="4" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Chip -->
  <rect x="32" y="45" width="26" height="20" rx="2" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1"/>
  <rect x="38" y="50" width="14" height="10" rx="1" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="0.5"/>

  <!-- SMD components -->
  <rect x="30" y="32" width="8" height="4" rx="0.5" fill="${C.stroke}"/>
  <rect x="42" y="32" width="8" height="4" rx="0.5" fill="${C.stroke}"/>
  <rect x="54" y="32" width="4" height="4" rx="0.5" fill="${C.strokeLight}"/>

  <!-- Antenna trace -->
  <path d="M45,25 L45,15 L55,15" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>

  <!-- Bluetooth symbol -->
  <path d="M45,50 L45,60 L52,55 L40,47 L52,40 L45,35" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40,58 L52,50" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Radio waves -->
  <path d="M62,40 Q70,45 62,55" fill="none" stroke="${C.strokeLight}" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M68,35 Q80,45 68,60" fill="none" stroke="${C.strokeLight}" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Connection pins -->
  <rect x="30" y="80" width="4" height="6" fill="${C.stroke}"/>
  <rect x="38" y="80" width="4" height="6" fill="${C.stroke}"/>
  <rect x="46" y="80" width="4" height="6" fill="${C.stroke}"/>
  <rect x="54" y="80" width="4" height="6" fill="${C.stroke}"/>
${svgClose}`;
}

/** USB - Connettore USB Type-A dettagliato */
export function createUSB(): string {
  const w = 70, h = 100;

  // Internal pins
  let pins = '';
  for (let i = 0; i < 4; i++) {
    pins += `<rect x="${23 + i * 6}" y="25" width="3" height="18" fill="${i < 2 ? C.stroke : C.strokeLight}" rx="0.5"/>`;
  }

  return `${svgOpen(w, h)}
  <!-- Metal shell outer -->
  <rect x="15" y="8" width="40" height="50" rx="3" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Metal shell inner -->
  <rect x="19" y="12" width="32" height="42" rx="2" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="1"/>

  <!-- White plastic insert -->
  <rect x="21" y="18" width="28" height="32" rx="1" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>

  <!-- Pins -->
  ${pins}

  <!-- Cable -->
  <path d="M35,58 L35,70 Q35,75 32,78 L28,82 Q25,85 25,90" fill="none" stroke="${C.stroke}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="25" cy="92" r="3" fill="${C.stroke}"/>

  <!-- USB logo hint -->
  <circle cx="35" cy="5" r="2" fill="${C.stroke}"/>
  <line x1="35" y1="5" x2="35" y2="0" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="30" y1="3" x2="35" y2="5" stroke="${C.stroke}" stroke-width="1"/>
  <line x1="40" y1="3" x2="35" y2="5" stroke="${C.stroke}" stroke-width="1"/>
${svgClose}`;
}

/** Lightning bolt - Fast charging con effetto energia */
export function createLightning(): string {
  const w = 80, h = 100;

  return `${svgOpen(w, h)}
  <!-- Outer glow effect (cerchi concentrici) -->
  <circle cx="40" cy="50" r="38" fill="none" stroke="${C.strokeLight}" stroke-width="0.5" stroke-dasharray="3 4"/>
  <circle cx="40" cy="50" r="32" fill="none" stroke="${C.strokeLight}" stroke-width="0.5" stroke-dasharray="3 4"/>

  <!-- Lightning bolt main -->
  <polygon points="45,8 20,48 34,48 26,92 60,42 44,42 52,8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>

  <!-- Inner highlight -->
  <polygon points="42,20 30,45 38,45 34,70 50,45 42,45 46,20" fill="${C.white}" stroke="none"/>

  <!-- Spark effects -->
  <line x1="62" y1="30" x2="70" y2="25" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="65" y1="40" x2="72" y2="42" stroke="${C.strokeLight}" stroke-width="1" stroke-linecap="round"/>
  <line x1="10" y1="55" x2="18" y2="52" stroke="${C.strokeLight}" stroke-width="1" stroke-linecap="round"/>
  <line x1="12" y1="65" x2="8" y2="70" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Energy dots -->
  <circle cx="68" cy="55" r="2" fill="${C.stroke}"/>
  <circle cx="14" y="38" r="1.5" fill="${C.strokeLight}"/>
${svgClose}`;
}

/** Battery - Batteria dettagliata con segmenti */
export function createBattery(): string {
  const w = 100, h = 55;

  // Charge level segments
  let segments = '';
  for (let i = 0; i < 4; i++) {
    const filled = i < 3;
    segments += `<rect x="${18 + i * 16}" y="20" width="12" height="16" rx="1.5" fill="${filled ? C.stroke : C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>`;
  }

  return `${svgOpen(w, h)}
  <!-- Battery body -->
  <rect x="10" y="14" width="72" height="28" rx="5" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Battery terminal -->
  <rect x="82" y="22" width="8" height="12" rx="2" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <rect x="86" y="25" width="4" height="6" fill="${C.stroke}"/>

  <!-- Charge segments -->
  ${segments}

  <!-- Percentage indicator -->
  <text x="46" y="44" text-anchor="middle" font-family="monospace" font-size="8" fill="${C.stroke}">75%</text>
${svgClose}`;
}

/** Lock - Lucchetto di sicurezza dettagliato */
export function createLock(): string {
  const w = 75, h = 100;

  return `${svgOpen(w, h)}
  <!-- Shackle (arco) -->
  <path d="M22,42 L22,28 Q22,8 37.5,8 Q53,8 53,28 L53,42" fill="none" stroke="${C.stroke}" stroke-width="5" stroke-linecap="round"/>

  <!-- Shackle inner -->
  <path d="M27,42 L27,30 Q27,15 37.5,15 Q48,15 48,30 L48,42" fill="none" stroke="${C.fillLight}" stroke-width="3"/>

  <!-- Lock body -->
  <rect x="12" y="40" width="51" height="50" rx="6" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Lock body detail layer -->
  <rect x="16" y="44" width="43" height="42" rx="4" fill="${C.fill}" stroke="${C.strokeLight}" stroke-width="0.5"/>

  <!-- Keyhole plate -->
  <circle cx="37.5" cy="62" r="10" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Keyhole -->
  <circle cx="37.5" cy="59" r="4" fill="${C.stroke}"/>
  <rect x="35" y="59" width="5" height="10" fill="${C.stroke}"/>

  <!-- Screws -->
  <circle cx="20" cy="48" r="2" fill="${C.stroke}"/>
  <circle cx="55" cy="48" r="2" fill="${C.stroke}"/>
  <circle cx="20" cy="82" r="2" fill="${C.stroke}"/>
  <circle cx="55" cy="82" r="2" fill="${C.stroke}"/>

  <!-- Brand line -->
  <rect x="25" y="78" width="25" height="2" rx="1" fill="${C.strokeLight}"/>
${svgClose}`;
}

/** Unlock - Lucchetto aperto */
export function createUnlock(): string {
  const w = 80, h = 100;

  return `${svgOpen(w, h)}
  <!-- Shackle aperto -->
  <path d="M22,32 L22,28 Q22,8 37.5,8 Q53,8 53,28 L53,15" fill="none" stroke="${C.stroke}" stroke-width="5" stroke-linecap="round"/>
  <path d="M27,32 L27,30 Q27,15 37.5,15 Q48,15 48,30 L48,20" fill="none" stroke="${C.fillLight}" stroke-width="3"/>

  <!-- Lock body -->
  <rect x="12" y="40" width="51" height="50" rx="6" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <rect x="16" y="44" width="43" height="42" rx="4" fill="${C.fill}" stroke="${C.strokeLight}" stroke-width="0.5"/>

  <!-- Keyhole plate -->
  <circle cx="37.5" cy="62" r="10" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Keyhole con chiave inserita -->
  <circle cx="37.5" cy="59" r="4" fill="${C.stroke}"/>
  <rect x="35" y="59" width="5" height="10" fill="${C.stroke}"/>

  <!-- Key -->
  <rect x="42" y="56" width="25" height="6" rx="1" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  <circle cx="64" cy="59" r="6" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  <circle cx="64" cy="59" r="2" fill="${C.stroke}"/>

  <!-- Screws -->
  <circle cx="20" cy="48" r="2" fill="${C.stroke}"/>
  <circle cx="55" cy="48" r="2" fill="${C.stroke}"/>
${svgClose}`;
}

/** Shield - Scudo di sicurezza con badge interno */
export function createShield(): string {
  const w = 85, h = 100;

  return `${svgOpen(w, h)}
  <!-- Outer shield glow -->
  <path d="M42.5,5 L75,18 L75,48 Q75,78 42.5,95 Q10,78 10,48 L10,18 Z" fill="none" stroke="${C.strokeLight}" stroke-width="1" stroke-dasharray="4 3"/>

  <!-- Main shield -->
  <path d="M42.5,10 L70,22 L70,48 Q70,73 42.5,88 Q15,73 15,48 L15,22 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>

  <!-- Inner shield layer -->
  <path d="M42.5,18 L62,28 L62,48 Q62,67 42.5,78 Q23,67 23,48 L23,28 Z" fill="${C.fill}" stroke="${C.strokeLight}" stroke-width="1"/>

  <!-- Checkmark circle -->
  <circle cx="42.5" cy="50" r="18" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Checkmark -->
  <path d="M32,50 L40,58 L55,40" fill="none" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Top decoration -->
  <circle cx="42.5" cy="15" r="3" fill="${C.stroke}"/>

  <!-- Side rivets -->
  <circle cx="22" cy="35" r="2" fill="${C.stroke}"/>
  <circle cx="63" cy="35" r="2" fill="${C.stroke}"/>
${svgClose}`;
}

/** Key - Chiave moderna con dettagli */
export function createKey(): string {
  const w = 110, h = 65;

  return `${svgOpen(w, h)}
  <!-- Key head (bow) -->
  <circle cx="28" cy="32.5" r="22" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="28" cy="32.5" r="15" fill="${C.fill}" stroke="${C.strokeLight}" stroke-width="1"/>
  <circle cx="28" cy="32.5" r="7" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Decorative holes in bow -->
  <circle cx="20" cy="22" r="3" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="0.5"/>
  <circle cx="36" cy="22" r="3" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="0.5"/>
  <circle cx="20" cy="43" r="3" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="0.5"/>
  <circle cx="36" cy="43" r="3" fill="${C.white}" stroke="${C.strokeLight}" stroke-width="0.5"/>

  <!-- Key blade (shaft) -->
  <rect x="50" y="28" width="50" height="9" rx="1" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Key cuts (bitting) -->
  <rect x="60" y="37" width="6" height="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  <rect x="70" y="37" width="4" height="12" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  <rect x="78" y="37" width="6" height="6" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  <rect x="88" y="37" width="4" height="10" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>

  <!-- Key tip -->
  <polygon points="100,28 105,32.5 100,37" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>

  <!-- Groove on blade -->
  <line x1="52" y1="32.5" x2="98" y2="32.5" stroke="${C.strokeLight}" stroke-width="1.5"/>
${svgClose}`;
}

/** Gear / Settings */
export function createGear(): string {
  const w = 80, h = 80;
  const cx = 40, cy = 40;
  const outer = 30, inner = 22, teeth = 8;
  const points: string[] = [];

  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / teeth) * i - Math.PI / 2;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }

  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="${cx}" cy="${cy}" r="10" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Double gear */
export function createDoubleGear(): string {
  const w = 100, h = 80;

  const makeGear = (cx: number, cy: number, outer: number, inner: number, teeth: number) => {
    const points: string[] = [];
    for (let i = 0; i < teeth * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (Math.PI / teeth) * i - Math.PI / 2;
      points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
    }
    return points.join(' ');
  };

  return `${svgOpen(w, h)}
  <polygon points="${makeGear(35, 35, 25, 18, 8)}" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="35" cy="35" r="8" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
  <polygon points="${makeGear(70, 50, 20, 14, 6)}" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="70" cy="50" r="6" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Cube 3D simple */
export function createCube3D(): string {
  const w = 80, h = 90;
  const cx = 40, cy = 45;
  const s = 25;
  const cos30 = Math.sqrt(3) / 2;
  const sin30 = 0.5;

  return `${svgOpen(w, h)}
  <path d="M${cx},${cy - s} L${f(cx + s * cos30)},${f(cy - s * sin30)} L${f(cx + s * cos30)},${f(cy + s * sin30)} L${cx},${cy + s} L${f(cx - s * cos30)},${f(cy + s * sin30)} L${f(cx - s * cos30)},${f(cy - s * sin30)} Z" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="${cx}" y1="${cy - s}" x2="${cx}" y2="${cy}" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="${f(cx + s * cos30)}" y1="${f(cy + s * sin30)}" x2="${cx}" y2="${cy}" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="${f(cx - s * cos30)}" y1="${f(cy + s * sin30)}" x2="${cx}" y2="${cy}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Folder */
export function createFolder(): string {
  const w = 90, h = 70;
  return `${svgOpen(w, h)}
  <path d="M10,20 L10,58 Q10,62 14,62 L76,62 Q80,62 80,58 L80,25 Q80,21 76,21 L42,21 L36,14 L14,14 Q10,14 10,18 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** File document */
export function createFileDoc(): string {
  const w = 70, h = 90;
  return `${svgOpen(w, h)}
  <path d="M15,10 L45,10 L55,22 L55,80 L15,80 Z" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M45,10 L45,22 L55,22" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="22" y1="40" x2="48" y2="40" stroke="${C.strokeLight}" stroke-width="2"/>
  <line x1="22" y1="50" x2="48" y2="50" stroke="${C.strokeLight}" stroke-width="2"/>
  <line x1="22" y1="60" x2="38" y2="60" stroke="${C.strokeLight}" stroke-width="2"/>
${svgClose}`;
}

/** File code */
export function createFileCode(): string {
  const w = 70, h = 90;
  return `${svgOpen(w, h)}
  <path d="M15,10 L45,10 L55,22 L55,80 L15,80 Z" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M45,10 L45,22 L55,22" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M28,45 L22,52 L28,59" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M42,45 L48,52 L42,59" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

/** Git branch */
export function createGitBranch(): string {
  const w = 80, h = 80;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="20" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="55" cy="30" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="25" cy="60" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="25" y1="28" x2="25" y2="52" stroke="${C.stroke}" stroke-width="2"/>
  <path d="M25,35 Q25,30 35,30 L47,30" fill="none" stroke="${C.stroke}" stroke-width="2"/>
${svgClose}`;
}

/** Git merge */
export function createGitMerge(): string {
  const w = 80, h = 80;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="20" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="55" cy="20" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="40" cy="60" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <path d="M25,28 Q25,45 40,52" fill="none" stroke="${C.stroke}" stroke-width="2"/>
  <path d="M55,28 Q55,45 40,52" fill="none" stroke="${C.stroke}" stroke-width="2"/>
${svgClose}`;
}

/** QR code style */
export function createQRCode(): string {
  const w = 80, h = 80;
  const grid = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [1, 1, 1, 0, 1, 1, 1],
  ];

  let rects = '';
  const cellSize = 9;
  const startX = 8, startY = 8;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col]) {
        rects += `<rect x="${startX + col * cellSize}" y="${startY + row * cellSize}" width="${cellSize - 1}" height="${cellSize - 1}" fill="${C.stroke}"/>`;
      }
    }
  }

  return `${svgOpen(w, h)}
  ${rects}
${svgClose}`;
}

/** Hashtag */
export function createHashtag(): string {
  const w = 70, h = 70;
  return `${svgOpen(w, h)}
  <line x1="22" y1="15" x2="18" y2="55" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
  <line x1="42" y1="15" x2="38" y2="55" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
  <line x1="12" y1="28" x2="52" y2="28" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
  <line x1="10" y1="42" x2="50" y2="42" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
${svgClose}`;
}

/** At symbol @ */
export function createAtSymbol(): string {
  const w = 80, h = 80;
  return `${svgOpen(w, h)}
  <circle cx="40" cy="40" r="28" fill="none" stroke="${C.stroke}" stroke-width="2"/>
  <circle cx="40" cy="40" r="12" fill="none" stroke="${C.stroke}" stroke-width="2"/>
  <path d="M52,40 L52,50 Q52,58 60,54" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>
${svgClose}`;
}

// ============ UI ELEMENTS ============

/** Toggle switch ON */
export function createToggleOn(): string {
  const w = 70, h = 40;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="50" height="20" rx="10" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="45" cy="20" r="8" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Toggle switch OFF */
export function createToggleOff(): string {
  const w = 70, h = 40;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="50" height="20" rx="10" fill="none" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="25" cy="20" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Checkbox checked */
export function createCheckbox(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="30" height="30" rx="6" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <path d="M17,25 L22,30 L33,19" fill="none" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

/** Checkbox unchecked */
export function createCheckboxEmpty(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="30" height="30" rx="6" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Radio button selected */
export function createRadioButton(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="25" r="15" fill="none" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="7" fill="${C.stroke}"/>
${svgClose}`;
}

/** Radio button empty */
export function createRadioEmpty(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="25" r="15" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Slider */
export function createSlider(): string {
  const w = 120, h = 40;
  const y = h / 2;
  return `${svgOpen(w, h)}
  <line x1="15" y1="${y}" x2="${w - 15}" y2="${y}" stroke="${C.strokeLight}" stroke-width="4" stroke-linecap="round"/>
  <line x1="15" y1="${y}" x2="60" y2="${y}" stroke="${C.stroke}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="60" cy="${y}" r="8" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Progress bar */
export function createProgressBar(): string {
  const w = 120, h = 30;
  const y = h / 2;
  const barH = 8;
  return `${svgOpen(w, h)}
  <rect x="10" y="${y - barH / 2}" width="${w - 20}" height="${barH}" rx="4" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1"/>
  <rect x="10" y="${y - barH / 2}" width="65" height="${barH}" rx="4" fill="${C.stroke}"/>
${svgClose}`;
}

/** Progress circle */
export function createProgressCircle(): string {
  const w = 70, h = 70;
  const cx = 35, cy = 35, r = 25;
  const circumference = 2 * Math.PI * r;
  const progress = 0.7;
  return `${svgOpen(w, h)}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.fillLight}" stroke-width="5"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.stroke}" stroke-width="5"
    stroke-dasharray="${f(circumference * progress)} ${f(circumference * (1 - progress))}"
    stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
  <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="600" fill="${C.stroke}">70%</text>
${svgClose}`;
}

/** Button */
export function createButton(): string {
  const w = 100, h = 45;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="80" height="25" rx="6" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="50" y="27" text-anchor="middle" font-family="sans-serif" font-size="11" fill="${C.stroke}">Button</text>
${svgClose}`;
}

/** Button primary */
export function createButtonPrimary(): string {
  const w = 100, h = 45;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="80" height="25" rx="6" fill="${C.stroke}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="50" y="27" text-anchor="middle" font-family="sans-serif" font-size="11" fill="${C.white}">Submit</text>
${svgClose}`;
}

/** Input field */
export function createInputField(): string {
  const w = 120, h = 45;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="100" height="25" rx="4" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="18" y1="17" x2="18" y2="28" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="25" y="27" font-family="sans-serif" font-size="10" fill="${C.strokeLight}">Type here...</text>
${svgClose}`;
}

/** Search input */
export function createSearchInput(): string {
  const w = 130, h = 45;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="110" height="25" rx="12" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="28" cy="22" r="6" fill="none" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="32" y1="26" x2="38" y2="32" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round"/>
  <text x="45" y="27" font-family="sans-serif" font-size="10" fill="${C.strokeLight}">Search...</text>
${svgClose}`;
}

/** Dropdown */
export function createDropdown(): string {
  const w = 120, h = 45;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="100" height="25" rx="4" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="20" y="27" font-family="sans-serif" font-size="10" fill="${C.stroke}">Select...</text>
  <path d="M95,18 L100,25 L105,18" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

/** Card */
export function createCard(): string {
  const w = 100, h = 120;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="80" height="100" rx="8" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
  <rect x="10" y="10" width="80" height="45" rx="8" fill="${C.fillLight}"/>
  <rect x="10" y="47" width="80" height="8" fill="${C.fillLight}"/>
  <line x1="20" y1="70" x2="70" y2="70" stroke="${C.strokeLight}" stroke-width="2"/>
  <line x1="20" y1="82" x2="60" y2="82" stroke="${C.strokeLight}" stroke-width="2"/>
  <line x1="20" y1="94" x2="50" y2="94" stroke="${C.strokeLight}" stroke-width="2"/>
${svgClose}`;
}

/** Avatar */
export function createAvatar(): string {
  const w = 60, h = 60;
  return `${svgOpen(w, h)}
  <circle cx="30" cy="30" r="25" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="30" cy="24" r="9" fill="${C.white}" stroke="${C.stroke}" stroke-width="1"/>
  <path d="M15,50 Q15,38 30,38 Q45,38 45,50" fill="${C.white}" stroke="${C.stroke}" stroke-width="1"/>
${svgClose}`;
}

/** Avatar group */
export function createAvatarGroup(): string {
  const w = 100, h = 50;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="25" r="18" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="50" cy="25" r="18" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="75" cy="25" r="18" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="75" y="30" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="${C.stroke}">+3</text>
${svgClose}`;
}

/** Notification bell */
export function createBell(): string {
  const w = 60, h = 70;
  return `${svgOpen(w, h)}
  <path d="M30,12 Q30,8 30,8 Q30,8 30,8 L30,8" fill="none" stroke="${C.stroke}" stroke-width="2"/>
  <path d="M18,28 Q18,18 30,18 Q42,18 42,28 L44,45 L16,45 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="14" y1="45" x2="46" y2="45" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>
  <path d="M24,45 Q24,55 30,55 Q36,55 36,45" fill="none" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="42" cy="18" r="6" fill="${C.stroke}"/>
${svgClose}`;
}

/** Menu hamburger */
export function createMenuHamburger(): string {
  const w = 60, h = 50;
  return `${svgOpen(w, h)}
  <line x1="12" y1="15" x2="48" y2="15" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
  <line x1="12" y1="25" x2="48" y2="25" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
  <line x1="12" y1="35" x2="48" y2="35" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
${svgClose}`;
}

/** Menu dots */
export function createMenuDots(): string {
  const w = 40, h = 60;
  return `${svgOpen(w, h)}
  <circle cx="20" cy="15" r="4" fill="${C.stroke}"/>
  <circle cx="20" cy="30" r="4" fill="${C.stroke}"/>
  <circle cx="20" cy="45" r="4" fill="${C.stroke}"/>
${svgClose}`;
}

/** Close X */
export function createCloseX(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <line x1="15" y1="15" x2="35" y2="35" stroke="${C.stroke}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="35" y1="15" x2="15" y2="35" stroke="${C.stroke}" stroke-width="2.5" stroke-linecap="round"/>
${svgClose}`;
}

/** Plus */
export function createPlus(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <line x1="25" y1="12" x2="25" y2="38" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
  <line x1="12" y1="25" x2="38" y2="25" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
${svgClose}`;
}

/** Minus */
export function createMinus(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <line x1="12" y1="25" x2="38" y2="25" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
${svgClose}`;
}

// ============ BADGES & INDICATORS ============

/** Badge notifica */
export function createBadgeNotification(): string {
  const w = 60, h = 60;
  return `${svgOpen(w, h)}
  <circle cx="30" cy="30" r="20" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="30" y="35" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="600" fill="${C.stroke}">3</text>
${svgClose}`;
}

/** Badge numero grande */
export function createBadgeLarge(): string {
  const w = 70, h = 70;
  return `${svgOpen(w, h)}
  <circle cx="35" cy="35" r="28" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="35" y="42" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="600" fill="${C.stroke}">99</text>
${svgClose}`;
}

/** Badge pill */
export function createBadgePill(): string {
  const w = 80, h = 40;
  return `${svgOpen(w, h)}
  <rect x="10" y="10" width="60" height="20" rx="10" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="40" y="24" text-anchor="middle" font-family="sans-serif" font-size="10" fill="${C.stroke}">NEW</text>
${svgClose}`;
}

/** Badge beta */
export function createBadgeBeta(): string {
  const w = 70, h = 35;
  return `${svgOpen(w, h)}
  <rect x="10" y="8" width="50" height="20" rx="4" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5"/>
  <text x="35" y="22" text-anchor="middle" font-family="monospace" font-size="10" font-weight="600" fill="${C.stroke}">BETA</text>
${svgClose}`;
}

/** Badge pro */
export function createBadgePro(): string {
  const w = 60, h = 35;
  return `${svgOpen(w, h)}
  <rect x="10" y="8" width="40" height="20" rx="4" fill="${C.stroke}"/>
  <text x="30" y="22" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="${C.white}">PRO</text>
${svgClose}`;
}

/** Status dot online */
export function createStatusOnline(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="25" r="12" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="5" fill="#6bcb77"/>
${svgClose}`;
}

/** Status dot offline */
export function createStatusOffline(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="25" r="12" fill="none" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="4 3"/>
  <circle cx="25" cy="25" r="5" fill="${C.strokeLight}"/>
${svgClose}`;
}

/** Status busy */
export function createStatusBusy(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="25" r="12" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="5" fill="#ff6b6b"/>
${svgClose}`;
}

/** Status away */
export function createStatusAway(): string {
  const w = 50, h = 50;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="25" r="12" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="5" fill="#ffd93d"/>
${svgClose}`;
}

/** Tag label */
export function createTagLabel(): string {
  const w = 90, h = 40;
  return `${svgOpen(w, h)}
  <path d="M15,12 L70,12 L80,20 L70,28 L15,28 Q10,20 15,12" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="20" cy="20" r="3" fill="${C.stroke}"/>
${svgClose}`;
}

/** Cerchi concentrici (target) */
export function createTarget(): string {
  const w = 80, h = 80;
  const cx = w / 2, cy = h / 2;
  return `${svgOpen(w, h)}
  <circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="${C.strokeLight}" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="${C.strokeLight}" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="3" fill="${C.stroke}"/>
${svgClose}`;
}

/** Pulse / Loading indicator */
export function createPulse(): string {
  const w = 80, h = 80;
  const cx = w / 2, cy = h / 2;
  return `${svgOpen(w, h)}
  <circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="${C.strokeLight}" stroke-width="1" stroke-dasharray="4 3"/>
  <circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="8" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Spinner */
export function createSpinner(): string {
  const w = 60, h = 60;
  const cx = 30, cy = 30, r = 20;
  return `${svgOpen(w, h)}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.fillLight}" stroke-width="4"/>
  <path d="M${cx},${cy - r} A${r},${r} 0 0,1 ${cx + r},${cy}" fill="none" stroke="${C.stroke}" stroke-width="4" stroke-linecap="round"/>
${svgClose}`;
}

/** Checkmark */
export function createCheckmark(): string {
  const w = 60, h = 60;
  return `${svgOpen(w, h)}
  <circle cx="30" cy="30" r="22" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <path d="M18,30 L26,38 L42,22" fill="none" stroke="${C.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
${svgClose}`;
}

/** Error X */
export function createErrorX(): string {
  const w = 60, h = 60;
  return `${svgOpen(w, h)}
  <circle cx="30" cy="30" r="22" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="22" y1="22" x2="38" y2="38" stroke="${C.stroke}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="38" y1="22" x2="22" y2="38" stroke="${C.stroke}" stroke-width="2.5" stroke-linecap="round"/>
${svgClose}`;
}

/** Warning triangle */
export function createWarning(): string {
  const w = 70, h = 65;
  return `${svgOpen(w, h)}
  <polygon points="35,8 65,55 5,55" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="35" y1="25" x2="35" y2="38" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="35" cy="46" r="3" fill="${C.stroke}"/>
${svgClose}`;
}

/** Info circle */
export function createInfo(): string {
  const w = 60, h = 60;
  return `${svgOpen(w, h)}
  <circle cx="30" cy="30" r="22" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="30" cy="22" r="3" fill="${C.stroke}"/>
  <line x1="30" y1="30" x2="30" y2="42" stroke="${C.stroke}" stroke-width="3" stroke-linecap="round"/>
${svgClose}`;
}

/** Heart */
export function createHeart(): string {
  const w = 70, h = 65;
  return `${svgOpen(w, h)}
  <path d="M35,55 Q10,35 10,22 Q10,8 22,8 Q30,8 35,18 Q40,8 48,8 Q60,8 60,22 Q60,35 35,55 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Star filled */
export function createStarFilled(): string {
  const w = 70, h = 70;
  const cx = 35, cy = 35;
  const outerR = 28, innerR = 12;
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${f(cx + r * Math.cos(angle))},${f(cy + r * Math.sin(angle))}`);
  }
  return `${svgOpen(w, h)}
  <polygon points="${points.join(' ')}" fill="${C.fill}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Bookmark */
export function createBookmark(): string {
  const w = 50, h = 70;
  return `${svgOpen(w, h)}
  <path d="M10,8 L40,8 L40,62 L25,48 L10,62 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
${svgClose}`;
}

/** Pin */
export function createPin(): string {
  const w = 50, h = 70;
  return `${svgOpen(w, h)}
  <circle cx="25" cy="22" r="14" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="25" cy="22" r="5" fill="${C.white}" stroke="${C.stroke}" stroke-width="1"/>
  <path d="M25,36 L25,60" stroke="${C.stroke}" stroke-width="2" stroke-linecap="round"/>
${svgClose}`;
}

/** Location marker */
export function createLocation(): string {
  const w = 55, h = 70;
  return `${svgOpen(w, h)}
  <path d="M27,60 Q5,35 5,25 Q5,8 27,8 Q50,8 50,25 Q50,35 27,60 Z" fill="${C.fillLight}" stroke="${C.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="27" cy="25" r="8" fill="${C.white}" stroke="${C.stroke}" stroke-width="1.5"/>
${svgClose}`;
}

/** Genera tutte le forme */
export function generateAllShapes(): ShapeConfig[] {
  return [
    // Geometric
    { id: 'hexagon', name: 'Hexagon', category: 'geometric', svg: createHexagon(), width: 80, height: 90 },
    { id: 'hexagon-dashed', name: 'Hex Dashed', category: 'geometric', svg: createHexagonDashed(), width: 80, height: 90 },
    { id: 'triangle', name: 'Triangle', category: 'geometric', svg: createTriangle(), width: 80, height: 80 },
    { id: 'triangle-down', name: 'Tri Down', category: 'geometric', svg: createTriangleDown(), width: 80, height: 80 },
    { id: 'diamond', name: 'Diamond', category: 'geometric', svg: createDiamond(), width: 70, height: 90 },
    { id: 'pentagon', name: 'Pentagon', category: 'geometric', svg: createPentagon(), width: 80, height: 85 },
    { id: 'octagon', name: 'Octagon', category: 'geometric', svg: createOctagon(), width: 80, height: 80 },
    { id: 'star6', name: 'Star 6', category: 'geometric', svg: createStar6(), width: 80, height: 90 },
    { id: 'star5', name: 'Star 5', category: 'geometric', svg: createStar5(), width: 80, height: 85 },
    { id: 'cross', name: 'Cross', category: 'geometric', svg: createCross(), width: 70, height: 70 },
    { id: 'circle', name: 'Circle', category: 'geometric', svg: createCircle(), width: 70, height: 70 },
    { id: 'circle-dashed', name: 'Circle Dash', category: 'geometric', svg: createCircleDashed(), width: 70, height: 70 },
    { id: 'semicircle', name: 'Semicircle', category: 'geometric', svg: createSemicircle(), width: 80, height: 50 },
    { id: 'parallelogram', name: 'Parallel', category: 'geometric', svg: createParallelogram(), width: 100, height: 60 },
    { id: 'trapezoid', name: 'Trapezoid', category: 'geometric', svg: createTrapezoid(), width: 100, height: 60 },
    { id: 'arrow-right', name: 'Arrow', category: 'geometric', svg: createArrowRight(), width: 100, height: 50 },
    { id: 'chevron', name: 'Chevron', category: 'geometric', svg: createChevron(), width: 70, height: 70 },
    { id: 'double-chevron', name: 'Chevrons', category: 'geometric', svg: createDoubleChevron(), width: 80, height: 70 },

    // Tech
    { id: 'chip', name: 'Chip', category: 'tech', svg: createChip(), width: 100, height: 100 },
    { id: 'gpu', name: 'GPU', category: 'tech', svg: createGPU(), width: 130, height: 100 },
    { id: 'server-rack', name: 'Server', category: 'tech', svg: createServerRack(), width: 90, height: 110 },
    { id: 'cloud', name: 'Cloud', category: 'tech', svg: createCloud(), width: 100, height: 70 },
    { id: 'cloud-dashed', name: 'Cloud Dash', category: 'tech', svg: createCloudDashed(), width: 100, height: 70 },
    { id: 'cloud-upload', name: 'Upload', category: 'tech', svg: createCloudUpload(), width: 100, height: 80 },
    { id: 'cloud-download', name: 'Download', category: 'tech', svg: createCloudDownload(), width: 100, height: 80 },
    { id: 'database', name: 'Database', category: 'tech', svg: createDatabase(), width: 80, height: 90 },
    { id: 'api-endpoint', name: 'API', category: 'tech', svg: createApiEndpoint(), width: 100, height: 50 },
    { id: 'api-get', name: 'GET', category: 'tech', svg: createApiGet(), width: 100, height: 50 },
    { id: 'api-post', name: 'POST', category: 'tech', svg: createApiPost(), width: 100, height: 50 },
    { id: 'code-brackets', name: 'Code', category: 'tech', svg: createCodeBrackets(), width: 90, height: 70 },
    { id: 'curly-braces', name: 'Braces', category: 'tech', svg: createCurlyBraces(), width: 80, height: 80 },
    { id: 'terminal', name: 'Terminal', category: 'tech', svg: createTerminal(), width: 100, height: 80 },
    { id: 'browser', name: 'Browser', category: 'tech', svg: createBrowser(), width: 110, height: 80 },
    { id: 'mobile', name: 'Mobile', category: 'tech', svg: createMobile(), width: 70, height: 120 },
    { id: 'laptop', name: 'Laptop', category: 'tech', svg: createLaptop(), width: 130, height: 95 },
    { id: 'network-node', name: 'Network', category: 'tech', svg: createNetworkNode(), width: 100, height: 100 },
    { id: 'network-mesh', name: 'Mesh', category: 'tech', svg: createNetworkMesh(), width: 120, height: 100 },
    { id: 'wifi', name: 'WiFi', category: 'tech', svg: createWifi(), width: 100, height: 90 },
    { id: 'bluetooth', name: 'Bluetooth', category: 'tech', svg: createBluetooth(), width: 90, height: 90 },
    { id: 'usb', name: 'USB', category: 'tech', svg: createUSB(), width: 70, height: 100 },
    { id: 'lightning', name: 'Lightning', category: 'tech', svg: createLightning(), width: 80, height: 100 },
    { id: 'battery', name: 'Battery', category: 'tech', svg: createBattery(), width: 100, height: 55 },
    { id: 'lock', name: 'Lock', category: 'tech', svg: createLock(), width: 75, height: 100 },
    { id: 'unlock', name: 'Unlock', category: 'tech', svg: createUnlock(), width: 80, height: 100 },
    { id: 'shield', name: 'Shield', category: 'tech', svg: createShield(), width: 85, height: 100 },
    { id: 'key', name: 'Key', category: 'tech', svg: createKey(), width: 110, height: 65 },
    { id: 'gear', name: 'Gear', category: 'tech', svg: createGear(), width: 80, height: 80 },
    { id: 'double-gear', name: 'Gears', category: 'tech', svg: createDoubleGear(), width: 100, height: 80 },
    { id: 'cube-3d', name: 'Cube 3D', category: 'tech', svg: createCube3D(), width: 80, height: 90 },
    { id: 'folder', name: 'Folder', category: 'tech', svg: createFolder(), width: 90, height: 70 },
    { id: 'file-doc', name: 'Doc', category: 'tech', svg: createFileDoc(), width: 70, height: 90 },
    { id: 'file-code', name: 'Code File', category: 'tech', svg: createFileCode(), width: 70, height: 90 },
    { id: 'git-branch', name: 'Branch', category: 'tech', svg: createGitBranch(), width: 80, height: 80 },
    { id: 'git-merge', name: 'Merge', category: 'tech', svg: createGitMerge(), width: 80, height: 80 },
    { id: 'qr-code', name: 'QR', category: 'tech', svg: createQRCode(), width: 80, height: 80 },
    { id: 'hashtag', name: 'Hashtag', category: 'tech', svg: createHashtag(), width: 70, height: 70 },
    { id: 'at-symbol', name: '@', category: 'tech', svg: createAtSymbol(), width: 80, height: 80 },

    // UI
    { id: 'toggle-on', name: 'Toggle On', category: 'ui', svg: createToggleOn(), width: 70, height: 40 },
    { id: 'toggle-off', name: 'Toggle Off', category: 'ui', svg: createToggleOff(), width: 70, height: 40 },
    { id: 'checkbox', name: 'Checkbox', category: 'ui', svg: createCheckbox(), width: 50, height: 50 },
    { id: 'checkbox-empty', name: 'Checkbox Empty', category: 'ui', svg: createCheckboxEmpty(), width: 50, height: 50 },
    { id: 'radio', name: 'Radio', category: 'ui', svg: createRadioButton(), width: 50, height: 50 },
    { id: 'radio-empty', name: 'Radio Empty', category: 'ui', svg: createRadioEmpty(), width: 50, height: 50 },
    { id: 'slider', name: 'Slider', category: 'ui', svg: createSlider(), width: 120, height: 40 },
    { id: 'progress', name: 'Progress', category: 'ui', svg: createProgressBar(), width: 120, height: 30 },
    { id: 'progress-circle', name: 'Progress %', category: 'ui', svg: createProgressCircle(), width: 70, height: 70 },
    { id: 'button', name: 'Button', category: 'ui', svg: createButton(), width: 100, height: 45 },
    { id: 'button-primary', name: 'Btn Primary', category: 'ui', svg: createButtonPrimary(), width: 100, height: 45 },
    { id: 'input', name: 'Input', category: 'ui', svg: createInputField(), width: 120, height: 45 },
    { id: 'search-input', name: 'Search', category: 'ui', svg: createSearchInput(), width: 130, height: 45 },
    { id: 'dropdown', name: 'Dropdown', category: 'ui', svg: createDropdown(), width: 120, height: 45 },
    { id: 'card', name: 'Card', category: 'ui', svg: createCard(), width: 100, height: 120 },
    { id: 'avatar', name: 'Avatar', category: 'ui', svg: createAvatar(), width: 60, height: 60 },
    { id: 'avatar-group', name: 'Avatars', category: 'ui', svg: createAvatarGroup(), width: 100, height: 50 },
    { id: 'bell', name: 'Bell', category: 'ui', svg: createBell(), width: 60, height: 70 },
    { id: 'menu-hamburger', name: 'Menu', category: 'ui', svg: createMenuHamburger(), width: 60, height: 50 },
    { id: 'menu-dots', name: 'Dots', category: 'ui', svg: createMenuDots(), width: 40, height: 60 },
    { id: 'close-x', name: 'Close', category: 'ui', svg: createCloseX(), width: 50, height: 50 },
    { id: 'plus', name: 'Plus', category: 'ui', svg: createPlus(), width: 50, height: 50 },
    { id: 'minus', name: 'Minus', category: 'ui', svg: createMinus(), width: 50, height: 50 },

    // Badges
    { id: 'badge-notification', name: 'Badge', category: 'badge', svg: createBadgeNotification(), width: 60, height: 60 },
    { id: 'badge-large', name: 'Badge 99', category: 'badge', svg: createBadgeLarge(), width: 70, height: 70 },
    { id: 'badge-pill', name: 'Pill', category: 'badge', svg: createBadgePill(), width: 80, height: 40 },
    { id: 'badge-beta', name: 'Beta', category: 'badge', svg: createBadgeBeta(), width: 70, height: 35 },
    { id: 'badge-pro', name: 'Pro', category: 'badge', svg: createBadgePro(), width: 60, height: 35 },
    { id: 'status-online', name: 'Online', category: 'badge', svg: createStatusOnline(), width: 50, height: 50 },
    { id: 'status-offline', name: 'Offline', category: 'badge', svg: createStatusOffline(), width: 50, height: 50 },
    { id: 'status-busy', name: 'Busy', category: 'badge', svg: createStatusBusy(), width: 50, height: 50 },
    { id: 'status-away', name: 'Away', category: 'badge', svg: createStatusAway(), width: 50, height: 50 },
    { id: 'tag-label', name: 'Tag', category: 'badge', svg: createTagLabel(), width: 90, height: 40 },
    { id: 'target', name: 'Target', category: 'badge', svg: createTarget(), width: 80, height: 80 },
    { id: 'pulse', name: 'Pulse', category: 'badge', svg: createPulse(), width: 80, height: 80 },
    { id: 'spinner', name: 'Spinner', category: 'badge', svg: createSpinner(), width: 60, height: 60 },
    { id: 'checkmark', name: 'Check', category: 'badge', svg: createCheckmark(), width: 60, height: 60 },
    { id: 'error-x', name: 'Error', category: 'badge', svg: createErrorX(), width: 60, height: 60 },
    { id: 'warning', name: 'Warning', category: 'badge', svg: createWarning(), width: 70, height: 65 },
    { id: 'info', name: 'Info', category: 'badge', svg: createInfo(), width: 60, height: 60 },
    { id: 'heart', name: 'Heart', category: 'badge', svg: createHeart(), width: 70, height: 65 },
    { id: 'star-filled', name: 'Star', category: 'badge', svg: createStarFilled(), width: 70, height: 70 },
    { id: 'bookmark', name: 'Bookmark', category: 'badge', svg: createBookmark(), width: 50, height: 70 },
    { id: 'pin', name: 'Pin', category: 'badge', svg: createPin(), width: 50, height: 70 },
    { id: 'location', name: 'Location', category: 'badge', svg: createLocation(), width: 55, height: 70 },
  ];
}
