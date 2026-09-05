export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: true,
    message: err.message || 'Internal Spotify Service Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: true,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
};
