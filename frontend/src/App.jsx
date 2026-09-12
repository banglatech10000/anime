import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimeDetails from './pages/AnimeDetails';
import AnimePlayer from './pages/AnimePlayer';
import Watchlist from './pages/Watchlist';
import AdminDashboard from './pages/Admin/AdminDashboard';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verify token
      setUser({ id: 1, email: 'user@example.com', role: 'user' });
    }
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/anime/:id/episode/:ep" element={<AnimePlayer />} />
        <Route path="/watchlist" element={<Watchlist />} />
        {user?.role === 'admin' && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
