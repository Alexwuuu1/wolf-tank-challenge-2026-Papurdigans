import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const catalogRouter = Router();

catalogRouter.get('/products', async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  const products = await query(`
    SELECT p.id, p.category_id AS categoryId, p.name, p.description, p.price, p.image_url AS imageUrl, p.active, c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE ? = TRUE OR p.active = TRUE
    ORDER BY p.id
  `, [includeInactive]);
  res.json(products);
});

catalogRouter.get('/categories', async (_req, res) => {
  const categories = await query(`
    SELECT id, name, description, active
    FROM categories
    WHERE active = TRUE
    ORDER BY name
  `);
  res.json(categories);
});

catalogRouter.post('/products', auth, async (req, res) => {
  const { categoryId, name, description, price, imageUrl, active = true } = req.body;
  if (!categoryId || !name || !description || !price || !imageUrl) {
    return res.status(400).json({ message: 'Faltan datos del producto' });
  }

  const result = await query(
    `INSERT INTO products (category_id, name, description, price, image_url, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [categoryId, name, description, Number(price), imageUrl, Boolean(active)]
  );

  const [product] = await query(`
    SELECT p.id, p.category_id AS categoryId, p.name, p.description, p.price, p.image_url AS imageUrl, p.active, c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `, [result.insertId]);
  res.status(201).json(product);
});

catalogRouter.put('/products/:id', auth, async (req, res) => {
  const { categoryId, name, description, price, imageUrl, active = true } = req.body;
  if (!categoryId || !name || !description || !price || !imageUrl) {
    return res.status(400).json({ message: 'Faltan datos del producto' });
  }

  await query(
    `UPDATE products
     SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, active = ?
     WHERE id = ?`,
    [categoryId, name, description, Number(price), imageUrl, Boolean(active), req.params.id]
  );

  const [product] = await query(`
    SELECT p.id, p.category_id AS categoryId, p.name, p.description, p.price, p.image_url AS imageUrl, p.active, c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `, [req.params.id]);
  res.json(product);
});

catalogRouter.patch('/products/:id/active', auth, async (req, res) => {
  const active = Boolean(req.body.active);
  await query('UPDATE products SET active = ? WHERE id = ?', [active, req.params.id]);
  res.json({ id: Number(req.params.id), active });
});
