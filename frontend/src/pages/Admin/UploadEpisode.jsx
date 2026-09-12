import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Admin.css';

function UploadEpisode() {
  const [formData, setFormData] = useState({
    anime_id: '',
    episode_num: '',
    title: ''
  });
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    if (video) form.append('video', video);

    try {
      await axios.post('/api/admin/episodes', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Episode uploaded successfully!');
      setFormData({ anime_id: '', episode_num: '', title: '' });
    } catch (err) {
      setMessage('Error uploading episode');
    }
  };

  return (
    <div className="form-container">
      <h2>Upload Episode</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="anime_id"
          placeholder="Anime ID"
          value={formData.anime_id}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="episode_num"
          placeholder="Episode Number"
          value={formData.episode_num}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Episode Title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="file"
          onChange={(e) => setVideo(e.target.files[0])}
          accept="video/*"
          required
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadEpisode;
