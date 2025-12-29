import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function Widget({ title, children, defaultCollapsed = true }: WidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-[#333] overflow-hidden">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-5 py-4 bg-[#252525] flex items-center justify-between hover:bg-[#2a2a2a] transition-colors"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {isCollapsed ? (
          <ChevronRight size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {/* Content - Collapsible */}
      {!isCollapsed && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
}
