const express = require('express');
const multer = require('multer');
const pool = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // ৫০০ MB
});

// অ্যানিমে তৈরি করো
router.post('/anime', authenticateToken, isAdmin, upload.single('poster'), async (req, res) => {
  const { title, description, genre, total_episodes } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO anime (title, description, genre, poster, total_episodes, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description || '', genre || '', req.file?.filename || '', total_episodes || 0, 'published', req.user.id]
    );
    
    res.status(201).json({ anime: result.rows[0], message: 'Anime created' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Anime already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// এপিসোড আপলোড করো
router.post('/episodes', authenticateToken, isAdmin, upload.single('video'), async (req, res) => {
  const { anime_id, episode_num, title } = req.body;
  
  if (!anime_id || !episode_num || !req.file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO episodes (anime_id, episode_num, title, video_url, duration)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [anime_id, episode_num, title || '', req.file.filename, 0]
    );
    
    res.status(201).json({ episode: result.rows[0], message: 'Episode uploaded' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// অ্যানিমে আপডেট করো
router.put('/anime/:id', authenticateToken, isAdmin, async (req, res) => {
  const { title, description, genre, status, rating } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE anime SET title=$1, description=$2, genre=$3, status=$4, rating=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [title, description, genre, status, rating, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json({ anime: result.rows[0], message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// অ্যানিমে ডিলিট করো
router.delete('/anime/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM anime WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// স্ট্যাটস
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const animeCount = await pool.query('SELECT COUNT(*) FROM anime');
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const episodeCount = await pool.query('SELECT COUNT(*) FROM episodes');
    
    res.json({
      total_anime: parseInt(animeCount.rows[0].count),
      total_users: parseInt(userCount.rows[0].count),
      total_episodes: parseInt(episodeCount.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
