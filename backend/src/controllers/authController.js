const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const dbService = require('../services/supabaseService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const SALT_ROUNDS = 10;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already registered
    const existing = await dbService.findUserByEmail(email);
    if (existing) {
      return errorResponse(res, 'An account with this email already exists.', 400);
    }

    // Hash password with bcrypt
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Persist new user
    const newUser = await dbService.createUser({
      name,
      email,
      password_hash
    });

    const token = generateToken(newUser);

    return successResponse(
      res,
      {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          created_at: newUser.created_at
        }
      },
      'Welcome to Teenage Expense Tracker! Your account was created successfully.',
      201
    );
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid email or password credentials.', 401);
    }

    // Secure bcrypt password verification
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password credentials.', 401);
    }

    const token = generateToken(user);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        }
      },
      'Logged in successfully!'
    );
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User account not found.', 404);
    }

    return successResponse(res, { user }, 'Profile retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  return successResponse(res, null, 'Logged out successfully. Clean up local session.');
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
