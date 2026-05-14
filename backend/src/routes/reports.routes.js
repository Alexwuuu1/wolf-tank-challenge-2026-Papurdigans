import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const reportsRouter = Router();

reportsRouter.get('/financial', auth, async (_req, res) => {
  const byCategory = await query(`
    SELECT cat.name AS category, COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
    FROM categories cat
    LEFT JOIN products p ON p.category_id = cat.id
    LEFT JOIN order_items oi ON oi.product_id = p.id
    GROUP BY cat.id, cat.name
    ORDER BY revenue DESC
  `);
  const dailySales = await query(`
    SELECT DATE(created_at) AS date, SUM(total) AS revenue, COUNT(*) AS orders
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY date
  `);
  const [expenses] = await query('SELECT COALESCE(SUM(amount), 0) AS expenses FROM expenses');
  const [income] = await query('SELECT COALESCE(SUM(total), 0) AS income FROM orders');
  const expensesByCategory = await query(`
    SELECT category, COALESCE(SUM(amount), 0) AS amount
    FROM expenses
    GROUP BY category
    ORDER BY amount DESC
  `);
  const monthlySummary = await query(`
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total) AS income, COUNT(*) AS orders
    FROM orders
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month
  `);
  const profit = Number(income.income) - Number(expenses.expenses);
  res.json({
    summary: {
      income: Number(income.income),
      expenses: Number(expenses.expenses),
      profit,
      margin: Number(income.income) > 0 ? (profit / Number(income.income)) * 100 : 0
    },
    byCategory,
    expensesByCategory,
    dailySales,
    monthlySummary
  });
});
