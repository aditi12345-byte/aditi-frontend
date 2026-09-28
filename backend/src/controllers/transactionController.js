const dbService = require('../services/supabaseService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, category, search, startDate, endDate, sort } = req.query;

    const transactions = await dbService.getTransactions(userId, {
      type,
      category,
      search,
      startDate,
      endDate,
      sort
    });

    return successResponse(res, { transactions }, 'Transactions retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await dbService.getTransactionById(userId, id);
    if (!transaction) {
      return errorResponse(res, 'Transaction not found.', 404);
    }

    return successResponse(res, { transaction }, 'Transaction found.');
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, amount, category, description, payment_method, transaction_date, notes } = req.body;

    const newTransaction = await dbService.createTransaction(userId, {
      type,
      amount,
      category,
      description,
      payment_method,
      transaction_date,
      notes
    });

    return successResponse(res, { transaction: newTransaction }, 'Transaction added successfully!', 201);
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { type, amount, category, description, payment_method, transaction_date, notes } = req.body;

    const updated = await dbService.updateTransaction(userId, id, {
      type,
      amount,
      category,
      description,
      payment_method,
      transaction_date,
      notes
    });

    if (!updated) {
      return errorResponse(res, 'Transaction not found or not authorized to edit.', 404);
    }

    return successResponse(res, { transaction: updated }, 'Transaction updated successfully!');
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await dbService.deleteTransaction(userId, id);
    if (!deleted) {
      return errorResponse(res, 'Transaction not found or already deleted.', 404);
    }

    return successResponse(res, { id }, 'Transaction deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
