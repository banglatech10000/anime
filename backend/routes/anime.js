const express = require('express');
const pool = require('../db');

const router = express.Router();

// সব অ্যানিমে (পাগিনেশন সহ)
router.get('/', async (req, res) => {
  const { search, genre, limit = 20, offset = 0 } = req.query;
  
  try {
    let query = 'SELECT id, title, description, poster, genre, rating, episodes FROM anime WHERE status = $1';
    let params = ['published'];
    
    if (search) {
      query += ` AND title ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }
    
    if (genre) {
      query += ` AND genre ILIKE $${params.length + 1}`;
      params.push(`%${genre}%`);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM anime WHERE status = $1', ['published']);
    
    res.json({ 
      data: result.rows, 
      total: parseInt(countResult.rows[0].count) 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// একটা অ্যানিমে পাও
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM anime WHERE id = $1 AND status = $2',
      [req.params.id, 'published']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
