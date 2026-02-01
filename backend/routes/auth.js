const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Реєстрація
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    const normalizedUsername = username?.trim();
    const normalizedEmail = email?.trim() || null;

    if (!normalizedUsername || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Перевірка на наявність користувача
    const usernameExists = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [normalizedUsername]
    );

    if (usernameExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (normalizedEmail) {
      const emailExists = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [normalizedEmail]
      );

      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Вставка користувача
    const result = await pool.query(
      'INSERT INTO users (username, email, password, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, role',
      [normalizedUsername, normalizedEmail, hashedPassword, name, 'user']
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Логін
router.post('/login', async (req, res) => {
  try {
    const { username, login, email, password } = req.body;
    const loginValue = username?.trim() || login?.trim() || email?.trim();

    if (!loginValue || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [loginValue]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отримання профілю
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, name, role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
