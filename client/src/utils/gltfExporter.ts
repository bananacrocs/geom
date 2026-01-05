import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createPolyhedronGeometry } from './geometryGenerator';
import type { ShapeConfig, BorderConfig } from '../types';

// Calcola triangoli per faccia geometrica
function getTrianglesPerFace(faces: number): number {
  switch (faces) {
    case 6: return 2;   // Cubo: 2 triangoli per faccia quadrata
    case 12: return 3;  // Dodecaedro: 3 triangoli per faccia pentagonale
    default: return 1;  // Tetraedro, Ottaedro, Icosaedro: 1 triangolo per faccia
  }
}

// Crea geometria "baked" con solo facce visibili e colori applicati
function createBakedGeometry(shapeConfig: ShapeConfig): THREE.BufferGeometry | null {
  const baseGeom = createPolyhedronGeometry(shapeConfig.faces).toNonIndexed();
  const position = baseGeom.getAttribute('position');
  const vertexCount = position.count;
  const triangleCount = vertexCount / 3;

  const trianglesPerFace = getTrianglesPerFace(shapeConfig.faces);
  const geometricFaceCount = shapeConfig.faceConfigs.length;

  // Raccogli solo i triangoli delle facce visibili
  const visiblePositions: number[] = [];
  const visibleColors: number[] = [];
  const visibleNormals: number[] = [];

  // Calcola le normali se non esistono
  baseGeom.computeVertexNormals();
  const normalAttr = baseGeom.getAttribute('normal');

  for (let triIndex = 0; triIndex < triangleCount; triIndex++) {
    const geometricFaceIndex = Math.floor(triIndex / trianglesPerFace) % geometricFaceCount;
    const faceConfig = shapeConfig.faceConfigs[geometricFaceIndex];

    // Salta le facce non visibili
    if (!faceConfig.isVisible) continue;

    const color = new THREE.Color(faceConfig.color);

    // Copia i 3 vertici del triangolo
    for (let v = 0; v < 3; v++) {
      const vertexIndex = triIndex * 3 + v;

      // Posizione
      visiblePositions.push(
        position.getX(vertexIndex),
        position.getY(vertexIndex),
        position.getZ(vertexIndex)
      );

      // Normale
      visibleNormals.push(
        normalAttr.getX(vertexIndex),
        normalAttr.getY(vertexIndex),
        normalAttr.getZ(vertexIndex)
      );

      // Colore (vertex color)
      visibleColors.push(color.r, color.g, color.b);
    }
  }

  // Se nessuna faccia è visibile, ritorna null
  if (visiblePositions.length === 0) {
    return null;
  }

  // Crea nuova geometria con solo facce visibili
  const bakedGeom = new THREE.BufferGeometry();
  bakedGeom.setAttribute('position', new THREE.Float32BufferAttribute(visiblePositions, 3));
  bakedGeom.setAttribute('normal', new THREE.Float32BufferAttribute(visibleNormals, 3));
  bakedGeom.setAttribute('color', new THREE.Float32BufferAttribute(visibleColors, 3));

  return bakedGeom;
}

// Crea bordi come LineSegments standard
function createBorderLines(shapeConfig: ShapeConfig, borderConfig: BorderConfig): THREE.LineSegments | null {
  if (!borderConfig.visible || borderConfig.width <= 0) {
    return null;
  }

  const baseGeom = createPolyhedronGeometry(shapeConfig.faces);
  const edges = new THREE.EdgesGeometry(baseGeom);

  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(borderConfig.color),
  });

  return new THREE.LineSegments(edges, material);
}

export async function exportGLB(
  scene: THREE.Scene,
  shapeConfig: ShapeConfig,
  borderConfig: BorderConfig
): Promise<Blob> {
  // Crea un gruppo per l'export
  const exportGroup = new THREE.Group();
  exportGroup.name = 'GeometryExport';

  // Trova il gruppo ruotante nella scena per copiare la rotazione
  let rotation = new THREE.Euler(0, 0, 0);
  let scale = shapeConfig.scale;

  scene.traverse((obj) => {
    if (obj instanceof THREE.Group && obj.parent instanceof THREE.Group) {
      // Questo dovrebbe essere il gruppo ruotante interno
      rotation = obj.rotation.clone();
    }
  });

  // Crea la geometria baked della forma principale
  const bakedGeom = createBakedGeometry(shapeConfig);

  if (bakedGeom) {
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(bakedGeom, material);
    mesh.name = 'Shape';
    mesh.rotation.copy(rotation);
    mesh.scale.setScalar(scale);
    exportGroup.add(mesh);
  }

  // Aggiungi i bordi
  const borderLines = createBorderLines(shapeConfig, borderConfig);
  if (borderLines) {
    borderLines.name = 'Borders';
    borderLines.rotation.copy(rotation);
    borderLines.scale.setScalar(scale);
    exportGroup.add(borderLines);
  }

  // Cerca e clona le mesh dell'icona SVG dalla scena
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.ShapeGeometry) {
      // Questa è probabilmente una mesh dell'icona SVG
      const iconMesh = obj.clone();

      // Converti il materiale in MeshStandardMaterial
      if (obj.material instanceof THREE.MeshBasicMaterial) {
        iconMesh.material = new THREE.MeshStandardMaterial({
          color: obj.material.color,
          side: THREE.DoubleSide,
          roughness: 0.5,
          metalness: 0.1,
        });
      }

      iconMesh.name = 'Icon';
      exportGroup.add(iconMesh);
    }
  });

  // Aggiungi luci per rendering corretto nel viewer
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  ambientLight.name = 'AmbientLight';
  exportGroup.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.name = 'DirectionalLight';
  exportGroup.add(directionalLight);

  // Esporta
  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      exportGroup,
      (result) => {
        const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
        resolve(blob);
      },
      (error) => {
        reject(error);
      },
      { binary: true }
    );
  });
}
