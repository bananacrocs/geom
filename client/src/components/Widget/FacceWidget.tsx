import { useState } from 'react';
import { Palette, Pipette, Eye, EyeOff } from 'lucide-react';
import { Widget } from './Widget';
import { SliderControl } from './SliderControl';
import { useGeometryStore } from '../../stores/geometryStore';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
];

export function FacceWidget() {
  const {
    shape,
    setFaceConfig,
    setAllFacesColor,
    toggleFaceVisibility,
    setAllFacesVisibility
  } = useGeometryStore();
  const [globalColor, setGlobalColor] = useState('#6366f1');
  const [selectedFace, setSelectedFace] = useState<number | null>(null);

  const visibleCount = shape.faceConfigs.filter(fc => fc.isVisible).length;

  return (
    <Widget title="Facce">
      <div className="space-y-8">

        {/* Global Color Section */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 flex items-center gap-2 mb-4">
            <Palette size={12} />
            Colore globale facce
          </label>

          {/* Color Preview + Picker */}
          <div className="flex gap-4 items-center mb-4">
            <div
              className="w-14 h-14 rounded-xl border-2 border-[#333] shadow-lg flex-shrink-0 relative overflow-hidden"
              style={{ backgroundColor: globalColor }}
            >
              <input
                type="color"
                value={globalColor}
                onChange={(e) => setGlobalColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute bottom-1 right-1 bg-black/50 rounded p-0.5">
                <Pipette size={10} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-mono text-white mb-1">{globalColor.toUpperCase()}</div>
              <div className="text-xs text-gray-500">Clicca per cambiare</div>
            </div>
          </div>

          {/* Preset Colors */}
          <div className="grid grid-cols-10 gap-1.5 mb-4">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setGlobalColor(color)}
                className={`aspect-square rounded-md transition-all hover:scale-110 ${
                  globalColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1e1e1e]' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Apply Button */}
          <button
            onClick={() => setAllFacesColor(globalColor)}
            className="w-full bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-xl py-3 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
          >
            <Palette size={16} />
            Applica a tutte le facce
          </button>
        </div>

        {/* Individual Face Colors */}
        <div className="pt-6 border-t border-[#333]">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-4">
            Colori singole facce
          </label>

          <div className="grid grid-cols-6 gap-2">
            {shape.faceConfigs.map((fc, i) => (
              <button
                key={i}
                onClick={() => setSelectedFace(selectedFace === i ? null : i)}
                className={`relative aspect-square rounded-lg transition-all ${
                  selectedFace === i
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e] scale-105 z-10'
                    : 'hover:scale-105 hover:z-10'
                } ${!fc.isVisible ? 'opacity-40' : ''}`}
                style={{ backgroundColor: fc.color }}
              >
                <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Face Color Editor */}
          {selectedFace !== null && shape.faceConfigs[selectedFace] && (
            <div className="mt-6 p-4 bg-[#252525] rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Faccia {selectedFace + 1}</span>
                <button
                  onClick={() => setSelectedFace(null)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Chiudi
                </button>
              </div>

              {/* Face Color Picker */}
              <div
                className="w-full h-12 rounded-lg border-2 border-[#333] relative overflow-hidden cursor-pointer hover:border-[#444] transition-colors"
                style={{ backgroundColor: shape.faceConfigs[selectedFace].color }}
              >
                <input
                  type="color"
                  value={shape.faceConfigs[selectedFace].color}
                  onChange={(e) => setFaceConfig(selectedFace, { color: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Quick Colors */}
              <div className="grid grid-cols-10 gap-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFaceConfig(selectedFace, { color })}
                    className={`aspect-square rounded transition-all hover:scale-110 ${
                      shape.faceConfigs[selectedFace].color === color
                        ? 'ring-2 ring-white ring-offset-1 ring-offset-[#252525]'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Face Opacity */}
              <SliderControl
                label="Opacità"
                value={Math.round(shape.faceConfigs[selectedFace].opacity * 100)}
                unit="%"
                min={0}
                max={100}
                step={5}
                onChange={(v) => setFaceConfig(selectedFace, { opacity: v / 100 })}
              />
            </div>
          )}
        </div>

        {/* Faces Visibility Section */}
        <div className="pt-6 border-t border-[#333]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Visibilità facce{' '}
              <span className="text-white font-bold normal-case ml-1">
                {visibleCount}/{shape.faceConfigs.length}
              </span>
            </label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setAllFacesVisibility(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  visibleCount === shape.faceConfigs.length
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white'
                }`}
              >
                Tutte
              </button>
              <button
                onClick={() => setAllFacesVisibility(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  visibleCount === 0
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white'
                }`}
              >
                Nessuna
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {shape.faceConfigs.map((fc, i) => (
              <button
                key={i}
                onClick={() => toggleFaceVisibility(i)}
                className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                  fc.isVisible
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-[#2a2a2a] text-gray-500 border border-transparent'
                }`}
              >
                {fc.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            ))}
          </div>
        </div>

      </div>
    </Widget>
  );
}
