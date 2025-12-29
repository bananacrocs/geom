import type { ExportRequest, ShapeConfig } from '../../../shared/types.js';

/**
 * Genera le coordinate 2D per un poligono regolare
 */
function generatePolygonPoints(
  sides: number,
  radius: number,
  centerX: number,
  centerY: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const angleOffset = -Math.PI / 2; // Inizia dal punto più alto

  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides + angleOffset;
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return points;
}

/**
 * Genera un path SVG da un array di punti
 */
function pointsToPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  path += ' Z';

  return path;
}

/**
 * Genera un SVG rappresentante la forma geometrica
 * Nota: Questa è una proiezione 2D semplificata
 */
export async function generateSvg(request: ExportRequest): Promise<string> {
  const { shape, export: exportConfig } = request;
  const { width, height, backgroundColor } = exportConfig;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  // Genera i punti del poligono principale
  const mainPoints = generatePolygonPoints(shape.faces, radius, centerX, centerY);
  const mainPath = pointsToPath(mainPoints);

  // Genera i punti per il poligono interno (effetto 3D)
  const innerRadius = radius * 0.5;
  const innerPoints = generatePolygonPoints(shape.faces, innerRadius, centerX, centerY);

  // Costruisci le facce come triangoli dal centro ai bordi
  const facePaths: string[] = [];
  const faceColors: string[] = [];

  for (let i = 0; i < shape.faces; i++) {
    const nextIndex = (i + 1) % mainPoints.length;
    const outerP1 = mainPoints[i];
    const outerP2 = mainPoints[nextIndex];
    const innerP1 = innerPoints[i];
    const innerP2 = innerPoints[nextIndex];

    // Faccia trapezoidale
    const facePath = `M ${outerP1.x} ${outerP1.y} L ${outerP2.x} ${outerP2.y} L ${innerP2.x} ${innerP2.y} L ${innerP1.x} ${innerP1.y} Z`;
    facePaths.push(facePath);

    const faceConfig = shape.faceConfigs[i % shape.faceConfigs.length];
    faceColors.push(faceConfig.color);
  }

  // Costruisci l'SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
`;

  // Sfondo
  if (backgroundColor !== 'transparent') {
    svg += `  <rect width="100%" height="100%" fill="${backgroundColor}"/>
`;
  }

  // Gruppo principale con ombra
  svg += `  <g filter="url(#shadow)">
`;

  // Disegna le facce
  for (let i = 0; i < facePaths.length; i++) {
    const faceConfig = shape.faceConfigs[i % shape.faceConfigs.length];
    svg += `    <path d="${facePaths[i]}" fill="${faceColors[i]}" fill-opacity="${faceConfig.opacity}" stroke="${faceConfig.borderColor}" stroke-width="${faceConfig.borderWidth}"/>
`;
  }

  // Poligono centrale
  const centerColor = shape.faceConfigs[0]?.color || '#6366f1';
  svg += `    <path d="${pointsToPath(innerPoints)}" fill="${centerColor}" fill-opacity="0.8"/>
`;

  svg += `  </g>
`;

  // Icona centrale (se presente)
  if (shape.icon) {
    if (shape.icon.type === 'custom' && shape.icon.svgContent) {
      // Estrai il contenuto interno dell'SVG custom
      const svgMatch = shape.icon.svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
      if (svgMatch) {
        const innerContent = svgMatch[1];
        const iconSize = (shape.icon.size / 100) * radius;
        const iconX = centerX - iconSize / 2;
        const iconY = centerY - iconSize / 2;

        svg += `  <g transform="translate(${iconX}, ${iconY}) scale(${iconSize / 24})" fill="${shape.icon.color}">
    ${innerContent}
  </g>
`;
      }
    }
    // Per icone Lucide, sarebbe necessario includere i path SVG corrispondenti
  }

  svg += `</svg>`;

  // Converti in base64
  return Buffer.from(svg).toString('base64');
}
