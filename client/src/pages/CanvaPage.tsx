import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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

// Cubo wireframe (solo bordi)
function WireframeCube() {
  const { size } = useThree();

  const line2 = useMemo(() => {
    // Crea geometria cubo
    const boxGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const edges = new THREE.EdgesGeometry(boxGeom);
    const positions = edges.attributes.position.array as Float32Array;

    // Crea LineSegmentsGeometry per Line2
    const lineGeom = new LineSegmentsGeometry();
    lineGeom.setPositions(positions);

    // Materiale con spessore aumentato per matchare il tick, colore bianco
    const material = new LineMaterial({
      color: 0xffffff,
      linewidth: 20,
      worldUnits: false,
    });
    material.resolution.set(size.width, size.height);

    return new LineSegments2(lineGeom, material);
  }, [size]);

  return <primitive object={line2} />;
}

// Tick icon caricato da file FBX
function TickIcon() {
  const [tickModel, setTickModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('/models/tick.fbx', (fbx) => {
      // Applica colore #2EBAEB a tutti i materiali
      const targetColor = new THREE.Color(0x2EBAEB);
      fbx.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: targetColor,
            side: THREE.DoubleSide
          });
        }
      });

      // Calcola bounding box
      const box = new THREE.Box3().setFromObject(fbx);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Scala per entrare nel cubo (0.8 unità max per lasciare margine nel cubo da 1.5)
      if (maxDim > 0) {
        const targetSize = 1.0;
        const scaleFactor = targetSize / maxDim;
        fbx.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }

      // Ricalcola box dopo scaling e centra
      const newBox = new THREE.Box3().setFromObject(fbx);
      const center = newBox.getCenter(new THREE.Vector3());
      fbx.position.set(-center.x, -center.y, -center.z);

      setTickModel(fbx);
    }, undefined, (error) => {
      console.error('Errore caricamento tick.fbx:', error);
    });
  }, []);

  if (!tickModel) return null;
  return <primitive object={tickModel} />;
}

// Scena 3D
function Scene({ sceneRef }: { sceneRef: React.MutableRefObject<THREE.Scene | null> }) {
  return (
    <>
      <SceneRef sceneRef={sceneRef} />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <OrbitControls enablePan={true} enableZoom={true} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />

      {/* Cubo wireframe bianco */}
      <WireframeCube />

      {/* Tick icon al centro */}
      <TickIcon />
    </>
  );
}

export function CanvaPage({ onBack }: CanvaPageProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        sceneRef.current?.add(model);
        URL.revokeObjectURL(url);
      }, undefined, (error) => {
        console.error('GLTF load error:', error);
        alert('Errore nel caricamento del file GLB/GLTF');
        URL.revokeObjectURL(url);
      });
    } else {
      alert('Formato non supportato. Usa FBX, GLB o GLTF.');
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

  return (
    <div className="h-screen w-screen relative">
      {/* Canvas 3D */}
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        style={{ background: '#767676' }}
      >
        <Scene sceneRef={sceneRef} />
      </Canvas>

      {/* Bottone Indietro */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white hover:bg-[#252525] transition-all flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Indietro
      </button>

      {/* Bottoni a destra */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Input file nascosto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".fbx,.glb,.gltf"
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
      </div>
    </div>
  );
}
