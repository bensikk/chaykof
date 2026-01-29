const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Отримання всіх категорій
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отримання однієї категорії з товарами
router.get('/:id', async (req, res) => {
  try {
    const categoryResult = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [req.params.id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const productsResult = await pool.query(
      'SELECT * FROM products WHERE category_id = $1 AND available = true',
      [req.params.id]
    );

    res.json({
      category: categoryResult.rows[0],
      products: productsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
