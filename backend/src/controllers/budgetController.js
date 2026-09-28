const dbService = require('../services/supabaseService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getBudgets = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const month = req.query.month || new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    // Get user budgets for this month
    const budgets = await dbService.getBudgets(userId, month);

    // Get all expense transactions for this month to compute actual spent
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;
    const transactions = await dbService.getTransactions(userId, {
      type: 'expense',
      startDate,
      endDate
    });

    // Calculate spent per category
    const spentMap = {};
    transactions.forEach((tx) => {
      spentMap[tx.category] = (spentMap[tx.category] || 0) + Number(tx.amount);
    });

    // Enrich budgets with spent, remaining, percentage, and warning status
    const enrichedBudgets = budgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      const remaining = Math.max(0, b.amount - spent);
      const percentage = b.amount > 0 ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0;
      const rawPercentage = b.amount > 0 ? (spent / b.amount) * 100 : 0;

      let status = 'normal';
      if (rawPercentage >= 100) {
        status = 'exceeded';
      } else if (rawPercentage >= 80) {
        status = 'warning';
      }

      return {
        ...b,
        spent,
        remaining,
        percentage,
        rawPercentage: Math.round(rawPercentage),
        status
      };
    });

    return successResponse(res, { budgets: enrichedBudgets, month }, 'Budgets retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

const createOrUpdateBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, amount, month } = req.body;

    const budget = await dbService.upsertBudget(userId, {
      category,
      amount,
      month: month || new Date().toISOString().slice(0, 7)
    });

    return successResponse(res, { budget }, 'Budget saved successfully!', 201);
  } catch (err) {
    next(err);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await dbService.deleteBudget(userId, id);
    if (!deleted) {
      return errorResponse(res, 'Budget not found or already deleted.', 404);
    }

    return successResponse(res, { id }, 'Budget deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget
};
