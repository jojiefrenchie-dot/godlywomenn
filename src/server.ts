import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, initializeTables, closeDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import articleRoutes from './routes/articles';
import prayerRoutes from './routes/prayers';
import marketplaceRoutes from './routes/marketplace';
import messagingRoutes from './routes/messaging';

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 8000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://godlywomenn.vercel.app',
    'http://godlywomenn.vercel.app',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve media files
app.use('/media', express.static('media'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/messaging', messagingRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    const db = await initializeDatabase();
    if (db) {
      await initializeTables();
      console.log('✅ PostgreSQL database initialized');
    } else {
      console.log('📝 Using in-memory storage (no database configured)');
    }
  } catch (error) {
    console.warn('⚠️ Warning: Could not connect to database, continuing with in-memory storage');
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

startServer();

export default app;
