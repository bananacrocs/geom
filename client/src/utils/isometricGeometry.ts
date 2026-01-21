/**
 * Utility per geometria isometrica precisa
 * La proiezione isometrica usa un angolo di 30° rispetto all'orizzontale
 * cos(30°) = √3/2 ≈ 0.866025
 * sin(30°) = 0.5
 */

// Costanti precise per isometria
const COS_30 = Math.sqrt(3) / 2; // 0.866025403784
const SIN_30 = 0.5;

export interface CubeVertices {
  top: [number, number];
  left: [number, number];
  right: [number, number];
  center: [number, number];
  bottomLeft: [number, number];
  bottomRight: [number, number];
  bottom: [number, number];
}

export interface CubePaths {
  topFace: string;
  leftFace: string;
  rightFace: string;
  outline: string;
  hiddenEdges: string[];
  visibleEdges: string[];
  vertices: CubeVertices;
}

/**
 * Formatta un numero per SVG (max 2 decimali, rimuove zeri inutili)
 */
function fmt(n: number): string {
  return Number(n.toFixed(2)).toString();
}

/**
 * Genera i path SVG per un cubo isometrico
 * @param cx - Centro orizzontale
 * @param topY - Coordinata Y del vertice superiore
 * @param size - Lunghezza del lato
 * @returns Oggetto con path delle facce e bordi
 */
export function getCubePaths(cx: number, topY: number, size: number): CubePaths {
  const w = size * COS_30;  // offset orizzontale
  const h = size * SIN_30;  // offset verticale (metà lato)

  // 7 Vertici del cubo isometrico
  const vertices: CubeVertices = {
    top: [cx, topY],
    left: [cx - w, topY + h],
    right: [cx + w, topY + h],
    center: [cx, topY + size],           // vertice posteriore (nascosto)
    bottomLeft: [cx - w, topY + h + size],
    bottomRight: [cx + w, topY + h + size],
    bottom: [cx, topY + size + size]
  };

  const v = vertices;

  // Path per le 3 facce visibili
  const topFace = `M${fmt(v.top[0])},${fmt(v.top[1])} L${fmt(v.right[0])},${fmt(v.right[1])} L${fmt(v.center[0])},${fmt(v.center[1])} L${fmt(v.left[0])},${fmt(v.left[1])}Z`;
  const leftFace = `M${fmt(v.left[0])},${fmt(v.left[1])} L${fmt(v.center[0])},${fmt(v.center[1])} L${fmt(v.bottom[0])},${fmt(v.bottom[1])} L${fmt(v.bottomLeft[0])},${fmt(v.bottomLeft[1])}Z`;
  const rightFace = `M${fmt(v.right[0])},${fmt(v.right[1])} L${fmt(v.bottomRight[0])},${fmt(v.bottomRight[1])} L${fmt(v.bottom[0])},${fmt(v.bottom[1])} L${fmt(v.center[0])},${fmt(v.center[1])}Z`;

  // Outline completo (silhouette esterna)
  const outline = `M${fmt(v.top[0])},${fmt(v.top[1])} L${fmt(v.right[0])},${fmt(v.right[1])} L${fmt(v.bottomRight[0])},${fmt(v.bottomRight[1])} L${fmt(v.bottom[0])},${fmt(v.bottom[1])} L${fmt(v.bottomLeft[0])},${fmt(v.bottomLeft[1])} L${fmt(v.left[0])},${fmt(v.left[1])}Z`;

  // Bordi nascosti (3 bordi che vanno dal centro verso il basso)
  const hiddenEdges = [
    `M${fmt(v.center[0])},${fmt(v.center[1])} L${fmt(v.bottom[0])},${fmt(v.bottom[1])}`,
    `M${fmt(v.center[0])},${fmt(v.center[1])} L${fmt(v.bottomLeft[0])},${fmt(v.bottomLeft[1])}`,
    `M${fmt(v.center[0])},${fmt(v.center[1])} L${fmt(v.bottomRight[0])},${fmt(v.bottomRight[1])}`
  ];

  // Bordi visibili (tutti i bordi esterni + i 3 bordi interni visibili)
  const visibleEdges = [
    // Contorno esterno
    `M${fmt(v.top[0])},${fmt(v.top[1])} L${fmt(v.left[0])},${fmt(v.left[1])}`,
    `M${fmt(v.top[0])},${fmt(v.top[1])} L${fmt(v.right[0])},${fmt(v.right[1])}`,
    `M${fmt(v.left[0])},${fmt(v.left[1])} L${fmt(v.bottomLeft[0])},${fmt(v.bottomLeft[1])}`,
    `M${fmt(v.right[0])},${fmt(v.right[1])} L${fmt(v.bottomRight[0])},${fmt(v.bottomRight[1])}`,
    `M${fmt(v.bottomLeft[0])},${fmt(v.bottomLeft[1])} L${fmt(v.bottom[0])},${fmt(v.bottom[1])}`,
    `M${fmt(v.bottomRight[0])},${fmt(v.bottomRight[1])} L${fmt(v.bottom[0])},${fmt(v.bottom[1])}`,
    // Bordi interni visibili (dalla faccia superiore)
    `M${fmt(v.left[0])},${fmt(v.left[1])} L${fmt(v.center[0])},${fmt(v.center[1])}`,
    `M${fmt(v.right[0])},${fmt(v.right[1])} L${fmt(v.center[0])},${fmt(v.center[1])}`,
    `M${fmt(v.center[0])},${fmt(v.center[1])} L${fmt(v.bottom[0])},${fmt(v.bottom[1])}`
  ];

  return {
    topFace,
    leftFace,
    rightFace,
    outline,
    hiddenEdges,
    visibleEdges,
    vertices
  };
}

/**
 * Calcola le dimensioni ideali del viewBox per un cubo
 */
export function getCubeViewBox(size: number, padding: number = 10): { width: number; height: number } {
  const w = size * COS_30;
  const width = Math.ceil(w * 2 + padding * 2);
  const height = Math.ceil(size * 2 + padding * 2);
  return { width, height };
}

/**
 * Genera coordinate per un punto su un'ellisse isometrica (per orbita)
 */
export function getOrbitPoint(cx: number, cy: number, radius: number, angleDeg: number): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * SIN_30 * Math.sin(angleRad)
  };
}
