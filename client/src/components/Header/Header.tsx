import { RotateCcw, Box } from 'lucide-react';
import { useGeometryStore } from '../../stores/geometryStore';

export function Header() {
  const { resetShape } = useGeometryStore();

  return (
    <header className="h-14 px-6 flex items-center justify-between bg-[#1a1a1a] border-b border-[#252525]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#252525] border border-[#333] rounded-lg flex items-center justify-center">
          <Box size={16} className="text-green-500" />
        </div>
        <span className="text-sm font-semibold text-white">Spinning Geom</span>
      </div>

      {/* Actions */}
      <button
        onClick={() => window.confirm('Reset?') && resetShape()}
        className="px-3 py-1.5 bg-[#252525] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all flex items-center gap-2 text-xs"
      >
        <RotateCcw size={14} />
        Reset
      </button>
    </header>
  );
}
