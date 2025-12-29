import { useState, useMemo, useCallback } from 'react';
import { Search, Upload, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useGeometryStore } from '../../stores/geometryStore';

// Lista di icone comuni da Lucide
const popularIcons = [
  'Star', 'Heart', 'Circle', 'Square', 'Triangle', 'Hexagon', 'Pentagon',
  'Sun', 'Moon', 'Cloud', 'Zap', 'Flame', 'Droplet', 'Snowflake',
  'Music', 'Camera', 'Image', 'Film', 'Mic', 'Headphones',
  'Home', 'Building', 'Castle', 'Mountain', 'Trees',
  'Car', 'Plane', 'Ship', 'Rocket', 'Bike',
  'User', 'Users', 'UserCircle', 'Smile', 'Frown',
  'Check', 'X', 'Plus', 'Minus', 'AlertCircle', 'Info',
  'Settings', 'Cog', 'Wrench', 'Hammer', 'Paintbrush',
  'Code', 'Terminal', 'Database', 'Server', 'Globe',
  'Lock', 'Unlock', 'Key', 'Shield', 'Eye',
  'Bell', 'Mail', 'MessageCircle', 'Phone', 'Send',
  'Calendar', 'Clock', 'Timer', 'Hourglass', 'Watch',
  'File', 'Folder', 'FileText', 'Bookmark', 'Tag',
  'Download', 'Upload', 'Share', 'Link', 'ExternalLink',
  'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack',
  'Volume2', 'VolumeX', 'Maximize', 'Minimize', 'RefreshCw',
];

type LucideIconName = keyof typeof LucideIcons;

export function IconPicker() {
  const { shape, setIcon } = useGeometryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

  // Filtra icone in base alla ricerca
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return popularIcons;
    const query = searchQuery.toLowerCase();
    return popularIcons.filter((name) => name.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      setIcon({
        type: 'lucide',
        name: iconName,
        size: shape.icon?.size || 50,
        color: shape.icon?.color || '#ffffff',
      });
    },
    [setIcon, shape.icon]
  );

  const handleRemoveIcon = useCallback(() => {
    setIcon(null);
  }, [setIcon]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        setIcon({
          type: 'custom',
          svgContent,
          size: shape.icon?.size || 50,
          color: shape.icon?.color || '#ffffff',
        });
      };
      reader.readAsText(file);
    },
    [setIcon, shape.icon]
  );

  const handleSizeChange = useCallback(
    (size: number) => {
      if (shape.icon) {
        setIcon({ ...shape.icon, size });
      }
    },
    [setIcon, shape.icon]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      if (shape.icon) {
        setIcon({ ...shape.icon, color });
      }
    },
    [setIcon, shape.icon]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        Icona Centrale
      </h3>

      {/* Icona corrente */}
      {shape.icon && (
        <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded">
            {shape.icon.type === 'lucide' && shape.icon.name && (() => {
              const IconComp = LucideIcons[shape.icon.name as LucideIconName] as React.ComponentType<{ size?: number; color?: string }>;
              return IconComp ? <IconComp size={24} color={shape.icon.color} /> : null;
            })()}
            {shape.icon.type === 'custom' && (
              <div
                className="w-6 h-6"
                style={{ color: shape.icon.color }}
                dangerouslySetInnerHTML={{ __html: shape.icon.svgContent || '' }}
              />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {shape.icon.type === 'lucide' ? shape.icon.name : 'SVG Custom'}
            </p>
          </div>
          <button
            onClick={handleRemoveIcon}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Controlli icona */}
      {shape.icon && (
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          {/* Dimensione */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Dimensione</span>
              <span>{shape.icon.size}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={shape.icon.size}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Colore */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Colore</span>
            <input
              type="color"
              value={shape.icon.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'library'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Libreria
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Upload
        </button>
      </div>

      {/* Contenuto tab */}
      {activeTab === 'library' && (
        <div className="space-y-3">
          {/* Ricerca */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cerca icona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Griglia icone */}
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
            {filteredIcons.map((iconName) => {
              const IconComp = LucideIcons[iconName as LucideIconName] as React.ComponentType<{ size?: number }>;
              if (!IconComp || typeof IconComp !== 'function') return null;

              return (
                <button
                  key={iconName}
                  onClick={() => handleSelectIcon(iconName)}
                  className={`p-2 rounded-lg transition-colors ${
                    shape.icon?.type === 'lucide' && shape.icon?.name === iconName
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title={iconName}
                >
                  <IconComp size={20} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
            <Upload size={32} className="text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Clicca per caricare un SVG
            </span>
            <input
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            Solo file SVG supportati
          </p>
        </div>
      )}
    </div>
  );
}
