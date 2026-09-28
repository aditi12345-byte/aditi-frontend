const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Teenage Expense Tracker API is running on port ${config.PORT}`);
  console.log(`🔗 Health check available at: http://localhost:${config.PORT}/api/health`);
  console.log(`🌱 Environment: ${config.NODE_ENV}`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
