import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AnimeCard.css';

function AnimeCard({ anime }) {
  return (
    <Link to={`/anime/${anime.id}`} className="anime-card">
      <img src={`/uploads/${anime.poster}`} alt={anime.title} />
      <div className="card-info">
        <h3>{anime.title}</h3>
        <p>⭐ {anime.rating}</p>
        <p>{anime.episodes || '?'} Episodes</p>
      </div>
    </Link>
  );
}

export default AnimeCard;
