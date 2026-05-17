import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const customersRouter = Router();

customersRouter.get('/', auth, async (_req, res) => {
  const customers = await query(`
    SELECT id, name, phone, email, preferences, total_orders AS totalOrders, active, created_at AS createdAt
    FROM customers
    WHERE active = TRUE
    ORDER BY total_orders DESC, name
  `);
  res.json(customers);
});

customersRouter.post('/', auth, async (req, res) => {
  const { name, phone, email, preferences } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Nombre y telefono son requeridos' });

  await query(
    `INSERT INTO customers (name, phone, email, preferences, active)
     VALUES (?, ?, ?, ?, TRUE)
     ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), preferences = VALUES(preferences), active = TRUE`,
    [name, phone, email || null, preferences || '']
  );
  const [customer] = await query('SELECT * FROM customers WHERE phone = ?', [phone]);
  res.status(201).json(customer);
});

customersRouter.put('/:id', auth, async (req, res) => {
  const { name, phone, email, preferences } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Nombre y telefono son requeridos' });

  await query(
    `UPDATE customers
     SET name = ?, phone = ?, email = ?, preferences = ?
     WHERE id = ?`,
    [name, phone, email || null, preferences || '', req.params.id]
  );
  const [customer] = await query(`
    SELECT id, name, phone, email, preferences, total_orders AS totalOrders, active, created_at AS createdAt
    FROM customers
    WHERE id = ?
  `, [req.params.id]);
  res.json(customer);
});

customersRouter.patch('/:id/active', auth, async (req, res) => {
  const active = Boolean(req.body.active);
  await query('UPDATE customers SET active = ? WHERE id = ?', [active, req.params.id]);
  res.json({ id: Number(req.params.id), active });
});
