const express = require('express');
const jikanService = require('../services/jikanService');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Jikan সার্চ
router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }
  
  try {
    const results = await jikanService.searchAnime(query, 50);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Jikan বিস্তারিত
router.get('/details/:jikanId', async (req, res) => {
  try {
    const details = await jikanService.getAnimeDetails(req.params.jikanId);
    
    if (!details) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch details' });
  }
});

// Jikan থেকে ইমপোর্ট (Admin)
router.post('/import/:jikanId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const animeId = await jikanService.importAnimeFromJikan(req.params.jikanId, req.user.id);
    
    if (!animeId) {
      return res.status(400).json({ error: 'Import failed' });
    }
    
    res.json({ animeId, message: 'Imported successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Import error' });
  }
});

module.exports = router;
