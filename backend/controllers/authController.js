const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  // routes/auth.js এ আছে
};

exports.login = async (req, res) => {
  // routes/auth.js এ আছে
};

exports.me = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, role FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
