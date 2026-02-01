const express = require('express');
const pool = require('../config/database');
const { verifyToken, isManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Створення замовлення
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body; // items = [{ product_id, variant_id, quantity }, ...]

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    await pool.query('BEGIN');

    // Розрахунок загальної вартості
    let totalPrice = 0;
    const preparedItems = [];

    for (const item of items) {
      const variantResult = await pool.query(
        `SELECT pv.id, pv.price, pv.label, pv.grams, p.name
         FROM product_variants pv
         JOIN products p ON p.id = pv.product_id
         WHERE pv.id = $1 AND pv.product_id = $2 AND p.available = true`,
        [item.variant_id, item.product_id]
      );

      if (variantResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: `Variant ${item.variant_id} not found for product ${item.product_id}` });
      }

      const variant = variantResult.rows[0];
      const itemTotal = variant.price * item.quantity;
      totalPrice += itemTotal;

      preparedItems.push({
        product_id: item.product_id,
        variant_id: variant.id,
        variant_label: variant.label,
        variant_grams: variant.grams,
        price: variant.price,
        quantity: item.quantity
      });
    }

    // Створення замовлення
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, totalPrice, 'pending']
    );

    const orderId = orderResult.rows[0].id;

    // Додавання предметів замовлення
    for (const item of preparedItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, variant_label, variant_grams, quantity, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, item.product_id, item.variant_id, item.variant_label, item.variant_grams, item.quantity, item.price]
      );
    }

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: orderResult.rows[0]
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

// Отримання всіх замовлень (для менеджера та адміна) - ВАЖЛИВО: має бути перед /:id
router.get('/all', verifyToken, isManagerOrAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as user_name, u.username as user_login, u.email as user_email,
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'variant_id', oi.variant_id,
                  'variant_label', oi.variant_label,
                  'variant_grams', oi.variant_grams,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'product_name', p.name
                )
              ) as items
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id, u.name, u.username, u.email
       ORDER BY o.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отримання замовлень користувача
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'variant_id', oi.variant_id,
          'variant_label', oi.variant_label,
          'variant_grams', oi.variant_grams,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name
        )
       ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отримання одного замовлення
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'variant_id', oi.variant_id,
          'variant_label', oi.variant_label,
          'variant_grams', oi.variant_grams,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name
        )
       ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Оновлення статусу замовлення (менеджер/адмін)
router.patch('/:id/status', verifyToken, isManagerOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
