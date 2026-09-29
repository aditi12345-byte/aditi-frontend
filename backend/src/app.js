const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingsGoalRoutes = require('./routes/savingsGoalRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const allowedOrigins = new Set([
  ...config.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean),
  // Production frontend hosted on Vercel. Add custom domains through CORS_ORIGIN.
  'https://aditi-frontend-xi.vercel.app'
]);

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header include Render health checks and API tools.
      if (!origin || allowedOrigins.has('*') || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin '${origin}' is not allowed by CORS.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', apiLimiter);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Public deployment check for visitors opening the Render service URL.
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Aditi API is running.',
    healthCheck: '/api/health',
    apiBasePath: '/api'
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Teenage Expense Tracker API is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Catch-All
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
