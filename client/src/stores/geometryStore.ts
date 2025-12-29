import { create } from 'zustand';
import type { ShapeConfig, FaceConfig, RotationConfig, IconConfig, ExportConfig, GifExportConfig, BorderConfig } from '../types';

// Colori default per le facce
const defaultFaceColors = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
];

const createDefaultFaceConfig = (index: number): FaceConfig => ({
  color: defaultFaceColors[index % defaultFaceColors.length],
  opacity: 1,
  borderColor: '#000000',
  borderWidth: 1,
  shadowIntensity: 0.5,
  isVisible: true,
});

// Il numero di facce geometriche reali (non triangoli della mesh)
// Tetraedro: 4, Cubo: 6, Ottaedro: 8, Dodecaedro: 12, Icosaedro: 20
const createFaceConfigs = (faces: number): FaceConfig[] => {
  return Array.from({ length: faces }, (_, i) => createDefaultFaceConfig(i));
};

const defaultBorderConfig: BorderConfig = {
  visible: true,
  color: '#000000',
  width: 2,
};

interface GeometryState {
  // Shape configuration
  shape: ShapeConfig;

  // Border configuration (global)
  borderConfig: BorderConfig;

  // Export configuration
  exportConfig: ExportConfig;

  // Theme
  isDarkMode: boolean;

  // Actions - Shape
  setFaces: (faces: number) => void;
  setFaceConfig: (index: number, config: Partial<FaceConfig>) => void;
  setAllFacesColor: (color: string) => void;
  toggleFaceVisibility: (index: number) => void;
  setAllFacesVisibility: (visible: boolean) => void;
  setRotation: (config: Partial<RotationConfig>) => void;
  toggleRotation: () => void;
  setIcon: (icon: IconConfig | null) => void;
  setScale: (scale: number) => void;

  // Actions - Border
  setBorderConfig: (config: Partial<BorderConfig>) => void;
  toggleBorderVisibility: () => void;

  // Actions - Export
  setExportConfig: (config: Partial<ExportConfig>) => void;
  setGifConfig: (config: Partial<GifExportConfig>) => void;

  // Actions - Theme
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;

  // Reset
  resetShape: () => void;
}

const defaultShape: ShapeConfig = {
  faces: 6,
  faceConfigs: createFaceConfigs(6),
  rotation: {
    axis: 'y',
    speed: 2,
    direction: 'clockwise',
    isPlaying: true,
  },
  icon: null,
  scale: 1,
};

const defaultExportConfig: ExportConfig = {
  format: 'png',
  width: 512,
  height: 512,
  backgroundColor: 'transparent',
  gifConfig: {
    duration: 2,
    fps: 30,
    width: 512,
    height: 512,
    quality: 10,
  },
};

export const useGeometryStore = create<GeometryState>((set, get) => ({
  shape: defaultShape,
  borderConfig: defaultBorderConfig,
  exportConfig: defaultExportConfig,
  isDarkMode: typeof window !== 'undefined'
    ? localStorage.getItem('darkMode') === 'true'
    : false,

  setFaces: (faces) => {
    set((state) => {
      // Prendi le proprietà "globali" dalla prima faccia esistente (o default)
      const previousConfig = state.shape.faceConfigs[0] || createDefaultFaceConfig(0);
      const globalProps = {
        opacity: previousConfig.opacity,
        isVisible: previousConfig.isVisible,
      };

      // Crea nuove configurazioni preservando le proprietà globali
      const newConfigs = Array.from({ length: faces }, (_, i) => ({
        ...createDefaultFaceConfig(i),
        ...globalProps,
      }));

      return {
        shape: {
          ...state.shape,
          faces,
          faceConfigs: newConfigs,
        },
      };
    });
  },

  setFaceConfig: (index, config) => {
    set((state) => {
      const newConfigs = [...state.shape.faceConfigs];
      if (newConfigs[index]) {
        newConfigs[index] = { ...newConfigs[index], ...config };
      }
      return {
        shape: {
          ...state.shape,
          faceConfigs: newConfigs,
        },
      };
    });
  },

  setAllFacesColor: (color) => {
    set((state) => ({
      shape: {
        ...state.shape,
        faceConfigs: state.shape.faceConfigs.map((fc) => ({
          ...fc,
          color,
        })),
      },
    }));
  },

  toggleFaceVisibility: (index) => {
    set((state) => {
      const newConfigs = [...state.shape.faceConfigs];
      if (newConfigs[index]) {
        newConfigs[index] = {
          ...newConfigs[index],
          isVisible: !newConfigs[index].isVisible,
        };
      }
      return {
        shape: {
          ...state.shape,
          faceConfigs: newConfigs,
        },
      };
    });
  },

  setAllFacesVisibility: (visible) => {
    set((state) => ({
      shape: {
        ...state.shape,
        faceConfigs: state.shape.faceConfigs.map((fc) => ({
          ...fc,
          isVisible: visible,
        })),
      },
    }));
  },

  setRotation: (config) => {
    set((state) => ({
      shape: {
        ...state.shape,
        rotation: { ...state.shape.rotation, ...config },
      },
    }));
  },

  toggleRotation: () => {
    set((state) => ({
      shape: {
        ...state.shape,
        rotation: {
          ...state.shape.rotation,
          isPlaying: !state.shape.rotation.isPlaying,
        },
      },
    }));
  },

  setIcon: (icon) => {
    set((state) => ({
      shape: {
        ...state.shape,
        icon,
      },
    }));
  },

  setScale: (scale) => {
    set((state) => ({
      shape: {
        ...state.shape,
        scale,
      },
    }));
  },

  setBorderConfig: (config) => {
    set((state) => ({
      borderConfig: { ...state.borderConfig, ...config },
    }));
  },

  toggleBorderVisibility: () => {
    set((state) => ({
      borderConfig: {
        ...state.borderConfig,
        visible: !state.borderConfig.visible,
      },
    }));
  },

  setExportConfig: (config) => {
    set((state) => ({
      exportConfig: { ...state.exportConfig, ...config },
    }));
  },

  setGifConfig: (config) => {
    set((state) => ({
      exportConfig: {
        ...state.exportConfig,
        gifConfig: { ...state.exportConfig.gifConfig!, ...config },
      },
    }));
  },

  toggleDarkMode: () => {
    const newValue = !get().isDarkMode;
    localStorage.setItem('darkMode', String(newValue));
    set({ isDarkMode: newValue });
  },

  setDarkMode: (isDark) => {
    localStorage.setItem('darkMode', String(isDark));
    set({ isDarkMode: isDark });
  },

  resetShape: () => {
    set({
      shape: defaultShape,
      borderConfig: defaultBorderConfig,
    });
  },
}));
