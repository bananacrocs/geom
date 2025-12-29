import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { createPolyhedronGeometry } from '../../utils/geometryGenerator';
import { useGeometryStore } from '../../stores/geometryStore';
import type { ShapeConfig } from '../../types';

interface ParametricShapeProps {
  config: ShapeConfig;
}

export function ParametricShape({ config }: ParametricShapeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Ottieni borderConfig dallo store
  const borderConfig = useGeometryStore((state) => state.borderConfig);

  // Ottieni le dimensioni del canvas per LineMaterial
  const { size } = useThree();

  // Genera la geometria basata sul numero di facce
  const geometry = useMemo(() => {
    const geom = createPolyhedronGeometry(config.faces);
    // Assicurati che la geometria non sia indicizzata per poter colorare ogni faccia
    return geom.toNonIndexed();
  }, [config.faces]);

  // Mappa triangoli della mesh → facce geometriche reali
  // Cubo: 6 facce, 12 triangoli (2 per faccia)
  // Dodecaedro: 12 facce, 36 triangoli (3 per faccia, pentagoni)
  // Altri: 1 triangolo per faccia
  const getTrianglesPerFace = (faces: number): number => {
    switch (faces) {
      case 6: return 2;   // Cubo: 2 triangoli per faccia quadrata
      case 12: return 3;  // Dodecaedro: 3 triangoli per faccia pentagonale
      default: return 1;  // Tetraedro, Ottaedro, Icosaedro: 1 triangolo per faccia
    }
  };

  // Genera i colori e le opacità per ogni vertice basati sulla configurazione facce
  const { colors, alphas } = useMemo(() => {
    const position = geometry.getAttribute('position');
    const vertexCount = position.count;
    const triangleCount = vertexCount / 3;
    const colorArray = new Float32Array(vertexCount * 3);
    const alphaArray = new Float32Array(vertexCount);

    const trianglesPerFace = getTrianglesPerFace(config.faces);
    const geometricFaceCount = config.faceConfigs.length;

    for (let i = 0; i < triangleCount; i++) {
      // Mappa il triangolo alla faccia geometrica corrispondente
      const geometricFaceIndex = Math.floor(i / trianglesPerFace) % geometricFaceCount;
      const faceConfig = config.faceConfigs[geometricFaceIndex];
      const color = new THREE.Color(faceConfig.color);

      // Se la faccia non è visibile, rendiamola trasparente
      const effectiveAlpha = faceConfig.isVisible ? faceConfig.opacity : 0;

      for (let j = 0; j < 3; j++) {
        const vertexIndex = i * 3 + j;
        colorArray[vertexIndex * 3] = color.r;
        colorArray[vertexIndex * 3 + 1] = color.g;
        colorArray[vertexIndex * 3 + 2] = color.b;
        alphaArray[vertexIndex] = effectiveAlpha;
      }
    }

    return { colors: colorArray, alphas: alphaArray };
  }, [geometry, config.faceConfigs, config.faces]);

  // Verifica se ci sono facce con opacità < 1 o facce nascoste
  const hasTransparency = useMemo(() => {
    return config.faceConfigs.some((fc) => !fc.isVisible || fc.opacity < 1);
  }, [config.faceConfigs]);

  // Aggiorna attributi della geometria
  useEffect(() => {
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  }, [geometry, colors, alphas]);

  // Geometria per gli edge (bordi) usando LineSegmentsGeometry per Line2
  const lineGeometry = useMemo(() => {
    const baseGeom = createPolyhedronGeometry(config.faces);
    const edges = new THREE.EdgesGeometry(baseGeom);
    const positions = edges.attributes.position.array as Float32Array;

    const lineGeom = new LineSegmentsGeometry();
    lineGeom.setPositions(positions);
    return lineGeom;
  }, [config.faces]);

  // LineMaterial - creato una sola volta, aggiornato via useEffect
  const lineMaterial = useMemo(() => {
    const mat = new LineMaterial({
      color: new THREE.Color(borderConfig.color).getHex(),
      linewidth: borderConfig.width,
      worldUnits: false,
    });
    mat.resolution.set(size.width, size.height);
    return mat;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineGeometry]); // Ricrea solo quando cambia la geometria (forma)

  // Aggiorna colore e spessore senza ricreare l'oggetto
  useEffect(() => {
    lineMaterial.color.set(borderConfig.color);
    lineMaterial.linewidth = borderConfig.width;
    lineMaterial.needsUpdate = true;
  }, [lineMaterial, borderConfig.color, borderConfig.width]);

  // Aggiorna la resolution del materiale quando cambia la dimensione
  useEffect(() => {
    lineMaterial.resolution.set(size.width, size.height);
  }, [lineMaterial, size]);

  // Crea l'oggetto Line2 - solo quando cambia la geometria
  const line2Object = useMemo(() => {
    return new Line2(lineGeometry, lineMaterial);
  }, [lineGeometry, lineMaterial]);

  // Animazione rotazione - ruota il gruppo padre
  useFrame((_, delta) => {
    if (!groupRef.current || !config.rotation.isPlaying) return;

    const speed = config.rotation.speed * 0.5;
    const direction = config.rotation.direction === 'clockwise' ? 1 : -1;
    const rotationAmount = speed * direction * delta;

    switch (config.rotation.axis) {
      case 'x': groupRef.current.rotation.x += rotationAmount; break;
      case 'y': groupRef.current.rotation.y += rotationAmount; break;
      case 'z': groupRef.current.rotation.z += rotationAmount; break;
    }
  });

  // Shader material personalizzato per gestire opacità per vertice
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        attribute float alpha;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          if (vAlpha < 0.01) discard;
          gl_FragColor = vec4(vColor, vAlpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: !hasTransparency,
    });
  }, [hasTransparency]);

  return (
    <group scale={config.scale}>
      {/* Gruppo ruotante - contiene mesh e bordi sincronizzati */}
      <group ref={groupRef}>
        {/* Forma principale con shader custom */}
        <mesh geometry={geometry} material={shaderMaterial} />

        {/* Bordi globali con Line2 (supporta spessore reale) */}
        {borderConfig.visible && borderConfig.width > 0 && (
          <primitive object={line2Object} />
        )}
      </group>
    </group>
  );
}
