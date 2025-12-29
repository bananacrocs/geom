// @ts-expect-error - gif.js non ha tipi TypeScript
import GIF from 'gif.js';

interface GifExportOptions {
  width: number;
  height: number;
  duration: number; // secondi
  fps: number;
  quality: number; // 1-20
}

/**
 * Esporta una GIF animata catturando frame dal canvas Three.js
 */
export async function exportGif(
  canvas: HTMLCanvasElement,
  options: GifExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { width, height, duration, fps, quality } = options;
  const totalFrames = Math.floor(duration * fps);
  const delayPerFrame = Math.floor(1000 / fps);

  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality,
      width,
      height,
      workerScript: '/gif.worker.js',
    });

    // Cattura i frame
    const captureFrames = async () => {
      for (let i = 0; i < totalFrames; i++) {
        // Attendi un po' per permettere l'aggiornamento del canvas
        await new Promise((r) => setTimeout(r, delayPerFrame));

        // Crea un canvas temporaneo per ridimensionare
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(canvas, 0, 0, width, height);
          gif.addFrame(tempCanvas, { delay: delayPerFrame, copy: true });
        }

        if (onProgress) {
          onProgress((i + 1) / totalFrames);
        }
      }

      gif.render();
    };

    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });

    gif.on('error', (error: Error) => {
      reject(error);
    });

    captureFrames().catch(reject);
  });
}

/**
 * Esporta una GIF creando frame manualmente da una funzione di rendering
 */
export async function exportGifWithRenderer(
  renderFrame: (frameIndex: number, totalFrames: number) => HTMLCanvasElement,
  options: GifExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { width, height, duration, fps, quality } = options;
  const totalFrames = Math.floor(duration * fps);
  const delayPerFrame = Math.floor(1000 / fps);

  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality,
      width,
      height,
      workerScript: '/gif.worker.js',
    });

    // Genera tutti i frame
    for (let i = 0; i < totalFrames; i++) {
      const frameCanvas = renderFrame(i, totalFrames);
      gif.addFrame(frameCanvas, { delay: delayPerFrame, copy: true });

      if (onProgress) {
        onProgress((i + 1) / totalFrames * 0.5); // Prima metà del progresso
      }
    }

    gif.on('progress', (p: number) => {
      if (onProgress) {
        onProgress(0.5 + p * 0.5); // Seconda metà del progresso
      }
    });

    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });

    gif.on('error', (error: Error) => {
      reject(error);
    });

    gif.render();
  });
}
