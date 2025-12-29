import { Play, Pause, RotateCw, RotateCcw } from 'lucide-react';
import { useGeometryStore } from '../../stores/geometryStore';

export function RotationControls() {
  const { shape, setRotation, toggleRotation } = useGeometryStore();
  const { rotation } = shape;

  const axes = [
    { value: 'x' as const, label: 'X' },
    { value: 'y' as const, label: 'Y' },
    { value: 'z' as const, label: 'Z' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        Rotazione
      </h3>

      {/* Play/Pause */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRotation}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            rotation.isPlaying
              ? 'bg-indigo-500 text-white hover:bg-indigo-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {rotation.isPlaying ? (
            <>
              <Pause size={18} />
              Pausa
            </>
          ) : (
            <>
              <Play size={18} />
              Avvia
            </>
          )}
        </button>
      </div>

      {/* Asse di rotazione */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
          Asse
        </label>
        <div className="flex gap-2">
          {axes.map((axis) => (
            <button
              key={axis.value}
              onClick={() => setRotation({ axis: axis.value })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                rotation.axis === axis.value
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {axis.label}
            </button>
          ))}
        </div>
      </div>

      {/* Velocità */}
      <div>
        <label className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Velocità</span>
          <span className="font-mono">{rotation.speed}</span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={rotation.speed}
          onChange={(e) => setRotation({ speed: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Direzione */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
          Direzione
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setRotation({ direction: 'clockwise' })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              rotation.direction === 'clockwise'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <RotateCw size={18} />
            Orario
          </button>
          <button
            onClick={() => setRotation({ direction: 'counterclockwise' })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              rotation.direction === 'counterclockwise'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <RotateCcw size={18} />
            Antiorario
          </button>
        </div>
      </div>
    </div>
  );
}
