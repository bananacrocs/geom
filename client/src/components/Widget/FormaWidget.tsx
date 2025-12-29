import { useRef } from 'react';
import { Upload, X, Image, Pipette } from 'lucide-react';
import { Widget } from './Widget';
import { SliderControl } from './SliderControl';
import { useGeometryStore } from '../../stores/geometryStore';

const ICON_PRESET_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
];

const SHAPES = [
  { faces: 4, name: 'Tetra' },
  { faces: 6, name: 'Cubo' },
  { faces: 8, name: 'Otta' },
  { faces: 12, name: 'Dodeca' },
  { faces: 20, name: 'Icosa' },
];

export function FormaWidget() {
  const { shape, setFaces, setScale, setIcon } = useGeometryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target?.result as string;
        setIcon({
          type: 'custom',
          svgContent: svgContent,
          size: 50,
          color: '#ffffff'
        });
      };
      reader.readAsText(file);
    }
  };

  const removeIcon = () => {
    setIcon(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Widget title="Forma">
      <div className="space-y-8">

        {/* Shape Type */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-4">
            Tipo di forma
          </label>
          <div className="grid grid-cols-5 gap-3">
            {SHAPES.map((s) => (
              <button
                key={s.faces}
                onClick={() => setFaces(s.faces)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  shape.faces === s.faces
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
                }`}
              >
                <span className="text-base font-bold">{s.faces}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="pt-6 border-t border-[#333]">
          <SliderControl
            label="Scala"
            value={parseFloat(shape.scale.toFixed(1))}
            unit="x"
            min={0.5}
            max={2}
            step={0.1}
            onChange={setScale}
          />
        </div>

        {/* Icon Upload Section */}
        <div className="pt-6 border-t border-[#333]">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 flex items-center gap-2 mb-4">
            <Image size={12} />
            Icona centrale
          </label>

          {shape.icon && shape.icon.type === 'custom' && shape.icon.svgContent ? (
            <div className="space-y-4">
              {/* Icon Preview */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl border-2 border-[#333] bg-[#2a2a2a] flex items-center justify-center overflow-hidden p-2"
                  dangerouslySetInnerHTML={{ __html: shape.icon.svgContent }}
                />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">SVG caricato</div>
                  <button
                    onClick={removeIcon}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <X size={12} />
                    Rimuovi
                  </button>
                </div>
              </div>

              {/* Icon Size */}
              <SliderControl
                label="Dimensione icona"
                value={shape.icon.size}
                unit="%"
                min={10}
                max={200}
                step={10}
                onChange={(v) => setIcon({ ...shape.icon!, size: v })}
              />

              {/* Icon Color */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-3">
                  Colore icona
                </label>
                <div className="flex gap-3 items-center mb-3">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-[#333] flex-shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: shape.icon.color }}
                  >
                    <input
                      type="color"
                      value={shape.icon.color}
                      onChange={(e) => setIcon({ ...shape.icon!, color: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute bottom-0.5 right-0.5 bg-black/50 rounded p-0.5">
                      <Pipette size={8} className="text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-mono text-white">{shape.icon.color.toUpperCase()}</div>
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {ICON_PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setIcon({ ...shape.icon!, color })}
                      className={`aspect-square rounded transition-all hover:scale-110 ${
                        shape.icon.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1e1e1e]' : ''
                      } ${color === '#000000' ? 'border border-[#333]' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-[#333] rounded-xl text-gray-400 hover:text-white hover:border-[#444] transition-all flex flex-col items-center gap-2"
            >
              <Upload size={24} />
              <span className="text-sm font-medium">Carica SVG</span>
              <span className="text-xs text-gray-500">Solo file .svg</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".svg"
            onChange={handleIconUpload}
            className="hidden"
          />
        </div>

      </div>
    </Widget>
  );
}
