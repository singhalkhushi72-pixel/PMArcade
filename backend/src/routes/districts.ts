import { Router } from 'express';
import { db } from '../db/store.js';

export const districtsRouter = Router();

districtsRouter.get('/', (_req, res) => {
  try {
    const districts = db.getDistricts();
    return res.json(districts);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

districtsRouter.get('/:id', (req, res) => {
  try {
    const district = db.getDistrictById(req.params.id);
    if (!district) {
      return res.status(404).json({ error: 'District not found in Product City.' });
    }
    return res.json(district);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

districtsRouter.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteDistrict(req.params.id);
    if (!deleted) {
      return res.status(400).json({ error: 'Cannot delete default Cyber Foundry district.' });
    }
    return res.json({ success: true, message: 'District removed from Product City.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
