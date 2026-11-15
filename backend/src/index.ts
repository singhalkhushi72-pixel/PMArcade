import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { uploadRouter } from './routes/upload.js';
import { districtsRouter } from './routes/districts.js';
import { levelsRouter } from './routes/levels.js';
import { battleRouter } from './routes/battle.js';
import { flashcardsRouter } from './routes/flashcards.js';
import { pixelRouter } from './routes/pixel.js';
import { profileRouter } from './routes/profile.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// API Endpoints
app.use('/api/upload', uploadRouter);
app.use('/api/districts', districtsRouter);
app.use('/api/levels', levelsRouter);
app.use('/api/battle', battleRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/pixel', pixelRouter);
app.use('/api/profile', profileRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'PM ARCADE CYBER GRID',
    geminiKeySet: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here'),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend production build
const FRONTEND_DIST = path.resolve(process.cwd(), '../frontend/dist');
app.use(express.static(FRONTEND_DIST));
app.get('*', (_req, res, next) => {
  const indexPath = path.join(FRONTEND_DIST, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`🕹️ PM ARCADE is alive on http://localhost:${PORT}`);
  console.log(`⚡ Neural Link: ${process.env.GEMINI_API_KEY ? 'Gemini 2.5 Flash connected' : 'Running in Offline Smart Arcade Mode'}`);
});
