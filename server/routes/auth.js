// server/routes/auth.js
// Registo e login reais: password com hash (bcrypt), sessão via JWT.

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Nome, email e password (mín. 6 caracteres) são obrigatórios.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Já existe uma conta com este email.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email, passwordHash);

  const user = { id: result.lastInsertRowid, name, email };
  res.status(201).json({ token: signToken(user), user });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!row || !bcrypt.compareSync(password || '', row.password_hash)) {
    return res.status(401).json({ error: 'Email ou password incorretos.' });
  }

  const user = { id: row.id, name: row.name, email: row.email };
  res.json({ token: signToken(user), user });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
