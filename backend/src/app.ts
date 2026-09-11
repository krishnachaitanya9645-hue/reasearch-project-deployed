import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import paperRoutes from './routes/paperRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import gapRoutes from './routes/gapRoutes.js';
import directionRoutes from './routes/directionRoutes.js';
import experimentRoutes from './routes/experimentRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import agentRoutes from './routes/agentRoutes.js';

const app = express();

// Middlewares
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'ResearchPilot AI Backend Engine',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/gaps', gapRoutes);
app.use('/api/directions', directionRoutes);
app.use('/api/experiments', experimentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/agents', agentRoutes);

// Error Middleware
app.use(errorHandler);

export default app;
