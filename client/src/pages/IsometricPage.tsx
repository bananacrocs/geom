import { useEffect } from 'react';
import { ArrowLeft, Download, Box, Minus, Shapes } from 'lucide-react';
import { useIsometricStore } from '../stores/isometricStore';
import { generateAllCubes } from '../utils/isometricCubes';
import { generateAllDecorations } from '../utils/isometricDecorations';
import { generateAllShapes } from '../utils/isometricShapes';
import { CubeCard, DecorationCard, ShapeCard } from '../components/Isometric';

interface IsometricPageProps {
  onBack: () => void;
}

export function IsometricPage({ onBack }: IsometricPageProps) {
  const { cubes, decorations, shapes, setCubes, setDecorations, setShapes } = useIsometricStore();

  // Genera tutti i cubi, decorazioni e shapes al mount
  useEffect(() => {
    const allCubes = generateAllCubes();
    const allDecorations = generateAllDecorations();
    const allShapes = generateAllShapes();
    setCubes(allCubes);
    setDecorations(allDecorations);
    setShapes(allShapes);
  }, [setCubes, setDecorations, setShapes]);

  // Funzione per scaricare tutti come ZIP
  const handleDownloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const cubesSvgFolder = zip.folder('cubes/svg');
    const cubesPngFolder = zip.folder('cubes/png');
    const decoSvgFolder = zip.folder('decorations/svg');
    const decoPngFolder = zip.folder('decorations/png');
    const shapesSvgFolder = zip.folder('shapes/svg');
    const shapesPngFolder = zip.folder('shapes/png');

    const scales = [1, 2, 3];

    // Aggiungi Cubi
    for (const cube of cubes) {
      cubesSvgFolder?.file(`${cube.id}.svg`, cube.svg);
      for (const scale of scales) {
        const pngData = await svgToPngBase64(cube.svg, cube.width, cube.height, scale);
        cubesPngFolder?.file(`${cube.id}@${scale}x.png`, pngData, { base64: true });
      }
    }

    // Aggiungi Decorazioni
    for (const deco of decorations) {
      decoSvgFolder?.file(`${deco.id}.svg`, deco.svg);
      for (const scale of scales) {
        const pngData = await svgToPngBase64(deco.svg, deco.width, deco.height, scale);
        decoPngFolder?.file(`${deco.id}@${scale}x.png`, pngData, { base64: true });
      }
    }

    // Aggiungi Shapes
    for (const shape of shapes) {
      shapesSvgFolder?.file(`${shape.id}.svg`, shape.svg);
      for (const scale of scales) {
        const pngData = await svgToPngBase64(shape.svg, shape.width, shape.height, scale);
        shapesPngFolder?.file(`${shape.id}@${scale}x.png`, pngData, { base64: true });
      }
    }

    // Download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'isometric-collection.zip';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="h-14 px-6 flex items-center justify-between bg-[#1a1a1a] border-b border-[#252525] sticky top-0 z-10">
        {/* Left - Back button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-[#252525] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center gap-2 text-xs"
          >
            <ArrowLeft size={14} />
            Indietro
          </button>
        </div>

        {/* Center - Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#252525] border border-[#333] rounded-lg flex items-center justify-center">
            <Box size={16} className="text-blue-500" />
          </div>
          <span className="text-sm font-semibold text-white">Isometric Collection</span>
        </div>

        {/* Right - Download All */}
        <button
          onClick={handleDownloadAll}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all flex items-center gap-2 text-xs"
        >
          <Download size={14} />
          Scarica Tutto
        </button>
      </header>

      {/* Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Sezione Cubi */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-[#252525] border border-[#333] rounded flex items-center justify-center">
              <Box size={12} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Cubes</h2>
            <span className="text-xs text-gray-500">({cubes.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cubes.map(cube => (
              <CubeCard key={cube.id} cube={cube} />
            ))}
          </div>
        </section>

        {/* Sezione Decorazioni */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-[#252525] border border-[#333] rounded flex items-center justify-center">
              <Minus size={12} className="text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Decorations</h2>
            <span className="text-xs text-gray-500">({decorations.length})</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {decorations.map(decoration => (
              <DecorationCard key={decoration.id} decoration={decoration} />
            ))}
          </div>
        </section>

        {/* Sezione Shapes */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-[#252525] border border-[#333] rounded flex items-center justify-center">
              <Shapes size={12} className="text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Tech Shapes</h2>
            <span className="text-xs text-gray-500">({shapes.length})</span>
          </div>

          {/* Geometric */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-blue-400 mb-3">Geometric</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {shapes.filter(s => s.category === 'geometric').map(shape => (
                <ShapeCard key={shape.id} shape={shape} />
              ))}
            </div>
          </div>

          {/* Tech */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-green-400 mb-3">Tech</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {shapes.filter(s => s.category === 'tech').map(shape => (
                <ShapeCard key={shape.id} shape={shape} />
              ))}
            </div>
          </div>

          {/* UI */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-purple-400 mb-3">UI Elements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {shapes.filter(s => s.category === 'ui').map(shape => (
                <ShapeCard key={shape.id} shape={shape} />
              ))}
            </div>
          </div>

          {/* Badge */}
          <div>
            <h3 className="text-sm font-medium text-orange-400 mb-3">Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {shapes.filter(s => s.category === 'badge').map(shape => (
                <ShapeCard key={shape.id} shape={shape} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * Converte SVG a PNG base64
 */
function svgToPngBase64(svgString: string, width: number, height: number, scale: number): Promise<string> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    canvas.width = width * scale;
    canvas.height = height * scale;

    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl.split(',')[1]);
    };

    img.onerror = () => {
      resolve('');
    };

    img.src = url;
  });
}
