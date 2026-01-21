/**
 * Decorazioni SVG - Linee, curve, pallini in stile Attio
 */

import type { DecorationConfig } from '../stores/isometricStore';

// Colori consistenti con i cubi
const C = {
  stroke: '#c8c8c8',
  strokeLight: '#b0b0b0',
  dot: '#c8c8c8'
};

// Formatta numero per SVG
const f = (n: number): string => Number(n.toFixed(2)).toString();

const svgOpen = (w: number, h: number): string =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;

const svgClose = '</svg>';

/**
 * 1. Linea orizzontale tratteggiata
 */
export function createDashedLineH(): string {
  const w = 120, h = 40;
  const y = h / 2;
  return `${svgOpen(w, h)}
  <line x1="10" y1="${y}" x2="${w - 10}" y2="${y}" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="8 5" stroke-linecap="round"/>
${svgClose}`;
}

/**
 * 2. Linea verticale tratteggiata
 */
export function createDashedLineV(): string {
  const w = 40, h = 100;
  const x = w / 2;
  return `${svgOpen(w, h)}
  <line x1="${x}" y1="10" x2="${x}" y2="${h - 10}" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="8 5" stroke-linecap="round"/>
${svgClose}`;
}

/**
 * 3. Linea diagonale tratteggiata
 */
export function createDashedLineDiag(): string {
  const w = 100, h = 80;
  return `${svgOpen(w, h)}
  <line x1="10" y1="${h - 10}" x2="${w - 10}" y2="10" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="8 5" stroke-linecap="round"/>
${svgClose}`;
}

/**
 * 4. Linea puntinata
 */
export function createDottedLine(): string {
  const w = 120, h = 40;
  const y = h / 2;
  return `${svgOpen(w, h)}
  <line x1="10" y1="${y}" x2="${w - 10}" y2="${y}" stroke="${C.stroke}" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>
${svgClose}`;
}

/**
 * 5. Linea con pallini alle estremità
 */
export function createLineWithDots(): string {
  const w = 120, h = 40;
  const y = h / 2;
  const r = 5;
  return `${svgOpen(w, h)}
  <line x1="${15 + r}" y1="${y}" x2="${w - 15 - r}" y2="${y}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="15" cy="${y}" r="${r}" fill="${C.dot}"/>
  <circle cx="${w - 15}" cy="${y}" r="${r}" fill="${C.dot}"/>
${svgClose}`;
}

/**
 * 6. Linea con 3 pallini (connettore)
 */
export function createConnectorLine(): string {
  const w = 120, h = 40;
  const y = h / 2;
  const r = 4;
  const x1 = 15, x2 = w / 2, x3 = w - 15;
  return `${svgOpen(w, h)}
  <line x1="${x1}" y1="${y}" x2="${x3}" y2="${y}" stroke="${C.strokeLight}" stroke-width="1.5"/>
  <circle cx="${x1}" cy="${y}" r="${r}" fill="${C.dot}"/>
  <circle cx="${x2}" cy="${y}" r="${r}" fill="${C.dot}"/>
  <circle cx="${x3}" cy="${y}" r="${r}" fill="${C.dot}"/>
${svgClose}`;
}

/**
 * 7. Arco curvo
 */
export function createCurveArc(): string {
  const w = 100, h = 60;
  return `${svgOpen(w, h)}
  <path d="M 10 ${h - 15} Q ${w / 2} 10 ${w - 10} ${h - 15}" stroke="${C.stroke}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
${svgClose}`;
}

/**
 * 8. Curva Bezier (S)
 */
export function createCurveBezier(): string {
  const w = 100, h = 80;
  return `${svgOpen(w, h)}
  <path d="M 10 ${h - 15} C 30 ${h - 15}, 30 15, ${w / 2} 15 S ${w - 30} 15, ${w - 10} ${h - 15}" stroke="${C.stroke}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
${svgClose}`;
}

/**
 * 9. Linea con freccia
 */
export function createArrowLine(): string {
  const w = 120, h = 40;
  const y = h / 2;
  const arrowSize = 8;
  return `${svgOpen(w, h)}
  <line x1="15" y1="${y}" x2="${w - 20}" y2="${y}" stroke="${C.stroke}" stroke-width="1.5"/>
  <path d="M ${w - 20} ${y - arrowSize / 2} L ${w - 10} ${y} L ${w - 20} ${y + arrowSize / 2}" stroke="${C.stroke}" stroke-width="1.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="15" cy="${y}" r="4" fill="${C.dot}"/>
${svgClose}`;
}

/**
 * 10. Linea ondulata
 */
export function createWavyLine(): string {
  const w = 120, h = 50;
  const y = h / 2;
  const amp = 8;
  const freq = 20;
  let path = `M 10 ${y}`;
  for (let x = 10; x < w - 10; x += freq) {
    const cp1x = x + freq / 4;
    const cp1y = y - amp;
    const cp2x = x + freq * 3 / 4;
    const cp2y = y + amp;
    const ex = Math.min(x + freq, w - 10);
    path += ` C ${f(cp1x)} ${f(cp1y)}, ${f(cp2x)} ${f(cp2y)}, ${f(ex)} ${y}`;
  }
  return `${svgOpen(w, h)}
  <path d="${path}" stroke="${C.stroke}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
${svgClose}`;
}

/**
 * 11. Angolo retto (corner)
 */
export function createCorner(): string {
  const w = 80, h = 80;
  const r = 4;
  return `${svgOpen(w, h)}
  <path d="M 15 15 L 15 ${h - 15} L ${w - 15} ${h - 15}" stroke="${C.stroke}" stroke-width="1.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="15" cy="15" r="${r}" fill="${C.dot}"/>
  <circle cx="${w - 15}" cy="${h - 15}" r="${r}" fill="${C.dot}"/>
${svgClose}`;
}

/**
 * 12. Angolo arrotondato
 */
export function createRoundedCorner(): string {
  const w = 80, h = 80;
  const radius = 20;
  const r = 4;
  return `${svgOpen(w, h)}
  <path d="M 15 15 L 15 ${h - 15 - radius} Q 15 ${h - 15} ${15 + radius} ${h - 15} L ${w - 15} ${h - 15}" stroke="${C.stroke}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="15" cy="15" r="${r}" fill="${C.dot}"/>
  <circle cx="${w - 15}" cy="${h - 15}" r="${r}" fill="${C.dot}"/>
${svgClose}`;
}

/**
 * 13. Biforcazione (branch)
 */
export function createBranch(): string {
  const w = 100, h = 80;
  const r = 4;
  return `${svgOpen(w, h)}
  <line x1="15" y1="${h / 2}" x2="${w / 2}" y2="${h / 2}" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="${w / 2}" y1="${h / 2}" x2="${w - 15}" y2="15" stroke="${C.stroke}" stroke-width="1.5"/>
  <line x1="${w / 2}" y1="${h / 2}" x2="${w - 15}" y2="${h - 15}" stroke="${C.stroke}" stroke-width="1.5"/>
  <circle cx="15" cy="${h / 2}" r="${r}" fill="${C.dot}"/>
  <circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="${C.dot}"/>
  <circle cx="${w - 15}" cy="15" r="${r}" fill="${C.dot}"/>
  <circle cx="${w - 15}" cy="${h - 15}" r="${r}" fill="${C.dot}"/>
${svgClose}`;
}

/**
 * 14. Linea tratteggiata con pallini
 */
export function createDashedWithDots(): string {
  const w = 120, h = 40;
  const y = h / 2;
  const r = 5;
  return `${svgOpen(w, h)}
  <line x1="${15 + r}" y1="${y}" x2="${w - 15 - r}" y2="${y}" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="8 5"/>
  <circle cx="15" cy="${y}" r="${r}" fill="${C.dot}"/>
  <circle cx="${w - 15}" cy="${y}" r="${r}" fill="${C.dot}"/>
${svgClose}`;
}

/**
 * 15. Cerchio tratteggiato
 */
export function createDashedCircle(): string {
  const w = 80, h = 80;
  const r = 28;
  return `${svgOpen(w, h)}
  <circle cx="${w / 2}" cy="${h / 2}" r="${r}" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/>
${svgClose}`;
}

/**
 * 16. Ellisse tratteggiata
 */
export function createDashedEllipse(): string {
  const w = 120, h = 60;
  return `${svgOpen(w, h)}
  <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 15}" ry="${h / 2 - 12}" stroke="${C.stroke}" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/>
${svgClose}`;
}

/**
 * Genera tutte le decorazioni
 */
export function generateAllDecorations(): DecorationConfig[] {
  return [
    { id: 'dashed-h', name: 'Dashed H', svg: createDashedLineH(), width: 120, height: 40 },
    { id: 'dashed-v', name: 'Dashed V', svg: createDashedLineV(), width: 40, height: 100 },
    { id: 'dashed-diag', name: 'Dashed Diag', svg: createDashedLineDiag(), width: 100, height: 80 },
    { id: 'dotted', name: 'Dotted', svg: createDottedLine(), width: 120, height: 40 },
    { id: 'line-dots', name: 'Line + Dots', svg: createLineWithDots(), width: 120, height: 40 },
    { id: 'connector', name: 'Connector', svg: createConnectorLine(), width: 120, height: 40 },
    { id: 'arc', name: 'Arc', svg: createCurveArc(), width: 100, height: 60 },
    { id: 'bezier', name: 'Bezier', svg: createCurveBezier(), width: 100, height: 80 },
    { id: 'arrow', name: 'Arrow', svg: createArrowLine(), width: 120, height: 40 },
    { id: 'wavy', name: 'Wavy', svg: createWavyLine(), width: 120, height: 50 },
    { id: 'corner', name: 'Corner', svg: createCorner(), width: 80, height: 80 },
    { id: 'rounded-corner', name: 'Rounded', svg: createRoundedCorner(), width: 80, height: 80 },
    { id: 'branch', name: 'Branch', svg: createBranch(), width: 100, height: 80 },
    { id: 'dashed-dots', name: 'Dashed + Dots', svg: createDashedWithDots(), width: 120, height: 40 },
    { id: 'dashed-circle', name: 'Circle', svg: createDashedCircle(), width: 80, height: 80 },
    { id: 'dashed-ellipse', name: 'Ellipse', svg: createDashedEllipse(), width: 120, height: 60 },
  ];
}
