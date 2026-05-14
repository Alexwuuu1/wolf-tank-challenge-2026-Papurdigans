import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const ordersRouter = Router();

async function getOrderDetail(id) {
  const [order] = await query(`
    SELECT o.id, o.customer_id AS customerId, o.delivery_date AS deliveryDate,
           o.delivery_address AS deliveryAddress, o.status, o.payment_status AS paymentStatus,
           o.notes, o.total, o.created_at AS createdAt, c.name AS customer, c.phone, c.email, c.preferences
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    WHERE o.id = ?
  `, [id]);

  if (!order) return null;

  const items = await query(`
    SELECT oi.id, oi.product_id AS productId, p.name, oi.quantity, oi.unit_price AS unitPrice,
           oi.quantity * oi.unit_price AS subtotal
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
    ORDER BY oi.id
  `, [id]);

  return { ...order, items };
}

ordersRouter.get('/', auth, async (_req, res) => {
  const orders = await query(`
    SELECT o.id, o.delivery_date AS deliveryDate, o.delivery_address AS deliveryAddress,
           o.status, o.payment_status AS paymentStatus, o.notes, o.total, o.created_at AS createdAt,
           c.id AS customerId, c.name AS customer, c.phone
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    ORDER BY o.delivery_date ASC, o.created_at DESC
  `);
  res.json(orders);
});

ordersRouter.get('/:id', auth, async (req, res) => {
  const order = await getOrderDetail(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  res.json(order);
});

ordersRouter.post('/', auth, async (req, res) => {
  const { customer, deliveryDate, deliveryAddress, notes, items } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'El pedido necesita al menos un producto' });

  await query(
    `INSERT INTO customers (name, phone, email, preferences, total_orders)
     VALUES (?, ?, ?, ?, 0)
     ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), preferences = VALUES(preferences)`,
    [customer.name, customer.phone, customer.email || null, customer.preferences || '']
  );
  const [savedCustomer] = await query('SELECT id FROM customers WHERE phone = ?', [customer.phone]);

  const productIds = items.map(item => item.productId);
  const placeholders = productIds.map(() => '?').join(',');
  const products = await query(`SELECT id, price FROM products WHERE id IN (${placeholders})`, productIds);
  const priceById = new Map(products.map(product => [product.id, Number(product.price)]));
  const total = items.reduce((sum, item) => sum + (priceById.get(Number(item.productId)) || 0) * Number(item.quantity), 0);

  const result = await query(
    `INSERT INTO orders (customer_id, delivery_date, delivery_address, notes, total, payment_status)
     VALUES (?, ?, ?, ?, ?, 'simulado')`,
    [savedCustomer.id, deliveryDate, deliveryAddress, notes || '', total]
  );

  for (const item of items) {
    const unitPrice = priceById.get(Number(item.productId)) || 0;
    await query(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [result.insertId, item.productId, item.quantity, unitPrice]
    );
  }

  await query('UPDATE customers SET total_orders = total_orders + 1 WHERE id = ?', [savedCustomer.id]);
  const [order] = await query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
  res.status(201).json(order);
});

ordersRouter.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  await query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ id: Number(req.params.id), status });
});

ordersRouter.put('/:id', auth, async (req, res) => {
  const { customer, deliveryDate, deliveryAddress, notes, items, status = 'nuevo' } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'El pedido necesita al menos un producto' });

  await query(
    `INSERT INTO customers (name, phone, email, preferences, total_orders, active)
     VALUES (?, ?, ?, ?, 0, TRUE)
     ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), preferences = VALUES(preferences), active = TRUE`,
    [customer.name, customer.phone, customer.email || null, customer.preferences || '']
  );
  const [savedCustomer] = await query('SELECT id FROM customers WHERE phone = ?', [customer.phone]);

  const productIds = items.map(item => item.productId);
  const placeholders = productIds.map(() => '?').join(',');
  const products = await query(`SELECT id, price FROM products WHERE id IN (${placeholders})`, productIds);
  const priceById = new Map(products.map(product => [product.id, Number(product.price)]));
  const total = items.reduce((sum, item) => sum + (priceById.get(Number(item.productId)) || 0) * Number(item.quantity), 0);

  await query(
    `UPDATE orders
     SET customer_id = ?, delivery_date = ?, delivery_address = ?, notes = ?, total = ?, status = ?
     WHERE id = ?`,
    [savedCustomer.id, deliveryDate, deliveryAddress, notes || '', total, status, req.params.id]
  );

  await query('DELETE FROM order_items WHERE order_id = ?', [req.params.id]);
  for (const item of items) {
    const unitPrice = priceById.get(Number(item.productId)) || 0;
    await query(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [req.params.id, item.productId, item.quantity, unitPrice]
    );
  }

  const order = await getOrderDetail(req.params.id);
  res.json(order);
});

ordersRouter.patch('/:id/cancel', auth, async (req, res) => {
  await query('UPDATE orders SET status = ? WHERE id = ?', ['cancelado', req.params.id]);
  res.json({ id: Number(req.params.id), status: 'cancelado' });
});
