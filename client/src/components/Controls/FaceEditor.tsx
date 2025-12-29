import { useState } from 'react';
import { ChevronDown, ChevronUp, Palette, Eye, EyeOff, EyeIcon } from 'lucide-react';
import { useGeometryStore } from '../../stores/geometryStore';

export function FaceEditor() {
  const { shape, setFaceConfig, setAllFacesColor, toggleFaceVisibility, setAllFacesVisibility } = useGeometryStore();
  const [expandedFace, setExpandedFace] = useState<number | null>(null);
  const [globalColor, setGlobalColor] = useState('#6366f1');

  const toggleFace = (index: number) => {
    setExpandedFace(expandedFace === index ? null : index);
  };

  // Conta facce visibili
  const visibleCount = shape.faceConfigs.filter(fc => fc.isVisible).length;
  const allVisible = visibleCount === shape.faceConfigs.length;
  const noneVisible = visibleCount === 0;

  return (
    <div className="space-y-4">
      {/* Header con azioni globali */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Facce
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAllFacesVisibility(true)}
            disabled={allVisible}
            className={`p-1.5 rounded text-xs transition-colors ${
              allVisible
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Mostra tutte"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => setAllFacesVisibility(false)}
            disabled={noneVisible}
            className={`p-1.5 rounded text-xs transition-colors ${
              noneVisible
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Nascondi tutte"
          >
            <EyeOff size={16} />
          </button>
        </div>
      </div>

      {/* Colore globale */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-3">
          <Palette size={18} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">
            Colore globale
          </span>
          <input
            type="color"
            value={globalColor}
            onChange={(e) => setGlobalColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0"
          />
          <button
            onClick={() => setAllFacesColor(globalColor)}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Applica
          </button>
        </div>
      </div>

      {/* Contatore facce visibili */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <EyeIcon size={12} />
        <span>{visibleCount} di {shape.faceConfigs.length} facce visibili</span>
      </div>

      {/* Lista facce */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {shape.faceConfigs.map((faceConfig, index) => (
          <div
            key={index}
            className={`border rounded-lg overflow-hidden transition-all ${
              faceConfig.isVisible
                ? 'border-gray-200 dark:border-gray-700'
                : 'border-gray-100 dark:border-gray-800 opacity-60'
            }`}
          >
            {/* Header faccia */}
            <div className="flex items-center bg-gray-50 dark:bg-gray-800">
              {/* Toggle visibilità */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFaceVisibility(index);
                }}
                className={`p-3 transition-colors ${
                  faceConfig.isVisible
                    ? 'text-indigo-500 hover:text-indigo-600'
                    : 'text-gray-400 hover:text-gray-500'
                }`}
                title={faceConfig.isVisible ? 'Nascondi faccia' : 'Mostra faccia'}
              >
                {faceConfig.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              {/* Info faccia + espandi */}
              <button
                onClick={() => toggleFace(index)}
                className="flex-1 flex items-center justify-between py-3 pr-3 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-md border-2 transition-all ${
                      faceConfig.isVisible
                        ? 'border-gray-300 dark:border-gray-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    style={{
                      backgroundColor: faceConfig.isVisible ? faceConfig.color : '#9ca3af',
                    }}
                  />
                  <span className={`text-sm font-medium transition-colors ${
                    faceConfig.isVisible
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    Faccia {index + 1}
                  </span>
                </div>
                {expandedFace === index ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </button>
            </div>

            {/* Dettagli faccia (solo se visibile la faccia) */}
            {expandedFace === index && faceConfig.isVisible && (
              <div className="p-4 space-y-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                {/* Colore */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Colore
                  </label>
                  <input
                    type="color"
                    value={faceConfig.color}
                    onChange={(e) =>
                      setFaceConfig(index, { color: e.target.value })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Opacità */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Opacità</span>
                    <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                      {Math.round(faceConfig.opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={faceConfig.opacity}
                    onChange={(e) =>
                      setFaceConfig(index, { opacity: parseFloat(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Intensità ombra */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Ombra</span>
                    <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                      {Math.round(faceConfig.shadowIntensity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={faceConfig.shadowIntensity}
                    onChange={(e) =>
                      setFaceConfig(index, {
                        shadowIntensity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Messaggio se faccia nascosta */}
            {expandedFace === index && !faceConfig.isVisible && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center italic">
                  Faccia nascosta - clicca l'icona occhio per mostrarla
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
