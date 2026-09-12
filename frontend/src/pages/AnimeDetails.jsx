import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AnimeDetails.css';

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAnimeDetails = async () => {
    try {
      const animeRes = await axios.get(`/api/anime/${id}`);
      setAnime(animeRes.data);

      const episodesRes = await axios.get(`/api/episodes/anime/${id}`);
      setEpisodes(episodesRes.data);
    } catch (err) {
      console.error('Error fetching anime details:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchAnimeDetails();
}, [id]);
  
  if (loading) return <p>Loading...</p>;
  if (!anime) return <p>Anime not found</p>;

  return (
    <div className="anime-details">
      <div className="anime-header">
        <img src={`/uploads/${anime.poster}`} alt={anime.title} className="poster" />
        <div className="anime-info">
          <h1>{anime.title}</h1>
          <p className="rating">⭐ {anime.rating}</p>
          <p className="description">{anime.description}</p>
          <p className="genre">Genre: {anime.genre}</p>
          <p className="episodes">Episodes: {anime.episodes}</p>
        </div>
      </div>

      <div className="episodes-section">
        <h2>Episodes</h2>
        <div className="episodes-list">
          {episodes.map(ep => (
            <Link
              key={ep.id}
              to={`/anime/${id}/episode/${ep.episode_num}`}
              className="episode-item"
            >
              EP {ep.episode_num}: {ep.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimeDetails;
