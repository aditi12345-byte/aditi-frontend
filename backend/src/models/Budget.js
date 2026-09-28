/**
 * Budget Model definition & validation
 */
const { EXPENSE_CATEGORIES } = require('../utils/constants');

class Budget {
  constructor({ id, user_id, category, amount, month, created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.category = category;
    this.amount = Number(amount);
    this.month = month || new Date().toISOString().slice(0, 7); // YYYY-MM
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    if (!data.category || !EXPENSE_CATEGORIES.includes(data.category)) {
      errors.push(`Valid category is required: ${EXPENSE_CATEGORIES.join(', ')}`);
    }

    const numAmount = Number(data.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.push('Budget limit amount must be a positive number');
    }

    if (data.month && !/^\d{4}-\d{2}$/.test(data.month)) {
      errors.push('Month must be in YYYY-MM format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Budget;
