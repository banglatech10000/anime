const axios = require('axios');
const pool = require('../db');

const JIKAN_API = 'https://api.jikan.moe/v4';

class JikanService {
  async searchAnime(query, limit = 25) {
    try {
      const response = await axios.get(`${JIKAN_API}/anime`, {
        params: { query, limit }
      });
      
      return response.data.data.map(anime => ({
        jikanId: anime.mal_id,
        title: anime.title,
        englishTitle: anime.title_english,
        description: anime.synopsis,
        poster: anime.images.jpg.large_image_url,
        genre: anime.genres.map(g => g.name),
        rating: anime.score,
        episodes: anime.episodes,
        year: anime.year
      }));
    } catch (err) {
      console.error('Jikan search error:', err.message);
      return [];
    }
  }

  async getAnimeDetails(jikanId) {
    try {
      const response = await axios.get(`${JIKAN_API}/anime/${jikanId}/full`);
      const anime = response.data.data;
      
      return {
        jikanId: anime.mal_id,
        title: anime.title,
        englishTitle: anime.title_english,
        description: anime.synopsis,
        poster: anime.images.jpg.large_image_url,
        genre: anime.genres.map(g => g.name),
        rating: anime.score,
        episodes: anime.episodes,
        status: anime.status,
        aired: anime.aired?.string,
        studios: anime.studios.map(s => s.name)
      };
    } catch (err) {
      console.error('Jikan details error:', err.message);
      return null;
    }
  }

  async importAnimeFromJikan(jikanId, userId = 1) {
    try {
      const details = await this.getAnimeDetails(jikanId);
      if (!details) return null;
      
      const result = await pool.query(
        `INSERT INTO anime (title, description, genre, poster, rating, episodes, status, jikan_id, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (jikan_id) DO UPDATE SET updated_at = NOW()
         RETURNING id`,
        [
          details.title,
          details.description,
          details.genre.join(', '),
          details.poster,
          details.rating,
          details.episodes,
          'published',
          jikanId,
          userId
        ]
      );
      
      console.log(`[+] Imported from Jikan: ${details.title}`);
      return result.rows[0].id;
    } catch (err) {
      console.error('Import error:', err.message);
      return null;
    }
  }
}

module.exports = new JikanService();
