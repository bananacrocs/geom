import type { ExportRequest } from '../../../shared/types.js';
/**
 * Genera un SVG rappresentante la forma geometrica
 * Nota: Questa è una proiezione 2D semplificata
 */
export declare function generateSvg(request: ExportRequest): Promise<string>;
