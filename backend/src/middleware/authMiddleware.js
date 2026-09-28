const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { errorResponse } = require('../utils/responseHandler');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No authentication token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'Access denied. Token is missing.', 401);
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      // Strictly derive user_id from the verified JWT payload, NEVER trust req.body.user_id
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      };
      next();
    } catch (tokenErr) {
      return errorResponse(res, 'Invalid or expired authentication session. Please login again.', 401);
    }
  } catch (error) {
    return errorResponse(res, 'Authentication verification failed.', 500);
  }
};

module.exports = authMiddleware;
