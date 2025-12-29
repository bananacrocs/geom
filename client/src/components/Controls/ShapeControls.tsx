import { Eye, EyeOff } from 'lucide-react';
import { useGeometryStore } from '../../stores/geometryStore';

export function ShapeControls() {
  const { shape, setFaces, setScale, borderConfig, setBorderConfig, toggleBorderVisibility } = useGeometryStore();

  return (
    <div className="space-y-6">
      {/* Sezione Forma */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Forma
        </h3>

        {/* Numero di facce */}
        <div>
          <label className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Numero facce</span>
            <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{shape.faces}</span>
          </label>
          <input
            type="range"
            min="4"
            max="20"
            value={shape.faces}
            onChange={(e) => setFaces(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
            <span>4 (Tetraedro)</span>
            <span>20 (Icosaedro)</span>
          </div>
        </div>

        {/* Scala */}
        <div>
          <label className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Scala</span>
            <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{shape.scale.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={shape.scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>

      {/* Sezione Bordi */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Bordi
        </h3>

        {/* Toggle bordi */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Mostra bordi</span>
          <button
            onClick={toggleBorderVisibility}
            className={`p-2 rounded-lg transition-colors ${
              borderConfig.visible
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
            title={borderConfig.visible ? 'Nascondi bordi' : 'Mostra bordi'}
          >
            {borderConfig.visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Controlli bordi (visibili solo se bordi attivi) */}
        {borderConfig.visible && (
          <>
            {/* Colore bordo */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Colore</span>
              <input
                type="color"
                value={borderConfig.color}
                onChange={(e) => setBorderConfig({ color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Spessore bordo */}
            <div>
              <label className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Spessore</span>
                <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{borderConfig.width}px</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={borderConfig.width}
                onChange={(e) => setBorderConfig({ width: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>Sottile</span>
                <span>Spesso</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
