const express = require('express');
const pool = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Налаштування збереження для зображень товарів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${base}_${unique}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB максимум
  fileFilter: (req, file, cb) => {
    // Перевіряємо MIME type
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Тільки зображення дозволені'));
    } else {
      cb(null, true);
    }
  }
});

// Отримання всіх товарів
router.get('/', async (req, res) => {
  try {
    const categoryId = req.query.category;
    const params = [];

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.image_url,
        p.available,
        COALESCE(dv.price, p.price) AS price,
        c.id AS category_id,
        c.name AS category_name,
        json_agg(
          json_build_object(
            'id', pv.id,
            'label', pv.label,
            'grams', pv.grams,
            'price', pv.price,
            'is_default', pv.is_default
          )
          ORDER BY pv.price
        ) FILTER (WHERE pv.id IS NOT NULL) AS variants
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      LEFT JOIN product_variants dv ON dv.product_id = p.id AND dv.is_default = true
      WHERE p.available = true
    `;

    if (categoryId) {
      query += ' AND p.category_id = $1';
      params.push(categoryId);
    }

    query += ' GROUP BY p.id, c.id, dv.price ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отримання одного товару
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          p.id,
          p.name,
          p.description,
          p.image_url,
          p.available,
          COALESCE(dv.price, p.price) AS price,
          c.id AS category_id,
          c.name AS category_name,
          json_agg(
            json_build_object(
              'id', pv.id,
              'label', pv.label,
              'grams', pv.grams,
              'price', pv.price,
              'is_default', pv.is_default
            )
            ORDER BY pv.price
          ) FILTER (WHERE pv.id IS NOT NULL) AS variants
       FROM products p
       JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_variants pv ON pv.product_id = p.id
       LEFT JOIN product_variants dv ON dv.product_id = p.id AND dv.is_default = true
       WHERE p.id = $1
       GROUP BY p.id, c.id, dv.price`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Додавання товару (тільки адмін)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, available = true, variants } = req.body;

    await pool.query('BEGIN');

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category_id, image_url, available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, category_id, image_url, available]
    );

    const productId = result.rows[0].id;

    const providedVariants = Array.isArray(variants) ? variants : [];
    const hasDefault = providedVariants.some(v => v.is_default === true);

    if (providedVariants.length > 0) {
      for (let i = 0; i < providedVariants.length; i++) {
        const v = providedVariants[i];
        await pool.query(
          `INSERT INTO product_variants (product_id, label, grams, price, is_default)
           VALUES ($1, $2, $3, $4, $5)` ,
          [productId, v.label || 'Варіант', v.grams || null, v.price, v.is_default === true]
        );
      }

      if (!hasDefault) {
        await pool.query(
          `UPDATE product_variants SET is_default = true
           WHERE id = (
             SELECT id FROM product_variants WHERE product_id = $1 ORDER BY id LIMIT 1
           )`,
          [productId]
        );
      }
    } else {
      await pool.query(
        `INSERT INTO product_variants (product_id, label, grams, price, is_default)
         VALUES ($1, $2, $3, $4, true)` ,
        [productId, 'Стандарт', null, price]
      );
    }

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

// Оновлення товару (тільки адмін)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, available, variants } = req.body;

    await pool.query('BEGIN');

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category_id = $4, 
           image_url = $5, available = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, description, price, category_id, image_url, available, req.params.id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Product not found' });
    }

    if (Array.isArray(variants)) {
      await pool.query('DELETE FROM product_variants WHERE product_id = $1', [req.params.id]);

      const hasDefault = variants.some(v => v.is_default === true);

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        await pool.query(
          `INSERT INTO product_variants (product_id, label, grams, price, is_default)
           VALUES ($1, $2, $3, $4, $5)` ,
          [req.params.id, v.label || 'Варіант', v.grams || null, v.price, v.is_default === true]
        );
      }

      if (!hasDefault && variants.length > 0) {
        await pool.query(
          `UPDATE product_variants SET is_default = true
           WHERE id = (
             SELECT id FROM product_variants WHERE product_id = $1 ORDER BY id LIMIT 1
           )`,
          [req.params.id]
        );
      }

      if (variants.length === 0) {
        await pool.query(
          `INSERT INTO product_variants (product_id, label, grams, price, is_default)
           VALUES ($1, $2, $3, $4, true)` ,
          [req.params.id, 'Стандарт', null, price]
        );
      }
    }

    await pool.query('COMMIT');

    res.json({
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

// Видалення товару (тільки адмін)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Завантаження зображення товару (адмін) - має бути перед /:id
router.post('/upload', verifyToken, isAdmin, upload.single('image'), (req, res) => {
  console.log('Upload request:', { file: req.file?.filename, user: req.user?.id });
  
  if (!req.file) {
    console.log('No file received in upload');
    return res.status(400).json({ error: 'Файл не завантажено' });
  }
  
  try {
    const filename = req.file.filename;
    const urlPath = `/uploads/${filename}`;
    
    console.log('File uploaded successfully:', filename);
    
    res.json({ 
      success: true,
      url: urlPath,
      message: 'Зображення завантажено успішно'
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Помилка при завантаженні зображення: ' + err.message });
  }
});

// Обработчик ошибок для multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл занадто великий. Максимум 10MB' });
    }
    return res.status(400).json({ error: 'Помилка завантаження файлу: ' + err.message });
  } else if (err) {
    console.error('Upload middleware error:', err);
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
