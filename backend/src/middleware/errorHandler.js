const errorHandler = (err, req, res, next) => {
  // Safe logging without credentials/passwords
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'An unexpected error occurred. Please try again.';

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
