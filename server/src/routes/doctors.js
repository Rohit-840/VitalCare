import { Router } from 'express';
import { store } from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  const { specialty, city, q } = req.query;
  let list = [...store.doctors];
  if (specialty) list = list.filter(d => d.specialty.toLowerCase() === String(specialty).toLowerCase());
  if (city)      list = list.filter(d => d.city.toLowerCase()      === String(city).toLowerCase());
  if (q) {
    const needle = String(q).toLowerCase();
    list = list.filter(d =>
      d.name.toLowerCase().includes(needle) ||
      d.specialty.toLowerCase().includes(needle) ||
      d.city.toLowerCase().includes(needle)
    );
  }
  res.json({ doctors: list });
});

router.get('/specialties', (_req, res) => {
  const set = new Set(store.doctors.map(d => d.specialty));
  res.json({ specialties: [...set].sort() });
});

router.get('/cities', (_req, res) => {
  const set = new Set(store.doctors.map(d => d.city));
  res.json({ cities: [...set].sort() });
});

router.get('/:id', (req, res) => {
  const doc = store.doctors.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ doctor: doc });
});

export default router;
