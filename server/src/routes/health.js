import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { requireAuth } from '../middleware/auth.js';
import { diagnose } from '../utils/diagnosis.js';

const router = Router();

router.post('/diagnose', requireAuth, (req, res) => {
  const vitals = req.body?.vitals || {};
  const diagnosis = diagnose(vitals);

  const record = {
    id: uuid(),
    userId: req.userId,
    vitals,
    diagnosis,
    createdAt: new Date().toISOString()
  };
  store.healthRecords.push(record);
  res.json({ record });
});

router.get('/records', requireAuth, (req, res) => {
  const records = store.healthRecords
    .filter(r => r.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ records });
});

router.delete('/records/:id', requireAuth, (req, res) => {
  const idx = store.healthRecords.findIndex(r => r.id === req.params.id && r.userId === req.userId);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });
  store.healthRecords.splice(idx, 1);
  res.json({ ok: true });
});

export default router;
