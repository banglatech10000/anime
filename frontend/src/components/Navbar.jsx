import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎌 AnimeHub
        </Link>
        
        <div className="navbar-menu">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/watchlist">Watchlist</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
