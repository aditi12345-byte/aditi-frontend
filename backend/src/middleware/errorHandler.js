const errorHandler = (err, req, res, next) => {
  // Safe logging without credentials/passwords
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  const statusCode = err.statusCode || 500;
  const isMissingSupabaseSchema =
    err.code === 'PGRST205' ||
    /could not find the table .* in the schema cache/i.test(err.message || '');
  const message = isMissingSupabaseSchema
    ? 'The application database has not been initialized yet. Please contact support and try again shortly.'
    : err.isOperational
      ? err.message
      : 'An unexpected error occurred. Please try again.';

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
