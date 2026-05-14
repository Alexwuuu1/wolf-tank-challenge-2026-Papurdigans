import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const expensesRouter = Router();

expensesRouter.get('/', auth, async (_req, res) => {
  const expenses = await query(`
    SELECT id, concept, category, amount, expense_date AS expenseDate, created_at AS createdAt
    FROM expenses
    ORDER BY expense_date DESC, id DESC
  `);
  res.json(expenses);
});

expensesRouter.post('/', auth, async (req, res) => {
  const { concept, category = 'Operativo', amount, expenseDate } = req.body;
  if (!concept || !amount || !expenseDate) {
    return res.status(400).json({ message: 'Concepto, monto y fecha son requeridos' });
  }

  const result = await query(
    `INSERT INTO expenses (concept, category, amount, expense_date)
     VALUES (?, ?, ?, ?)`,
    [concept, category, Number(amount), expenseDate]
  );
  const [expense] = await query(`
    SELECT id, concept, category, amount, expense_date AS expenseDate, created_at AS createdAt
    FROM expenses
    WHERE id = ?
  `, [result.insertId]);
  res.status(201).json(expense);
});

expensesRouter.put('/:id', auth, async (req, res) => {
  const { concept, category = 'Operativo', amount, expenseDate } = req.body;
  if (!concept || !amount || !expenseDate) {
    return res.status(400).json({ message: 'Concepto, monto y fecha son requeridos' });
  }

  await query(
    `UPDATE expenses
     SET concept = ?, category = ?, amount = ?, expense_date = ?
     WHERE id = ?`,
    [concept, category, Number(amount), expenseDate, req.params.id]
  );
  const [expense] = await query(`
    SELECT id, concept, category, amount, expense_date AS expenseDate, created_at AS createdAt
    FROM expenses
    WHERE id = ?
  `, [req.params.id]);
  res.json(expense);
});

expensesRouter.delete('/:id', auth, async (req, res) => {
  await query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
  res.status(204).send();
});
