import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, (req, res) => {
  const { doctorId, date, time, reason } = req.body || {};
  if (!doctorId || !date || !time) return res.status(400).json({ error: 'doctorId, date and time are required' });
  const doctor = store.doctors.find(d => d.id === doctorId);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  if (!doctor.availableSlots.includes(time)) return res.status(400).json({ error: 'Selected time is not available' });

  const clash = store.appointments.find(a =>
    a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'cancelled'
  );
  if (clash) return res.status(409).json({ error: 'Slot already booked, please pick another time' });

  const appt = {
    id: uuid(),
    userId: req.userId,
    doctorId,
    date,
    time,
    reason: reason || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  store.appointments.push(appt);
  res.json({ appointment: appt, doctor });
});

router.get('/mine', requireAuth, (req, res) => {
  const list = store.appointments
    .filter(a => a.userId === req.userId)
    .map(a => ({ ...a, doctor: store.doctors.find(d => d.id === a.doctorId) }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ appointments: list });
});

router.patch('/:id/cancel', requireAuth, (req, res) => {
  const appt = store.appointments.find(a => a.id === req.params.id && a.userId === req.userId);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  appt.status = 'cancelled';
  res.json({ appointment: appt });
});

export default router;
