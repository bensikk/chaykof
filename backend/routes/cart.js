const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Отримати кошик користувача
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, ci.product_id, ci.variant_id, ci.quantity,
              p.name, p.description, p.image_url, p.price as base_price,
              pv.label as variant_label, pv.grams as variant_grams, pv.price as variant_price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       WHERE ci.user_id = $1 AND p.available = true
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Додати товар в кошик
router.post('/', verifyToken, async (req, res) => {
  try {
    const { product_id, variant_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Перевірка чи існує товар
    const productCheck = await pool.query(
      'SELECT id FROM products WHERE id = $1 AND available = true',
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or unavailable' });
    }

    // Перевірка чи товар вже в кошику
    const existingItem = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant_id = $3',
      [req.user.id, product_id, variant_id]
    );

    if (existingItem.rows.length > 0) {
      // Оновити кількість
      const newQuantity = existingItem.rows[0].quantity + quantity;
      await pool.query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Додати новий товар
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES ($1, $2, $3, $4)',
        [req.user.id, product_id, variant_id, quantity]
      );
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Оновити кількість товару в кошику
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
      [quantity, cartItemId, req.user.id]
    );

    res.json({ message: 'Cart item updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Видалити товар з кошика
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cartItemId = req.params.id;

    await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
      [cartItemId, req.user.id]
    );

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Очистити кошик
router.delete('/', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
