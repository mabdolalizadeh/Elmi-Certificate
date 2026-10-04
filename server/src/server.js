import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdfRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { initDatabase } from './db/database.js';

// Initialize SQLite schema and tables
initDatabase();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'report-card-pdf-engine',
    timestamp: new Date().toISOString(),
  });
});

// PDF routes
app.use('/api', pdfRoutes);

// Report & Longitudinal History routes
app.use('/api/reports', reportRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Report Card PDF Service running on port ${PORT}`);
  });
}

export default app;
