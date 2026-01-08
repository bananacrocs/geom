import { useRef, useMemo, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ArrowLeft, Download, Upload, Pause, Play, Trash2 } from 'lucide-react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';

interface CanvaPageProps {
  onBack: () => void;
}

// Componente per esporre la scena
function SceneRef({ sceneRef }: { sceneRef: React.MutableRefObject<THREE.Scene | null> }) {
  const { scene } = useThree();
  sceneRef.current = scene;
  return null;
}

// Piramide wireframe (solo bordi) con spin - Standard: forma 1.5 unità, bordi 20px
function WireframePyramid({ isAnimating }: { isAnimating: boolean }) {
  const { size } = useThree();
  const pyramidRef = useRef<THREE.Group>(null);

  const line2 = useMemo(() => {
    // Crea geometria piramide (tetraedro con base quadrata)
    // Usa ConeGeometry con 4 segmenti radiali per creare una piramide a base quadrata
    const pyramidGeom = new THREE.ConeGeometry(1.41, 2.0, 4); // raggio ~1.41 per avere diagonale ~2.0 (aumentato di 0.5 unità)
    pyramidGeom.rotateY(Math.PI / 4); // Ruota per allineare i bordi
    // Sposta la geometria verso il basso per centrare l'icona nel mezzo visivo della piramide
    pyramidGeom.translate(0, 0.25, 0);

    const edges = new THREE.EdgesGeometry(pyramidGeom);
    const positions = edges.attributes.position.array as Float32Array;

    // Crea LineSegmentsGeometry per Line2
    const lineGeom = new LineSegmentsGeometry();
    lineGeom.setPositions(positions);

    // Materiale con spessore standard 20px, colore bianco
    const material = new LineMaterial({
      color: 0xffffff,
      linewidth: 20,
      worldUnits: false,
    });
    material.resolution.set(size.width, size.height);

    return new LineSegments2(lineGeom, material);
  }, [size]);

  // Animazione spin (solo se isAnimating è true)
  useFrame((_, delta) => {
    if (pyramidRef.current && isAnimating) {
      pyramidRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={pyramidRef}>
      <primitive object={line2} />
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

      {/* Piramide wireframe bianca */}
      <WireframePyramid isAnimating={isAnimating} />
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
