import { Router } from 'express';
import { db } from '../db/store.js';

export const flashcardsRouter = Router();

flashcardsRouter.get('/due', (req, res) => {
  try {
    const districtId = req.query.districtId as string | undefined;
    const cards = db.getDueFlashcards(districtId);
    return res.json(cards);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

flashcardsRouter.patch('/:id/review', (req, res) => {
  try {
    const { rating } = req.body;
    const card = db.updateFlashcardReview(req.params.id, rating);
    if (!card) return res.status(404).json({ error: 'Holo-card not found.' });

    const totalMastered = db.getDueFlashcards().length;
    if (totalMastered >= 25) {
      db.unlockBadge('flashcard_matrix');
    }

    return res.json({
      success: true,
      card,
      profile: db.getProfile()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
