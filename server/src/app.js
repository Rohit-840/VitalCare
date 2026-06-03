import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import { seedDoctors } from './seed/doctors.js';
import { store } from './data/store.js';

seedDoctors(store);

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // allow non-browser tools (curl, server-to-server) which send no Origin header
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin ${origin} is not allowed`));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({
  service: 'VitalCare API',
  ok: true,
  message: 'This is the backend. Open the frontend (Netlify) URL to use the app.',
  docs: ['/api/health-check', '/api/auth/login', '/api/doctors']
}));

app.get('/api/health-check', (_req, res) => res.json({ ok: true, time: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;
