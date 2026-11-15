import { Router } from 'express';
import { db } from '../db/store.js';

export const profileRouter = Router();

profileRouter.get('/', (_req, res) => {
  try {
    return res.json(db.getProfile());
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

profileRouter.post('/deduct-shield', (_req, res) => {
  try {
    const shields = db.deductShield();
    return res.json({ shields });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

profileRouter.post('/recharge-shields', (_req, res) => {
  try {
    const shields = db.rechargeShields();
    return res.json({ success: true, shields });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

profileRouter.post('/reset', (_req, res) => {
  try {
    db.resetProgress();
    return res.json({ success: true, profile: db.getProfile() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
