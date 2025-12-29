import { Eye, EyeOff, Pipette } from 'lucide-react';
import { Widget } from './Widget';
import { SliderControl } from './SliderControl';
import { useGeometryStore } from '../../stores/geometryStore';

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
];

export function BordiWidget() {
  const { borderConfig, setBorderConfig, toggleBorderVisibility } = useGeometryStore();

  return (
    <Widget title="Bordi">
      <div className="space-y-8">

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Visibilità bordi
          </label>
          <button
            onClick={toggleBorderVisibility}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              borderConfig.visible
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-[#2a2a2a] text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            {borderConfig.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="text-sm font-medium">
              {borderConfig.visible ? 'Visibili' : 'Nascosti'}
            </span>
          </button>
        </div>

        {/* Border Settings - Only visible when borders are enabled */}
        {borderConfig.visible && (
          <>
            {/* Border Color */}
            <div className="pt-6 border-t border-[#333]">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-4">
                Colore bordi
              </label>

              <div className="flex gap-4 items-center mb-4">
                <div
                  className="w-14 h-14 rounded-xl border-2 border-[#333] shadow-lg flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: borderConfig.color }}
                >
                  <input
                    type="color"
                    value={borderConfig.color}
                    onChange={(e) => setBorderConfig({ color: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/50 rounded p-0.5">
                    <Pipette size={10} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-mono text-white mb-1">{borderConfig.color.toUpperCase()}</div>
                  <div className="text-xs text-gray-500">Colore dei bordi</div>
                </div>
              </div>

              {/* Preset Colors */}
              <div className="grid grid-cols-10 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBorderConfig({ color })}
                    className={`aspect-square rounded-md transition-all hover:scale-110 ${
                      borderConfig.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1e1e1e]' : ''
                    } ${color === '#000000' ? 'border border-[#333]' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Border Width */}
            <div className="pt-6 border-t border-[#333]">
              <SliderControl
                label="Spessore"
                value={borderConfig.width}
                unit="px"
                min={1}
                max={10}
                onChange={(v) => setBorderConfig({ width: v })}
              />
            </div>
          </>
        )}

      </div>
    </Widget>
  );
}
