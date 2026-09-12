
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(500).json({ error: 'Server error' });
};

module.exports = errorHandler;
