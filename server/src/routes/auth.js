import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, age: u.age, gender: u.gender };
}

router.post('/register', async (req, res) => {
  const { name, email, password, age, gender } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6)           return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (store.users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuid(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    age: age ? Number(age) : null,
    gender: gender || null,
    createdAt: new Date().toISOString()
  };
  store.users.push(user);
  res.json({ token: signToken(user.id), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = store.users.find(u => u.email === String(email).toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)  return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: signToken(user.id), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  const u = store.users.find(x => x.id === req.userId);
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(u) });
});

export default router;
