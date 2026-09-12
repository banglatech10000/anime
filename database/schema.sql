CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE anime (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  genre VARCHAR(255),
  poster VARCHAR(255),
  episodes INT DEFAULT 0,
  rating FLOAT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  jikan_id INT UNIQUE,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE episodes (
  id SERIAL PRIMARY KEY,
  anime_id INT REFERENCES anime(id) ON DELETE CASCADE,
  episode_num INT NOT NULL,
  title VARCHAR(255),
  video_url VARCHAR(255),
  duration FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(anime_id, episode_num)
);

CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  anime_id INT REFERENCES anime(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

CREATE TABLE jikan_cache (
  id SERIAL PRIMARY KEY,
  jikan_id INT UNIQUE NOT NULL,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_anime_status ON anime(status);
CREATE INDEX idx_episodes_anime ON episodes(anime_id);
CREATE INDEX idx_watchlist_user ON watchlist(user_id);
CREATE INDEX idx_jikan ON anime(jikan_id);

-- ডেমো ডাটা
INSERT INTO users (email, password, username, role) VALUES 
('admin@example.com', '$2b$10$...', 'admin', 'admin'),
('user@example.com', '$2b$10$...', 'user', 'user');
