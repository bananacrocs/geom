import express from 'express';
import cors from 'cors';
import { exportRouter } from './routes/export.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '10mb' }));
// Routes
app.use('/api/export', exportRouter);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
});
