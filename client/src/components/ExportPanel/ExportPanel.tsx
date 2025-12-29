import { useState } from 'react';
import { Download, Image, FileCode, Film, Loader2 } from 'lucide-react';
import { useGeometryStore } from '../../stores/geometryStore';

interface ExportPanelProps {
  onExport: (format: 'png' | 'svg' | 'gif') => Promise<void>;
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  const { exportConfig, setExportConfig, setGifConfig } = useGeometryStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const handleExport = async (format: 'png' | 'svg' | 'gif') => {
    setIsExporting(true);
    setExportingFormat(format);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const formats = [
    { value: 'png' as const, label: 'PNG', icon: Image },
    { value: 'svg' as const, label: 'SVG', icon: FileCode },
    { value: 'gif' as const, label: 'GIF', icon: Film },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        Export
      </h3>

      {/* Formato */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
          Formato
        </label>
        <div className="flex gap-2">
          {formats.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setExportConfig({ format: value })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                exportConfig.format === value
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensioni */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
            Larghezza
          </label>
          <input
            type="number"
            value={exportConfig.width}
            onChange={(e) => setExportConfig({ width: parseInt(e.target.value) || 512 })}
            min="128"
            max="2048"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
            Altezza
          </label>
          <input
            type="number"
            value={exportConfig.height}
            onChange={(e) => setExportConfig({ height: parseInt(e.target.value) || 512 })}
            min="128"
            max="2048"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Colore sfondo */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Sfondo</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExportConfig({ backgroundColor: 'transparent' })}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              exportConfig.backgroundColor === 'transparent'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Trasparente
          </button>
          <input
            type="color"
            value={exportConfig.backgroundColor === 'transparent' ? '#ffffff' : exportConfig.backgroundColor}
            onChange={(e) => setExportConfig({ backgroundColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border-0"
          />
        </div>
      </div>

      {/* Opzioni GIF */}
      {exportConfig.format === 'gif' && exportConfig.gifConfig && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Opzioni GIF
          </h4>

          {/* Durata */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Durata loop</span>
              <span>{exportConfig.gifConfig.duration}s</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={exportConfig.gifConfig.duration}
              onChange={(e) => setGifConfig({ duration: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* FPS */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>FPS</span>
              <span>{exportConfig.gifConfig.fps}</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={exportConfig.gifConfig.fps}
              onChange={(e) => setGifConfig({ fps: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Qualità */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Qualità</span>
              <span>{exportConfig.gifConfig.quality <= 5 ? 'Alta' : exportConfig.gifConfig.quality <= 10 ? 'Media' : 'Bassa'}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={exportConfig.gifConfig.quality}
              onChange={(e) => setGifConfig({ quality: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Pulsante export */}
      <button
        onClick={() => handleExport(exportConfig.format)}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Esportando {exportingFormat?.toUpperCase()}...
          </>
        ) : (
          <>
            <Download size={18} />
            Esporta {exportConfig.format.toUpperCase()}
          </>
        )}
      </button>
    </div>
  );
}
