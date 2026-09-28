const dbService = require('../services/supabaseService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getSavingsGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goals = await dbService.getSavingsGoals(userId);

    const enrichedGoals = goals.map((g) => {
      const percentage = g.target_amount > 0 ? Math.min(100, Math.round((g.current_amount / g.target_amount) * 100)) : 0;
      const remaining = Math.max(0, g.target_amount - g.current_amount);
      const isCompleted = g.current_amount >= g.target_amount;

      return {
        ...g,
        percentage,
        remaining,
        isCompleted
      };
    });

    return successResponse(res, { goals: enrichedGoals }, 'Savings goals retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

const createSavingsGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, target_amount, current_amount, target_date } = req.body;

    const goal = await dbService.createSavingsGoal(userId, {
      title,
      target_amount,
      current_amount,
      target_date
    });

    return successResponse(res, { goal }, 'Savings goal created! Keep it up!', 201);
  } catch (err) {
    next(err);
  }
};

const updateSavingsGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, target_amount, current_amount, target_date } = req.body;

    const updated = await dbService.updateSavingsGoal(userId, id, {
      title,
      target_amount,
      current_amount,
      target_date
    });

    if (!updated) {
      return errorResponse(res, 'Savings goal not found.', 404);
    }

    return successResponse(res, { goal: updated }, 'Savings goal updated.');
  } catch (err) {
    next(err);
  }
};

const addDeposit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { deposit_amount } = req.body;

    const numDeposit = Number(deposit_amount);
    if (isNaN(numDeposit) || numDeposit <= 0) {
      return errorResponse(res, 'Deposit amount must be a positive number.', 400);
    }

    const goals = await dbService.getSavingsGoals(userId);
    const goal = goals.find((g) => g.id === id);

    if (!goal) {
      return errorResponse(res, 'Savings goal not found.', 404);
    }

    const newCurrent = Number(goal.current_amount) + numDeposit;
    const updated = await dbService.updateSavingsGoal(userId, id, {
      current_amount: newCurrent
    });

    return successResponse(res, { goal: updated }, `Awesome! Added ₹${numDeposit} to "${goal.title}".`);
  } catch (err) {
    next(err);
  }
};

const deleteSavingsGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await dbService.deleteSavingsGoal(userId, id);
    if (!deleted) {
      return errorResponse(res, 'Savings goal not found or already deleted.', 404);
    }

    return successResponse(res, { id }, 'Savings goal deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  addDeposit,
  deleteSavingsGoal
};
