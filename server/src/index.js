import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ensureDatabase, persistDatabase } from './bootstrap.js';
import { errorHandler, notFound } from './middleware/error.js';

await ensureDatabase();

const authRoutes = (await import('./routes/auth.js')).default;
const projectRoutes = (await import('./routes/projects.js')).default;
const tagRoutes = (await import('./routes/tags.js')).default;
const userRoutes = (await import('./routes/users.js')).default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === 'production';

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
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  const end = res.end.bind(res);
  res.end = (...args) => {
    persistDatabase().catch((err) => console.error('blob save', err.message)).finally(() => end(...args));
  };
  next();
});

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

if (serveSpa) {
  app.use(express.static(clientDist, { index: false }));
  app.get(/^(?!\/api)(?!\/uploads).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else if (!process.env.VERCEL) {
  app.use(notFound);
}

app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DevHub API running on http://localhost:${PORT} (SPA: ${serveSpa})`);
  });
}

export default app;
