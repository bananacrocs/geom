import { create } from 'zustand';

// Tipi per cubi isometrici
export interface IsometricCubeConfig {
  id: string;
  name: string;
  type: 'solid' | 'wireframe' | 'dashed' | 'connectors' | 'stack' | 'side-by-side' | 'nested' | 'shadow' | 'pyramid' | 'orbit' | 'database' | 'exploded';
  svg: string;
  width: number;
  height: number;
}

// Tipi per decorazioni
export interface DecorationConfig {
  id: string;
  name: string;
  svg: string;
  width: number;
  height: number;
}

// Tipi per forme tech
export interface ShapeConfig {
  id: string;
  name: string;
  category: 'geometric' | 'tech' | 'ui' | 'badge';
  svg: string;
  width: number;
  height: number;
}

export interface ExportScale {
  scale: number;
  label: string;
}

interface IsometricState {
  // Cubi disponibili
  cubes: IsometricCubeConfig[];

  // Decorazioni disponibili
  decorations: DecorationConfig[];

  // Forme tech disponibili
  shapes: ShapeConfig[];

  // Cubo selezionato per export
  selectedCubeId: string | null;

  // Scala export PNG
  exportScale: number;

  // Actions
  setCubes: (cubes: IsometricCubeConfig[]) => void;
  setDecorations: (decorations: DecorationConfig[]) => void;
  setShapes: (shapes: ShapeConfig[]) => void;
  setSelectedCube: (id: string | null) => void;
  setExportScale: (scale: number) => void;
}

export const EXPORT_SCALES: ExportScale[] = [
  { scale: 1, label: '1x' },
  { scale: 2, label: '2x' },
  { scale: 3, label: '3x' },
];

export const useIsometricStore = create<IsometricState>((set) => ({
  cubes: [],
  decorations: [],
  shapes: [],
  selectedCubeId: null,
  exportScale: 2,

  setCubes: (cubes) => set({ cubes }),
  setDecorations: (decorations) => set({ decorations }),
  setShapes: (shapes) => set({ shapes }),
  setSelectedCube: (id) => set({ selectedCubeId: id }),
  setExportScale: (scale) => set({ exportScale: scale }),
}));
