const express = require('express');
const pool = require('../db');

const router = express.Router();

// অ্যানিমের সব এপিসোড
router.get('/anime/:animeId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, episode_num, title, video_url, duration FROM episodes WHERE anime_id = $1 ORDER BY episode_num ASC',
      [req.params.animeId]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// একটা এপিসোড পাও
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM episodes WHERE id = $1',
      [req.params.id]
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
