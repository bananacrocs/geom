import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { ArrowLeft, Download, Upload, Pause, Play, Trash2, FileImage } from 'lucide-react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer.js';

interface CanvaPageProps {
  onBack: () => void;
}

// Helper per creare cilindro tra due punti (per wireframe esportabile)
function createEdgeCylinder(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material
): THREE.Mesh {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();

  const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
  const mesh = new THREE.Mesh(geometry, material);

  // Posiziona al centro tra i due punti
  mesh.position.copy(start).add(end).multiplyScalar(0.5);

  // Orienta lungo la direzione
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return mesh;
}

// Componente per esporre scena e camera
function SceneRef({ sceneRef, cameraRef }: { sceneRef: React.MutableRefObject<THREE.Scene | null>, cameraRef: React.MutableRefObject<THREE.Camera | null> }) {
  const { scene, camera } = useThree();
  sceneRef.current = scene;
  cameraRef.current = camera;
  return null;
}

// Componente Logo Webwise 3D - carica SVG e lo renderizza in 3D
function LogoWebwise3D({ isAnimating }: { isAnimating: boolean }) {
  const [logoGroup, setLogoGroup] = useState<THREE.Group | null>(null);
  const pivotRef = useRef<THREE.Group>(null);


  useEffect(() => {
    // Carica il logo-webwise.svg
    fetch('/icons/logo-webwise.svg')
      .then((res) => res.text())
      .then((svgText) => {
        const loader = new SVGLoader();
        const svgData = loader.parse(svgText);

        const group = new THREE.Group();
        const targetColor = new THREE.Color(0xffffff);

        svgData.paths.forEach((path) => {
          const shapes = SVGLoader.createShapes(path);
          shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 100,
              bevelEnabled: false,
            });
            const material = new THREE.MeshPhysicalMaterial({
              color: targetColor,
              side: THREE.DoubleSide,
              metalness: 0.3,
              roughness: 0.15,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
              reflectivity: 1.0,
              envMapIntensity: 1.5,
            });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
          });
        });

        // Calcola bounding box e scala
        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Scala per stare nel dodecaedro (0.8 unità)
        if (maxDim > 0) {
          const targetSize = 0.8;
          const scaleFactor = targetSize / maxDim;
          group.scale.set(scaleFactor, -scaleFactor, scaleFactor); // -Y per flip verticale
        }

        // Aggiorna matrix world e centra
        group.updateMatrixWorld(true);
        const newBox = new THREE.Box3().setFromObject(group);
        const center = newBox.getCenter(new THREE.Vector3());
        group.position.set(-center.x, -center.y, -center.z);

        setLogoGroup(group);
      })
      .catch((err) => {
        console.error('Errore caricamento logo-webwise.svg:', err);
      });
  }, []);

  if (!logoGroup) return null;

  return (
    <group ref={pivotRef}>
      <primitive object={logoGroup} />
    </group>
  );
}

// Icosaedro wireframe (cilindri mesh per export GLB) con spin - Standard: forma 2.0 unità
function WireframeIcosahedron({ isAnimating }: { isAnimating: boolean }) {
  const icosahedronRef = useRef<THREE.Group>(null);

  const edgesGroup = useMemo(() => {
    // Crea geometria icosaedro (20 facce triangolari)
    const icosahedronGeom = new THREE.IcosahedronGeometry(1.0); // raggio 1.0 per diametro 2.0 unità

    const edges = new THREE.EdgesGeometry(icosahedronGeom);
    const positions = edges.attributes.position.array as Float32Array;

    // Materiale bianco per i cilindri e sfere
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });

    // Crea gruppo per tutti i cilindri e sfere
    const group = new THREE.Group();
    const radius = 0.045; // Raggio cilindri leggermente più sottile

    // Set per raccogliere vertici unici (per le sfere ai giunti)
    const verticesSet = new Map<string, THREE.Vector3>();

    // Itera sulle coppie di punti (ogni edge ha 2 vertici = 6 float)
    for (let i = 0; i < positions.length; i += 6) {
      const start = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
      const end = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);

      const cylinder = createEdgeCylinder(start, end, radius, material);
      group.add(cylinder);

      // Aggiungi vertici al set (usando stringa come chiave per deduplicare)
      const startKey = `${start.x.toFixed(4)},${start.y.toFixed(4)},${start.z.toFixed(4)}`;
      const endKey = `${end.x.toFixed(4)},${end.y.toFixed(4)},${end.z.toFixed(4)}`;
      if (!verticesSet.has(startKey)) verticesSet.set(startKey, start.clone());
      if (!verticesSet.has(endKey)) verticesSet.set(endKey, end.clone());
    }

    // Crea sfere ai vertici per giunzioni lisce
    const sphereGeom = new THREE.SphereGeometry(radius, 16, 16);
    verticesSet.forEach((vertex) => {
      const sphere = new THREE.Mesh(sphereGeom, material);
      sphere.position.copy(vertex);
      group.add(sphere);
    });

    return group;
  }, []);

  // Animazione spin (solo se isAnimating è true)
  useFrame((_, delta) => {
    if (icosahedronRef.current && isAnimating) {
      icosahedronRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={icosahedronRef}>
      <primitive object={edgesGroup} />
    </group>
  );
}

// Struttura 3D: rettangolo con 3 triangoli rettangoli a dente di sega
function HollowCube() {
  const meshGroup = useMemo(() => {
    const group = new THREE.Group();

    const w = 1.0;     // metà larghezza (X)
    const d = 0.7;     // metà profondità (Z)
    const bot = -0.8;  // fondo
    const mid = 0.25;  // cima base / base triangoli
    const top = 0.8;   // cima triangoli
    const tw = (2 * w) / 3; // larghezza ogni triangolo

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xcc0000,
      metalness: 0.15,
      roughness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.0,
    });

    // Profilo: rettangolo base + 3 triangoli rettangoli a dente di sega
    const shape = new THREE.Shape();
    shape.moveTo(-w, bot);
    shape.lineTo(-w, top);            // parete sinistra fino in cima
    shape.lineTo(-w + tw, mid);       // ipotenusa triangolo 1
    shape.lineTo(-w + tw, top);       // verticale triangolo 2
    shape.lineTo(-w + 2 * tw, mid);   // ipotenusa triangolo 2
    shape.lineTo(-w + 2 * tw, top);   // verticale triangolo 3
    shape.lineTo(w, mid);             // ipotenusa triangolo 3
    shape.lineTo(w, bot);             // parete destra
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: d * 2,
      bevelEnabled: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -d;
    group.add(mesh);

    return group;
  }, []);

  return <primitive object={meshGroup} />;
}

// Scena 3D
function Scene({ sceneRef, cameraRef, isAnimating }: { sceneRef: React.MutableRefObject<THREE.Scene | null>, cameraRef: React.MutableRefObject<THREE.Camera | null>, isAnimating: boolean }) {
  return (
    <>
      <SceneRef sceneRef={sceneRef} cameraRef={cameraRef} />
      <PerspectiveCamera makeDefault position={[3, 4, 3]} fov={40} />
      <OrbitControls enablePan={true} enableZoom={true} target={[0, 0, 0]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, 2, -3]} intensity={0.5} />
      <directionalLight position={[0, -3, 5]} intensity={0.3} />
      <Environment preset="studio" />

      <HollowCube />
    </>
  );
}

export function CanvaPage({ onBack }: CanvaPageProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sceneRef.current) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const url = URL.createObjectURL(file);

    if (extension === 'fbx') {
      const loader = new FBXLoader();
      loader.load(url, (fbx) => {
        console.log('FBX caricato:', fbx);

        // Applica colore #2EBAEB a tutti i materiali
        const targetColor = new THREE.Color(0x2EBAEB);
        let meshCount = 0;
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshCount++;
            child.material = new THREE.MeshStandardMaterial({
              color: targetColor,
              side: THREE.DoubleSide
            });
          }
        });
        console.log('Mesh trovate:', meshCount);

        // Calcola bounding box
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        console.log('Dimensioni originali:', size);
        const maxDim = Math.max(size.x, size.y, size.z);

        // Scala per entrare nel cubo (1.0 unità max per lasciare margine nel cubo da 1.5)
        if (maxDim > 0) {
          const targetSize = 1.0;
          const scaleFactor = targetSize / maxDim;
          fbx.scale.set(scaleFactor, scaleFactor, scaleFactor);
          console.log('Scale factor:', scaleFactor);
        }

        // Ricalcola box dopo scaling e centra
        const newBox = new THREE.Box3().setFromObject(fbx);
        const center = newBox.getCenter(new THREE.Vector3());
        fbx.position.set(-center.x, -center.y, -center.z);
        console.log('Centro:', center);

        if (sceneRef.current) {
          fbx.userData.imported = true; // Marca come importato per poterlo rimuovere
          sceneRef.current.add(fbx);
          console.log('FBX aggiunto alla scena');
        } else {
          console.error('sceneRef.current è null!');
        }
        URL.revokeObjectURL(url);
      }, (progress) => {
        console.log('Caricamento FBX:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
      }, (error) => {
        console.error('FBX load error:', error);
        alert('Errore nel caricamento del file FBX');
        URL.revokeObjectURL(url);
      });
    } else if (extension === 'glb' || extension === 'gltf') {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        const model = gltf.scene;
        // Scala il modello se troppo grande
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 5) {
          const scale = 5 / maxDim;
          model.scale.multiplyScalar(scale);
        }
        // Centra il modello
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(model.scale.x));

        model.userData.imported = true; // Marca come importato per poterlo rimuovere
        sceneRef.current?.add(model);
        URL.revokeObjectURL(url);
      }, undefined, (error) => {
        console.error('GLTF load error:', error);
        alert('Errore nel caricamento del file GLB/GLTF');
        URL.revokeObjectURL(url);
      });
    } else if (extension === 'svg') {
      // Carica SVG come geometria 3D
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgText = event.target?.result as string;
        const loader = new SVGLoader();
        const svgData = loader.parse(svgText);

        const svgGroup = new THREE.Group();
        const targetColor = new THREE.Color(0x2EBAEB);

        svgData.paths.forEach((path) => {
          const shapes = SVGLoader.createShapes(path);
          shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 5,
              bevelEnabled: false,
            });
            const material = new THREE.MeshStandardMaterial({
              color: targetColor,
              side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(geometry, material);
            svgGroup.add(mesh);
          });
        });

        // Calcola bounding box e scala
        const box = new THREE.Box3().setFromObject(svgGroup);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Scala per stare nella forma (1 unità per icona)
        if (maxDim > 0) {
          const targetSize = 1.0;
          const scaleFactor = targetSize / maxDim;
          svgGroup.scale.set(scaleFactor, -scaleFactor, scaleFactor); // -Y per flip verticale (SVG ha Y invertito)
        }

        // Aggiorna matrix world prima di calcolare il nuovo bounding box
        svgGroup.updateMatrixWorld(true);

        // Centra il gruppo
        const newBox = new THREE.Box3().setFromObject(svgGroup);
        const center = newBox.getCenter(new THREE.Vector3());
        svgGroup.position.set(-center.x, -center.y, -center.z);

        svgGroup.userData.imported = true;
        sceneRef.current?.add(svgGroup);
        console.log('SVG caricato e aggiunto alla scena');
      };
      reader.readAsText(file);
      URL.revokeObjectURL(url);
    } else {
      alert('Formato non supportato. Usa FBX, GLB, GLTF o SVG.');
      URL.revokeObjectURL(url);
    }

    // Reset input per permettere di ricaricare lo stesso file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportGLB = async () => {
    if (!sceneRef.current) {
      alert('Scena non pronta');
      return;
    }

    const exporter = new GLTFExporter();

    exporter.parse(
      sceneRef.current,
      (result) => {
        const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `canva-${Date.now()}.glb`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('GLB export error:', error);
        alert('Errore durante l\'export GLB');
      },
      { binary: true }
    );
  };

  const handleExportPNG = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('Canvas non trovato');
      return;
    }

    // Crea un canvas quadrato croppando dal centro
    const size = Math.min(canvas.width, canvas.height);
    const squareCanvas = document.createElement('canvas');
    squareCanvas.width = size;
    squareCanvas.height = size;
    const ctx = squareCanvas.getContext('2d');
    if (!ctx) return;

    // Croppa dal centro del canvas originale
    const sx = (canvas.width - size) / 2;
    const sy = (canvas.height - size) / 2;
    ctx.drawImage(canvas, sx, sy, size, size, 0, 0, size, size);

    const dataUrl = squareCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `canva-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleExportSVG = () => {
    if (!cameraRef.current) {
      alert('Scena non pronta');
      return;
    }

    const size = 800;
    const half = size / 2;

    // Dimensioni struttura a dente di sega
    const w = 1.0;     // metà larghezza (X)
    const dd = 0.7;    // metà profondità (Z)
    const bot = -0.8;  // fondo
    const mid = 0.25;  // cima base
    const top = 0.8;   // cima triangoli
    const tw = (2 * w) / 3; // larghezza triangolo

    type Vert = [number, number, number];
    type Face = { verts: Vert[]; normal: Vert; layer: number };

    // Vertici fronte (z = dd)
    const A: Vert = [-w, bot, dd];           // bottom-left
    const B: Vert = [-w, top, dd];           // top tri 1
    const C: Vert = [-w + tw, mid, dd];      // valley 1-2
    const D: Vert = [-w + tw, top, dd];      // top tri 2
    const E: Vert = [-w + 2 * tw, mid, dd];  // valley 2-3
    const F: Vert = [-w + 2 * tw, top, dd];  // top tri 3
    const G: Vert = [w, mid, dd];            // right at mid
    const H: Vert = [w, bot, dd];            // bottom-right

    // Vertici retro (z = -dd)
    const A2: Vert = [-w, bot, -dd];
    const B2: Vert = [-w, top, -dd];
    const C2: Vert = [-w + tw, mid, -dd];
    const D2: Vert = [-w + tw, top, -dd];
    const E2: Vert = [-w + 2 * tw, mid, -dd];
    const F2: Vert = [-w + 2 * tw, top, -dd];
    const G2: Vert = [w, mid, -dd];
    const H2: Vert = [w, bot, -dd];

    // Normale ipotenusa calcolata per pendenza (tw=0.667, h=0.55)
    const hypN: Vert = [0.636, 0.771, 0];

    // Layer: 1 = parete destra, 2 = faccia frontale, 3 = tetti ipotenusa
    const faces: Face[] = [
      // Faccia frontale (profilo a dente di sega)
      { verts: [A, B, C, D, E, F, G, H], normal: [0, 0, 1], layer: 2 },
      // Faccia retro
      { verts: [H2, G2, F2, E2, D2, C2, B2, A2], normal: [0, 0, -1], layer: 0 },
      // Fondo
      { verts: [A, H, H2, A2], normal: [0, -1, 0], layer: 0 },
      // Parete sinistra
      { verts: [A2, B2, B, A], normal: [-1, 0, 0], layer: 0 },
      // Parete destra (da bot a mid)
      { verts: [H, G, G2, H2], normal: [1, 0, 0], layer: 1 },
      // Gradino verticale 1→2
      { verts: [C, D, D2, C2], normal: [-1, 0, 0], layer: 0 },
      // Gradino verticale 2→3
      { verts: [E, F, F2, E2], normal: [-1, 0, 0], layer: 0 },
      // Tetto 1 (ipotenusa triangolo 1) - più lontano dalla camera
      { verts: [B, B2, C2, C], normal: hypN, layer: 3 },
      // Tetto 2 (ipotenusa triangolo 2) - medio
      { verts: [D, D2, E2, E], normal: hypN, layer: 5 },
      // Tetto 3 (ipotenusa triangolo 3) - più vicino alla camera
      { verts: [F, F2, G2, G], normal: hypN, layer: 7 },
    ];

    // Camera ortografica isometrica
    const frustumSize = 2.5;
    const orthoCamera = new THREE.OrthographicCamera(
      -frustumSize, frustumSize,
      frustumSize, -frustumSize,
      0.1, 100
    );
    orthoCamera.position.set(3, 4, 3);
    orthoCamera.lookAt(0, 0, 0);
    orthoCamera.updateMatrixWorld();

    const vpMatrix = new THREE.Matrix4().multiplyMatrices(
      orthoCamera.projectionMatrix, orthoCamera.matrixWorldInverse
    );

    const camDir = new THREE.Vector3();
    orthoCamera.getWorldDirection(camDir);
    const lightDir = new THREE.Vector3(5, 5, 5).normalize();

    const project = (v: Vert) => {
      const p = new THREE.Vector3(v[0], v[1], v[2]).applyMatrix4(vpMatrix);
      return { x: (p.x * half) + half, y: (-p.y * half) + half, z: p.z };
    };

    const proj = (v: Vert) => {
      const p = project(v);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    };

    // Filtra facce visibili e calcola colori
    const visible: { points: string; layer: number; depth: number; color: string }[] = [];

    for (const face of faces) {
      const n = new THREE.Vector3(face.normal[0], face.normal[1], face.normal[2]);
      if (n.dot(camDir) > 0.01) continue;

      const projected = face.verts.map(project);
      const depth = projected.reduce((sum, p) => sum + p.z, 0) / projected.length;

      const lightDot = Math.max(0, n.dot(lightDir));
      const ambient = 0.35;
      const intensity = ambient + (1 - ambient) * lightDot;
      // Base rosso
      const baseR = 210;
      const baseG = 25;
      const baseB = 25;
      const r = Math.min(255, Math.round(baseR * intensity));
      const g = Math.min(255, Math.round(baseG * intensity));
      const b = Math.min(255, Math.round(baseB * intensity));
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      const points = projected.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      visible.push({ points, layer: face.layer, depth, color });
    }

    // Silhouette scura: contorno completo dell'edificio come sfondo.
    // I gap tra i tetti rivelano questo sfondo scuro = effetto gradini verticali.
    const silVerts = [A, B, B2, C2, D2, E2, F2, G2, H2, H];
    const silProj = silVerts.map(project);
    const silPoints = silProj.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    visible.push({ points: silPoints, layer: 0, depth: 0, color: '#3a0808' });

    visible.sort((a, b) => {
      if (a.layer !== b.layer) return a.layer - b.layer;
      return b.depth - a.depth;
    });

    // Edges
    const edgeColor = '#4d0808';
    const edgeWidth = 2;

    const allEdges: { from: Vert; to: Vert; normal1: Vert; normal2: Vert; layer: number }[] = [
      // Parete destra (layer 1)
      { from: H, to: H2, normal1: [1, 0, 0], normal2: [0, -1, 0], layer: 1 },
      { from: G2, to: H2, normal1: [0, 0, -1], normal2: [1, 0, 0], layer: 1 },
      // Tetto 1 (layer 3)
      { from: B, to: B2, normal1: [-1, 0, 0], normal2: hypN, layer: 3 },
      { from: B2, to: C2, normal1: [0, 0, -1], normal2: hypN, layer: 3 },
      // Tetto 2 (layer 5)
      { from: D2, to: E2, normal1: [0, 0, -1], normal2: hypN, layer: 5 },
      // Gradino 1→2 (tra tetto 1 e tetto 2 - tetto 2 copre le parti nascoste)
      { from: C, to: C2, normal1: hypN, normal2: [-1, 0, 0], layer: 4 },
      { from: D, to: D2, normal1: [-1, 0, 0], normal2: hypN, layer: 5 },
      { from: C2, to: D2, normal1: [0, 0, -1], normal2: hypN, layer: 4 },
      // Tetto 3 (layer 7)
      { from: G, to: G2, normal1: [1, 0, 0], normal2: hypN, layer: 7 },
      { from: F2, to: G2, normal1: [0, 0, -1], normal2: hypN, layer: 7 },
      // Gradino 2→3 (tra tetto 2 e tetto 3 - tetto 3 copre le parti nascoste)
      { from: E, to: E2, normal1: hypN, normal2: [-1, 0, 0], layer: 6 },
      { from: F, to: F2, normal1: [-1, 0, 0], normal2: hypN, layer: 7 },
      { from: E2, to: F2, normal1: [0, 0, -1], normal2: hypN, layer: 6 },
      // Profilo fronte - ultimo layer (z=0.7, sempre in primo piano)
      { from: A, to: B, normal1: [0, 0, 1], normal2: [-1, 0, 0], layer: 9 },
      { from: B, to: C, normal1: [0, 0, 1], normal2: hypN, layer: 9 },
      { from: C, to: D, normal1: [0, 0, 1], normal2: [-1, 0, 0], layer: 9 },
      { from: D, to: E, normal1: [0, 0, 1], normal2: hypN, layer: 9 },
      { from: E, to: F, normal1: [0, 0, 1], normal2: [-1, 0, 0], layer: 9 },
      { from: F, to: G, normal1: [0, 0, 1], normal2: hypN, layer: 9 },
      { from: G, to: H, normal1: [0, 0, 1], normal2: [1, 0, 0], layer: 9 },
      { from: A, to: H, normal1: [0, 0, 1], normal2: [0, -1, 0], layer: 9 },
    ];

    const isNormalVisible = (n: Vert) => {
      const nv = new THREE.Vector3(n[0], n[1], n[2]);
      return nv.dot(camDir) < 0.01;
    };

    // Genera SVG layer per layer
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">\n`;
    for (let layer = 0; layer <= 9; layer++) {
      const layerFaces = visible.filter(f => f.layer === layer);
      for (const face of layerFaces) {
        svg += `  <polygon points="${face.points}" fill="${face.color}" stroke="none"/>\n`;
      }

      for (const edge of allEdges) {
        if (edge.layer !== layer) continue;
        const vis1 = isNormalVisible(edge.normal1);
        const vis2 = isNormalVisible(edge.normal2);
        if (vis1 || vis2) {
          const fromP = proj(edge.from).split(',');
          const toP = proj(edge.to).split(',');
          svg += `  <line x1="${fromP[0]}" y1="${fromP[1]}" x2="${toP[0]}" y2="${toP[1]}" stroke="${edgeColor}" stroke-width="${edgeWidth}" stroke-linecap="round"/>\n`;
        }
      }
    }

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `canva-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearScene = () => {
    if (!sceneRef.current) return;

    // Trova e rimuovi tutti gli oggetti importati (non la piramide, luci, camera)
    const toRemove: THREE.Object3D[] = [];
    sceneRef.current.traverse((obj) => {
      // Rimuovi solo le mesh e i gruppi aggiunti dall'import (non quelli di react-three-fiber)
      if (obj.userData.imported) {
        toRemove.push(obj);
      }
    });

    toRemove.forEach((obj) => {
      obj.parent?.remove(obj);
    });
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Canvas 3D */}
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        style={{ background: '#252525' }}
      >
        <Scene sceneRef={sceneRef} cameraRef={cameraRef} isAnimating={isAnimating} />
      </Canvas>

      {/* Bottoni a sinistra */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        {/* Bottone Indietro */}
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white hover:bg-[#252525] transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Indietro
        </button>

        {/* Bottone Play/Pause */}
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white hover:bg-[#252525] transition-all flex items-center gap-2"
        >
          {isAnimating ? <Pause size={18} /> : <Play size={18} />}
          {isAnimating ? 'Pausa' : 'Play'}
        </button>
      </div>

      {/* Bottoni a destra */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Input file nascosto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".fbx,.glb,.gltf,.svg"
          onChange={handleImportFile}
          className="hidden"
        />

        {/* Bottone Importa */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all flex items-center gap-2"
        >
          <Upload size={18} />
          Importa
        </button>

        {/* Bottone Esporta GLB */}
        <button
          onClick={handleExportGLB}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-all flex items-center gap-2"
        >
          <Download size={18} />
          Esporta GLB
        </button>

        {/* Bottone Esporta PNG */}
        <button
          onClick={handleExportPNG}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-all flex items-center gap-2"
        >
          <Download size={18} />
          Esporta PNG
        </button>

        {/* Bottone Esporta SVG */}
        <button
          onClick={handleExportSVG}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white transition-all flex items-center gap-2"
        >
          <FileImage size={18} />
          Esporta SVG
        </button>

        {/* Bottone Svuota Scena */}
        <button
          onClick={handleClearScene}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-all flex items-center gap-2"
        >
          <Trash2 size={18} />
          Svuota
        </button>
      </div>
    </div>
  );
}
