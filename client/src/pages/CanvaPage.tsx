import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ArrowLeft, Download, Upload, Pause, Play, Trash2 } from 'lucide-react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

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

// Componente per esporre la scena
function SceneRef({ sceneRef }: { sceneRef: React.MutableRefObject<THREE.Scene | null> }) {
  const { scene } = useThree();
  sceneRef.current = scene;
  return null;
}

// Componente Logo Webwise 3D - carica SVG e lo renderizza in 3D
function LogoWebwise3D() {
  const [logoGroup, setLogoGroup] = useState<THREE.Group | null>(null);

  useEffect(() => {
    // Carica il logo-webwise.svg
    fetch('/icons/logo-webwise.svg')
      .then((res) => res.text())
      .then((svgText) => {
        const loader = new SVGLoader();
        const svgData = loader.parse(svgText);

        const group = new THREE.Group();
        const targetColor = new THREE.Color(0x2EBAEB);

        svgData.paths.forEach((path) => {
          const shapes = SVGLoader.createShapes(path);
          shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 100, // Profondità maggiore per compensare la scala del logo grande
              bevelEnabled: false,
            });
            const material = new THREE.MeshStandardMaterial({
              color: targetColor,
              side: THREE.DoubleSide,
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

  return <primitive object={logoGroup} />;
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

// Scena 3D
function Scene({ sceneRef, isAnimating }: { sceneRef: React.MutableRefObject<THREE.Scene | null>, isAnimating: boolean }) {
  return (
    <>
      <SceneRef sceneRef={sceneRef} />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <OrbitControls enablePan={true} enableZoom={true} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />

      {/* Icosaedro wireframe bianco */}
      <WireframeIcosahedron isAnimating={isAnimating} />

      {/* Logo Webwise 3D statico al centro */}
      <LogoWebwise3D />
    </>
  );
}

export function CanvaPage({ onBack }: CanvaPageProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
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
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `canva-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
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
        style={{ background: '#767676' }}
      >
        <Scene sceneRef={sceneRef} isAnimating={isAnimating} />
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
