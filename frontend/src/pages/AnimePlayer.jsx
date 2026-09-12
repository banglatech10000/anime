import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Player.css';

function AnimePlayer() {
  const { id, ep } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchEpisode = async () => {
    try {
      const response = await axios.get(`/api/episodes/anime/${id}`);
      const currentEp = response.data.find(
        e => e.episode_num === parseInt(ep)
      );
      setEpisode(currentEp);
    } catch (err) {
      console.error('Error fetching episode:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchEpisode();
}, [id, ep]);

  if (loading) return <p>Loading...</p>;
  if (!episode) return <p>Episode not found</p>;

  return (
    <div className="player-container">
      <video
        width="100%"
        height="600"
        controls
        autoPlay
      >
        <source src={`/uploads/${episode.video_url}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="episode-info">
        <h2>Episode {episode.episode_num}: {episode.title}</h2>
      </div>
    </div>
  );
}

export default AnimePlayer;
