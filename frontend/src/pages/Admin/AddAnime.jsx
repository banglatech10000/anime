import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Admin.css';

function AddAnime() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    total_episodes: ''
  });
  const [poster, setPoster] = useState(null);
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
    if (poster) form.append('poster', poster);

    try {
      await axios.post('/api/admin/anime', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Anime created successfully!');
      setFormData({ title: '', description: '', genre: '', total_episodes: '' });
    } catch (err) {
      setMessage('Error creating anime');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Anime</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre (comma separated)"
          value={formData.genre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="total_episodes"
          placeholder="Total Episodes"
          value={formData.total_episodes}
          onChange={handleChange}
        />
        <input
          type="file"
          onChange={(e) => setPoster(e.target.files[0])}
        />
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddAnime;
