import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Widget } from './Widget';
import { SliderControl } from './SliderControl';
import { useGeometryStore } from '../../stores/geometryStore';

interface ExportWidgetProps {
  onExport: (format: 'png' | 'svg' | 'gif') => Promise<void>;
}

export function ExportWidget({ onExport }: ExportWidgetProps) {
  const { exportConfig, setExportConfig, setGifConfig } = useGeometryStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportConfig.format);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Widget title="Export" defaultCollapsed={false}>
      <div className="space-y-8">

        {/* Format Selection */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-4">
            Formato
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['png', 'svg', 'gif'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportConfig({ format: fmt })}
                className={`py-3.5 rounded-xl text-sm font-bold uppercase transition-all ${
                  exportConfig.format === fmt
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* GIF Options */}
        {exportConfig.format === 'gif' && exportConfig.gifConfig && (
          <div className="pt-6 border-t border-[#333] space-y-6">
            <SliderControl
              label="Durata"
              value={exportConfig.gifConfig.duration}
              unit="s"
              min={1}
              max={10}
              onChange={(v) => setGifConfig({ duration: v })}
            />

            <SliderControl
              label="FPS"
              value={exportConfig.gifConfig.fps}
              unit=""
              min={10}
              max={60}
              step={5}
              onChange={(v) => setGifConfig({ fps: v })}
            />

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Qualità
                </label>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  exportConfig.gifConfig.quality <= 5
                    ? 'bg-green-500/20 text-green-400'
                    : exportConfig.gifConfig.quality <= 10
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                }`}>
                  {exportConfig.gifConfig.quality <= 5 ? 'Alta' : exportConfig.gifConfig.quality <= 10 ? 'Media' : 'Bassa'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={exportConfig.gifConfig.quality}
                onChange={(e) => setGifConfig({ quality: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#333] rounded-full appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-4 bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
        >
          {isExporting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Esportando...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Scarica {exportConfig.format.toUpperCase()}</span>
            </>
          )}
        </button>

      </div>
    </Widget>
  );
}
