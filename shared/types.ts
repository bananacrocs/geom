// Configurazione di una singola faccia
export interface FaceConfig {
  color: string;
  opacity: number;
  borderColor: string;
  borderWidth: number;
  shadowIntensity: number;
  isVisible: boolean;
}

// Configurazione bordi globali
export interface BorderConfig {
  visible: boolean;
  color: string;
  width: number; // 1-10
}

// Configurazione della rotazione
export interface RotationConfig {
  axis: 'x' | 'y' | 'z';
  speed: number; // 0-10
  direction: 'clockwise' | 'counterclockwise';
  isPlaying: boolean;
}

// Configurazione dell'icona centrale
export interface IconConfig {
  type: 'lucide' | 'custom' | 'image';
  name?: string; // Nome icona Lucide
  svgContent?: string; // SVG custom uploadato
  imageUrl?: string; // URL immagine (dataUrl o URL esterno)
  size: number;
  color: string;
}

// Configurazione della forma geometrica
export interface ShapeConfig {
  faces: number; // 4-20
  faceConfigs: FaceConfig[];
  rotation: RotationConfig;
  icon: IconConfig | null;
  scale: number;
}

// Configurazione export GIF
export interface GifExportConfig {
  duration: number; // secondi per loop
  fps: number; // 10-60
  width: number;
  height: number;
  quality: number; // 1-20 (lower = better)
}

// Configurazione export generale
export interface ExportConfig {
  format: 'png' | 'svg' | 'gif' | 'glb';
  width: number;
  height: number;
  backgroundColor: string;
  gifConfig?: GifExportConfig;
}

// Request per l'API di export
export interface ExportRequest {
  shape: ShapeConfig;
  export: ExportConfig;
}

// Response dell'API di export
export interface ExportResponse {
  success: boolean;
  data?: string; // Base64 encoded
  mimeType?: string;
  error?: string;
}
