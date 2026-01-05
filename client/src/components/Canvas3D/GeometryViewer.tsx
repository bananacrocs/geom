import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ParametricShape } from './ParametricShape';
import { CenterIcon } from './CenterIcon';
import { useGeometryStore } from '../../stores/geometryStore';

interface GeometryViewerProps {
  className?: string;
  onSceneReady?: (scene: THREE.Scene) => void;
}

// Componente per esporre la scena
function SceneExporter({ onSceneReady }: { onSceneReady?: (scene: THREE.Scene) => void }) {
  const { scene } = useThree();
  const callbackRef = useRef(onSceneReady);
  callbackRef.current = onSceneReady;

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(scene);
    }
  }, [scene]);

  return null;
}

// Componente interno per la scena
function Scene({ onSceneReady }: { onSceneReady?: (scene: THREE.Scene) => void }) {
  const shape = useGeometryStore((state) => state.shape);

  return (
    <>
      <SceneExporter onSceneReady={onSceneReady} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

      {/* Controlli orbitali */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={10}
      />

      {/* Illuminazione */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />

      {/* Forma geometrica */}
      <ParametricShape config={shape} />

      {/* Icona centrale */}
      {shape.icon && <CenterIcon config={shape.icon} />}
    </>
  );
}

export function GeometryViewer({ className, onSceneReady }: GeometryViewerProps) {
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <Canvas
        gl={{
          preserveDrawingBuffer: true, // Necessario per export
          antialias: true,
        }}
        style={{
          background: '#767676',
        }}
      >
        <Scene onSceneReady={onSceneReady} />
      </Canvas>
    </div>
  );
}
