import { Router } from 'express';
import { generateSvg } from '../services/svgExporter.js';
export const exportRouter = Router();
exportRouter.post('/', async (req, res) => {
    try {
        const request = req.body;
        const { format } = request.export;
        console.log(`Export request: ${format}`);
        let data;
        let mimeType;
        switch (format) {
            case 'svg':
                data = await generateSvg(request);
                mimeType = 'image/svg+xml';
                break;
            case 'png':
            case 'gif':
                // PNG e GIF vengono gestiti direttamente dal frontend
                return res.status(400).json({
                    success: false,
                    error: `${format.toUpperCase()} export should be done client-side`,
                });
            default:
                return res.status(400).json({
                    success: false,
                    error: `Unsupported format: ${format}`,
                });
        }
        res.json({
            success: true,
            data,
            mimeType,
        });
    }
    catch (error) {
        console.error('Export error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
