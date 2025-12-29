import { Play, Pause, RotateCw, RotateCcw } from 'lucide-react';
import { Widget } from './Widget';
import { useGeometryStore } from '../../stores/geometryStore';

export function AnimationBar() {
  const { shape, setRotation } = useGeometryStore();
  const { rotation } = shape;

  return (
    <Widget title="Animazione" defaultCollapsed={false}>
      <div className="space-y-8">

        {/* Play/Pause */}
        <div className="flex justify-center">
          <button
            onClick={() => setRotation({ isPlaying: !rotation.isPlaying })}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              rotation.isPlaying
                ? 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/25'
                : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
            }`}
          >
            {rotation.isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>

        {/* Speed */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-3">
            Velocità
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={rotation.speed}
              onChange={(e) => setRotation({ speed: parseFloat(e.target.value) })}
              className="flex-1 h-2 bg-[#333] rounded-full appearance-none cursor-pointer accent-green-500"
            />
            <span className="text-sm font-semibold text-white bg-[#252525] px-3 py-1.5 rounded-lg min-w-[4rem] text-center">
              {rotation.speed.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Axis */}
        <div className="pt-6 border-t border-[#333]">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-4">
            Asse di rotazione
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <button
                key={axis}
                onClick={() => setRotation({ axis })}
                className={`py-3 rounded-xl text-sm font-bold uppercase transition-all ${
                  rotation.axis === axis
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
                }`}
              >
                {axis}
              </button>
            ))}
          </div>
        </div>

        {/* Direction */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 block mb-4">
            Direzione
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRotation({ direction: 'counterclockwise' })}
              className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                rotation.direction === 'counterclockwise'
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
              }`}
            >
              <RotateCcw size={18} />
              <span className="text-sm font-semibold">Antiorario</span>
            </button>
            <button
              onClick={() => setRotation({ direction: 'clockwise' })}
              className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                rotation.direction === 'clockwise'
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
              }`}
            >
              <RotateCw size={18} />
              <span className="text-sm font-semibold">Orario</span>
            </button>
          </div>
        </div>

      </div>
    </Widget>
  );
}
