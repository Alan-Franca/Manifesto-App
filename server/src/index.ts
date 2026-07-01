import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
// Increasing JSON payload limits to support base64 images uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', message: 'Servidor Manifesto rodando perfeitamente!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Erro inesperado no servidor' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`========================================\n`);
});
