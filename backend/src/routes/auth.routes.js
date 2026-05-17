import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { hashPassword } from '../utils/password.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password, remember } = req.body;
  const users = await query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [email]);
  const user = users[0];

  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ message: 'Credenciales invalidas' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: remember ? '7d' : '8h'
  });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

authRouter.post('/register', async (req, res) => {
  const { name, phone, email, password, preferences = '' } = req.body;
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'Nombre, WhatsApp, correo y contrasena son requeridos' });
  }

  const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) return res.status(409).json({ message: 'Ese correo ya tiene una cuenta' });

  const userResult = await query(
    'INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, TRUE)',
    [name, email, hashPassword(password), 'cliente']
  );

  await query(
    `INSERT INTO customers (name, phone, email, preferences, active)
     VALUES (?, ?, ?, ?, TRUE)
     ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), preferences = VALUES(preferences), active = TRUE`,
    [name, phone, email, preferences]
  );

  const user = { id: userResult.insertId, name, email, role: 'cliente' };
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d'
  });

  res.status(201).json({ token, user });
});
