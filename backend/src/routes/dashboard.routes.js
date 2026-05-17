import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', auth, async (_req, res) => {
  const [orderStats] = await query(`
    SELECT COUNT(*) AS totalOrders, COALESCE(SUM(total), 0) AS revenue
    FROM orders
  `);
  const [customerStats] = await query('SELECT COUNT(*) AS totalCustomers FROM customers');
  const [pendingStats] = await query(`
    SELECT COUNT(*) AS activeOrders
    FROM orders
    WHERE status IN ('nuevo','confirmado','preparacion','enviado')
  `);
  const recentOrders = await query(`
    SELECT o.id, o.status, o.total, o.delivery_date AS deliveryDate, c.name AS customer
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    ORDER BY o.created_at DESC
    LIMIT 5
  `);

  res.json({ ...orderStats, ...customerStats, ...pendingStats, recentOrders });
});
