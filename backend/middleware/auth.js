const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Middleware для перевірки JWT токена
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware для перевірки ролі адміністратора
const isAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin only' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Middleware для перевірки ролі менеджера або адміна
const isManagerOrAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.rows[0].role !== 'manager' && result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Manager or Admin only' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isManagerOrAdmin
};
