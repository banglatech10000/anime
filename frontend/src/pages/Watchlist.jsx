import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeCard from '../components/AnimeCard';
import '../styles/Watchlist.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(response.data);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="watchlist">
      <h1>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>No anime in watchlist</p>
      ) : (
        <div className="anime-grid">
          {watchlist.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
