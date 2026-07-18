import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import tagRoutes from './routes/tags.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === 'production';

// Client dist for single-service deploy (Express serves Vue build)
const clientDist = path.join(__dirname, '../../client/dist');
const serveSpa = process.env.SERVE_SPA !== 'false' && fs.existsSync(clientDist);

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // same-origin SPA / curl / server-to-server have no Origin
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'devhub-api',
    spa: serveSpa,
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/users', userRoutes);

// Production: serve Vue SPA from same origin (one free Render URL)
if (serveSpa) {
  app.use(express.static(clientDist, { index: false }));
  app.get(/^(?!\/api)(?!\/uploads).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  console.log('Serving SPA from', clientDist);
} else {
  app.use(notFound);
}

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  DevHub API running on http://localhost:${PORT} (SPA: ${serveSpa})\n`);
});
