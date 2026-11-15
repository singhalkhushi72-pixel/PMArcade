import { Router } from 'express';
import { askPixelWithGemini } from '../services/gemini.js';
import { db } from '../db/store.js';

export const pixelRouter = Router();

pixelRouter.post('/ask', async (req, res) => {
  try {
    const { levelId, districtId, question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Signal transmission was empty.' });
    }

    const district = db.getDistrictById(districtId);
    const level = district?.levels?.find((l) => l.id === levelId);

    const levelTitle = level?.title || 'Current District Node';
    const levelContext = level ? `${level.explanation} (Game Analogy: ${level.analogy})` : '';
    const slideText = district?.raw_text || '';

    const answer = await askPixelWithGemini(levelTitle, levelContext, slideText, question);

    return res.json({
      success: true,
      answer,
      mascot: 'pixel'
    });
  } catch (err: any) {
    console.error('Pixel comms error:', err);
    return res.status(500).json({ error: err.message || 'Pixel transmitter offline.' });
  }
});
