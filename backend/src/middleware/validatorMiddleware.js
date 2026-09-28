const { errorResponse } = require('../utils/responseHandler');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

const validateRegister = (req, res, next) => {
  const { isValid, errors } = User.validate(req.body);
  if (!isValid) {
    return errorResponse(res, errors[0], 400, errors);
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return errorResponse(res, 'Both email and password are required', 400);
  }
  next();
};

const validateTransaction = (req, res, next) => {
  const { isValid, errors } = Transaction.validate(req.body);
  if (!isValid) {
    return errorResponse(res, errors[0], 400, errors);
  }
  next();
};

const validateBudget = (req, res, next) => {
  const { isValid, errors } = Budget.validate(req.body);
  if (!isValid) {
    return errorResponse(res, errors[0], 400, errors);
  }
  next();
};

const validateSavingsGoal = (req, res, next) => {
  const { isValid, errors } = SavingsGoal.validate(req.body);
  if (!isValid) {
    return errorResponse(res, errors[0], 400, errors);
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTransaction,
  validateBudget,
  validateSavingsGoal
};
