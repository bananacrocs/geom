import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { FormaWidget, FacceWidget, BordiWidget, AnimationBar, ExportWidget } from './components/Widget';
import { GeometryViewer } from './components/Canvas3D';
import { useGeometryStore } from './stores/geometryStore';
import { exportGif } from './utils/gifExporter';

function App() {
  const exportConfig = useGeometryStore((state) => state.exportConfig);
  const shape = useGeometryStore((state) => state.shape);
  const [gifProgress, setGifProgress] = useState<number | null>(null);

  const handleExport = useCallback(async (format: 'png' | 'svg' | 'gif') => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('Canvas non trovato');
      return;
    }

    if (format === 'png') {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `geometry-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } else if (format === 'gif') {
      try {
        setGifProgress(0);
        const gifBlob = await exportGif(
          canvas,
          {
            width: exportConfig.gifConfig?.width || 512,
            height: exportConfig.gifConfig?.height || 512,
            duration: exportConfig.gifConfig?.duration || 2,
            fps: exportConfig.gifConfig?.fps || 30,
            quality: exportConfig.gifConfig?.quality || 10,
          },
          (progress) => setGifProgress(progress)
        );
        const url = URL.createObjectURL(gifBlob);
        const link = document.createElement('a');
        link.download = `geometry-${Date.now()}.gif`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('GIF export error:', error);
        alert('Errore durante la generazione della GIF');
      } finally {
        setGifProgress(null);
      }
    } else if (format === 'svg') {
      try {
        const response = await fetch('http://localhost:3001/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shape, export: exportConfig }),
        });
        if (!response.ok) throw new Error('Export failed');
        const result = await response.json();
        if (result.success && result.data) {
          const link = document.createElement('a');
          link.download = `geometry-${Date.now()}.svg`;
          link.href = `data:${result.mimeType};base64,${result.data}`;
          link.click();
        }
      } catch (error) {
        console.error('SVG export error:', error);
        alert('Errore durante l\'export SVG.');
      }
    }
  }, [shape, exportConfig]);

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <Header />

      <div className="flex-1 relative overflow-hidden">
        {/* Canvas - Full space */}
        <div className="absolute inset-0">
          <GeometryViewer className="w-full h-full" />
        </div>

        {/* Widget Panel - Left (Forma, Facce, Bordi - tutti collapsed) */}
        <div className="absolute top-4 left-4 bottom-4 w-80 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
          <FormaWidget />
          <FacceWidget />
          <BordiWidget />
        </div>

        {/* Widget Panel - Right (Animation, Export) */}
        <div className="absolute top-4 right-4 bottom-4 w-80 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
          <AnimationBar />
          <ExportWidget onExport={handleExport} />
        </div>

        {/* GIF Progress Overlay */}
        {gifProgress !== null && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 w-72">
              <p className="text-white font-medium mb-4 text-center">Generando GIF...</p>
              <div className="h-2 bg-[#333] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-green-500 transition-all duration-150"
                  style={{ width: `${gifProgress * 100}%` }}
                />
              </div>
              <p className="text-center text-2xl font-bold text-white">{Math.round(gifProgress * 100)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
