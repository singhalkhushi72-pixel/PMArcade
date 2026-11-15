import { Router } from 'express';
import { db } from '../db/store.js';

export const levelsRouter = Router();

levelsRouter.get('/district/:districtId/level/:num', (req, res) => {
  try {
    const { districtId, num } = req.params;
    const parsedNum = parseInt(num, 10);
    const level = !isNaN(parsedNum)
      ? db.getLevel(districtId, parsedNum)
      : db.getLevel(districtId, num);
    if (!level) {
      return res.status(404).json({ error: `Node "${num}" not found in district "${districtId}".` });
    }
    return res.json(level);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
