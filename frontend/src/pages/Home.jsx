import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeCard from '../components/AnimeCard';
import '../styles/Home.css';

function Home() {
  const [anime, setAnime] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await axios.get('/api/anime', {
        params: { search: searchTerm, limit: 50 }
      });
      setAnime(response.data.data);
    } catch (err) {
      console.error('Error fetching anime:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnime(search);
  };

  return (
    <div className="home">
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search anime..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="anime-grid">
          {anime.map(item => (
            <AnimeCard key={item.id} anime={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
