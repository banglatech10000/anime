import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddAnime from './AddAnime';
import UploadEpisode from './UploadEpisode';
import '../../styles/Admin.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  fetchStats();
}, [token]);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          Add Anime
        </button>
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          Upload Episode
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stats' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.total_anime}</h3>
              <p>Total Anime</p>
            </div>
            <div className="stat-card">
              <h3>{stats.total_users}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{stats.total_episodes}</h3>
              <p>Total Episodes</p>
            </div>
          </div>
        )}

        {activeTab === 'add' && <AddAnime />}
        {activeTab === 'upload' && <UploadEpisode />}
      </div>
    </div>
  );
}

export default AdminDashboard;
