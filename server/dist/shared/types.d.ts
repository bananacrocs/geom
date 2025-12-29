export interface FaceConfig {
    color: string;
    opacity: number;
    borderColor: string;
    borderWidth: number;
    shadowIntensity: number;
    isVisible: boolean;
}
export interface BorderConfig {
    visible: boolean;
    color: string;
    width: number;
}
export interface RotationConfig {
    axis: 'x' | 'y' | 'z';
    speed: number;
    direction: 'clockwise' | 'counterclockwise';
    isPlaying: boolean;
}
export interface IconConfig {
    type: 'lucide' | 'custom';
    name?: string;
    svgContent?: string;
    size: number;
    color: string;
}
export interface ShapeConfig {
    faces: number;
    faceConfigs: FaceConfig[];
    rotation: RotationConfig;
    icon: IconConfig | null;
    scale: number;
}
export interface GifExportConfig {
    duration: number;
    fps: number;
    width: number;
    height: number;
    quality: number;
}
export interface ExportConfig {
    format: 'png' | 'svg' | 'gif';
    width: number;
    height: number;
    backgroundColor: string;
    gifConfig?: GifExportConfig;
}
export interface ExportRequest {
    shape: ShapeConfig;
    export: ExportConfig;
}
export interface ExportResponse {
    success: boolean;
    data?: string;
    mimeType?: string;
    error?: string;
}
