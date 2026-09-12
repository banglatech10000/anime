const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ওয়াচলিস্টে যোগ করো
router.post('/', authenticateToken, async (req, res) => {
  const { anime_id } = req.body;
  
  if (!anime_id) {
    return res.status(400).json({ error: 'anime_id required' });
  }
  
  try {
    await pool.query(
      'INSERT INTO watchlist (user_id, anime_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, anime_id]
    );
    
    res.json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ওয়াচলিস্ট থেকে রিমুভ করো
router.delete('/:anime_id', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND anime_id = $2',
      [req.user.id, req.params.anime_id]
    );
    
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ওয়াচলিস্ট পাও
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.* FROM anime a 
       JOIN watchlist w ON a.id = w.anime_id 
       WHERE w.user_id = $1 ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
