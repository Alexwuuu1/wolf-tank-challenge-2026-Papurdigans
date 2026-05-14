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
