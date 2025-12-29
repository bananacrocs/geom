import { useMemo } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import type { IconConfig } from '../../types';

interface CenterIconProps {
  config: IconConfig;
}

// Componente per renderizzare SVG come geometria 3D vettoriale
function SvgIcon({ svgContent, size, color }: { svgContent: string; size: number; color: string }) {
  // Parsa l'SVG e estrai le shapes
  const { shapes, center, svgSize } = useMemo(() => {
    const loader = new SVGLoader();
    const data = loader.parse(svgContent);

    // Estrai tutte le shapes dai path
    const allShapes: THREE.Shape[] = [];
    data.paths.forEach((path) => {
      const pathShapes = SVGLoader.createShapes(path);
      allShapes.push(...pathShapes);
    });

    // Calcola bounding box per centrare
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    allShapes.forEach((shape) => {
      shape.getPoints().forEach((pt) => {
        minX = Math.min(minX, pt.x);
        minY = Math.min(minY, pt.y);
        maxX = Math.max(maxX, pt.x);
        maxY = Math.max(maxY, pt.y);
      });
    });

    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return {
      shapes: allShapes,
      center: { x: centerX, y: centerY },
      svgSize: { width, height }
    };
  }, [svgContent]);

  // Scala basata sulla dimensione configurata
  const scale = (size / 100) / Math.max(svgSize.width, svgSize.height);

  if (shapes.length === 0) {
    return null;
  }

  return (
    <group scale={[scale, -scale, scale]} position={[0, 0, 0]}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={[-center.x, -center.y, 0]}>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>
      ))}
    </group>
  );
}

export function CenterIcon({ config }: CenterIconProps) {
  // Supportiamo SVG custom come geometria 3D
  if (config.type === 'custom' && config.svgContent) {
    return <SvgIcon svgContent={config.svgContent} size={config.size} color={config.color} />;
  }

  return null;
}
