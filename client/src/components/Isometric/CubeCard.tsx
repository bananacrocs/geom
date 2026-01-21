import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { IsometricCubeConfig } from '../../stores/isometricStore';
import { useIsometricStore, EXPORT_SCALES } from '../../stores/isometricStore';

interface CubeCardProps {
  cube: IsometricCubeConfig;
}

export function CubeCard({ cube }: CubeCardProps) {
  const [copied, setCopied] = useState(false);
  const [showScaleMenu, setShowScaleMenu] = useState(false);
  const exportScale = useIsometricStore((state) => state.exportScale);

  const handleCopySVG = async () => {
    try {
      await navigator.clipboard.writeText(cube.svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([cube.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${cube.id}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = (scale: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cube.width * scale;
    canvas.height = cube.height * scale;

    const img = new Image();
    const blob = new Blob([cube.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${cube.id}@${scale}x.png`;
      link.click();
    };

    img.src = url;
    setShowScaleMenu(false);
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden hover:border-[#444] hover:shadow-lg transition-all group">
      {/* Preview */}
      <div
        className="h-40 flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)' }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: cube.svg }}
        />
      </div>

      {/* Info & Actions */}
      <div className="p-4 border-t border-[#333]">
        <h3 className="text-sm font-medium text-white mb-3">{cube.name}</h3>

        <div className="flex items-center gap-2">
          {/* Copy SVG */}
          <button
            onClick={handleCopySVG}
            className="flex-1 px-3 py-2 bg-[#252525] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2 text-xs"
            title="Copia SVG"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copiato!' : 'SVG'}
          </button>

          {/* Download SVG */}
          <button
            onClick={handleDownloadSVG}
            className="px-3 py-2 bg-[#252525] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2 text-xs"
            title="Scarica SVG"
          >
            <Download size={14} />
          </button>

          {/* Download PNG with scale selection */}
          <div className="relative">
            <button
              onClick={() => setShowScaleMenu(!showScaleMenu)}
              className="px-3 py-2 bg-[#252525] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-1 text-xs"
              title="Scarica PNG"
            >
              PNG
              <span className="text-[10px] text-gray-500">{exportScale}x</span>
            </button>

            {showScaleMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#252525] border border-[#333] rounded-lg overflow-hidden shadow-xl z-10">
                {EXPORT_SCALES.map(({ scale, label }) => (
                  <button
                    key={scale}
                    onClick={() => handleDownloadPNG(scale)}
                    className="block w-full px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all text-left"
                  >
                    {label} ({cube.width * scale}x{cube.height * scale})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
