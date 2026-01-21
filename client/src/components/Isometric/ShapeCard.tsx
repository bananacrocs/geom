import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { ShapeConfig } from '../../stores/isometricStore';
import { EXPORT_SCALES } from '../../stores/isometricStore';

interface ShapeCardProps {
  shape: ShapeConfig;
}

export function ShapeCard({ shape }: ShapeCardProps) {
  const [copied, setCopied] = useState(false);
  const [showScaleMenu, setShowScaleMenu] = useState(false);

  const handleCopySVG = async () => {
    try {
      await navigator.clipboard.writeText(shape.svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([shape.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${shape.id}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = (scale: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = shape.width * scale;
    canvas.height = shape.height * scale;

    const img = new Image();
    const blob = new Blob([shape.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${shape.id}@${scale}x.png`;
      link.click();
    };

    img.src = url;
    setShowScaleMenu(false);
  };

  // Colore della categoria
  const categoryColors: Record<string, string> = {
    geometric: 'text-blue-400',
    tech: 'text-green-400',
    ui: 'text-purple-400',
    badge: 'text-orange-400',
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden hover:border-[#444] hover:shadow-lg transition-all group">
      {/* Preview */}
      <div
        className="h-24 flex items-center justify-center p-3"
        style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)' }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: shape.svg }}
        />
      </div>

      {/* Info & Actions */}
      <div className="p-3 border-t border-[#333]">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xs font-medium text-white">{shape.name}</h3>
          <span className={`text-[9px] ${categoryColors[shape.category] || 'text-gray-400'}`}>
            {shape.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy SVG */}
          <button
            onClick={handleCopySVG}
            className="flex-1 px-2 py-1.5 bg-[#252525] border border-[#333] rounded text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-1.5 text-[10px]"
            title="Copia SVG"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            {copied ? 'OK' : 'SVG'}
          </button>

          {/* Download SVG */}
          <button
            onClick={handleDownloadSVG}
            className="px-2 py-1.5 bg-[#252525] border border-[#333] rounded text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center text-[10px]"
            title="Scarica SVG"
          >
            <Download size={12} />
          </button>

          {/* Download PNG with scale selection */}
          <div className="relative">
            <button
              onClick={() => setShowScaleMenu(!showScaleMenu)}
              className="px-2 py-1.5 bg-[#252525] border border-[#333] rounded text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-1 text-[10px]"
              title="Scarica PNG"
            >
              PNG
            </button>

            {showScaleMenu && (
              <div className="absolute bottom-full left-0 mb-1 bg-[#252525] border border-[#333] rounded overflow-hidden shadow-xl z-10">
                {EXPORT_SCALES.map(({ scale, label }) => (
                  <button
                    key={scale}
                    onClick={() => handleDownloadPNG(scale)}
                    className="block w-full px-3 py-1.5 text-[10px] text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all text-left whitespace-nowrap"
                  >
                    {label}
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
