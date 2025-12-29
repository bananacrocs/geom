import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

/**
 * Genera una forma 3D basata sul numero di facce
 * Usa i solidi platonici per 4, 6, 8, 12, 20 facce
 * Per altri numeri usa ConvexGeometry con punti distribuiti su una sfera
 */
export function createPolyhedronGeometry(faces: number): THREE.BufferGeometry {
  // Solidi platonici
  switch (faces) {
    case 4:
      return new THREE.TetrahedronGeometry(1);
    case 6:
      return new THREE.BoxGeometry(1.4, 1.4, 1.4);
    case 8:
      return new THREE.OctahedronGeometry(1);
    case 12:
      return new THREE.DodecahedronGeometry(1);
    case 20:
      return new THREE.IcosahedronGeometry(1);
    default:
      return createCustomPolyhedron(faces);
  }
}

/**
 * Crea un poliedro custom distribuendo punti su una sfera
 * e calcolando l'hull convesso
 */
function createCustomPolyhedron(faces: number): THREE.BufferGeometry {
  // Stimiamo il numero di vertici necessari
  // Per un poliedro convesso: V - E + F = 2 (formula di Eulero)
  // Approssimativamente, per forme convesse regolari: V ≈ F/2 + 2
  const numVertices = Math.max(faces, Math.ceil(faces * 0.6) + 4);

  const points: THREE.Vector3[] = [];

  // Fibonacci sphere per distribuzione uniforme
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < numVertices; i++) {
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / numVertices);

    const x = Math.cos(theta) * Math.sin(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(phi);

    points.push(new THREE.Vector3(x, y, z));
  }

  try {
    return new ConvexGeometry(points);
  } catch {
    // Fallback a icosaedro se ConvexGeometry fallisce
    return new THREE.IcosahedronGeometry(1);
  }
}

/**
 * Conta il numero effettivo di facce in una geometria
 */
export function countFaces(geometry: THREE.BufferGeometry): number {
  const index = geometry.getIndex();
  if (index) {
    return index.count / 3;
  }
  const position = geometry.getAttribute('position');
  return position.count / 3;
}

/**
 * Genera colori per vertice basati sulla configurazione facce
 */
export function generateFaceColors(
  geometry: THREE.BufferGeometry,
  colors: string[]
): Float32Array {
  const position = geometry.getAttribute('position');
  const index = geometry.getIndex();

  const vertexCount = position.count;
  const colorArray = new Float32Array(vertexCount * 3);

  if (index) {
    // Geometria indicizzata
    const faceCount = index.count / 3;

    for (let i = 0; i < faceCount; i++) {
      const colorIndex = i % colors.length;
      const color = new THREE.Color(colors[colorIndex]);

      for (let j = 0; j < 3; j++) {
        const vertexIndex = index.getX(i * 3 + j);
        colorArray[vertexIndex * 3] = color.r;
        colorArray[vertexIndex * 3 + 1] = color.g;
        colorArray[vertexIndex * 3 + 2] = color.b;
      }
    }
  } else {
    // Geometria non indicizzata
    const faceCount = vertexCount / 3;

    for (let i = 0; i < faceCount; i++) {
      const colorIndex = i % colors.length;
      const color = new THREE.Color(colors[colorIndex]);

      for (let j = 0; j < 3; j++) {
        const vertexIndex = i * 3 + j;
        colorArray[vertexIndex * 3] = color.r;
        colorArray[vertexIndex * 3 + 1] = color.g;
        colorArray[vertexIndex * 3 + 2] = color.b;
      }
    }
  }

  return colorArray;
}
