/**
 * Transaction Model definition & validation
 */
const { EXPENSE_CATEGORIES, INCOME_SOURCES, PAYMENT_METHODS, TRANSACTION_TYPES } = require('../utils/constants');

class Transaction {
  constructor({
    id,
    user_id,
    type,
    amount,
    category,
    description,
    payment_method,
    transaction_date,
    notes,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.user_id = user_id;
    this.type = type;
    this.amount = Number(amount);
    this.category = category;
    this.description = description || '';
    this.payment_method = payment_method || 'UPI';
    this.transaction_date = transaction_date || new Date().toISOString().split('T')[0];
    this.notes = notes || '';
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];

    if (!data.type || ![TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE].includes(data.type)) {
      errors.push('Transaction type must be either income or expense');
    }

    const numAmount = Number(data.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.push('Amount must be a positive number greater than 0');
    }

    if (!data.category || typeof data.category !== 'string') {
      errors.push('Category or income source is required');
    }

    if (data.type === TRANSACTION_TYPES.EXPENSE && !EXPENSE_CATEGORIES.includes(data.category)) {
      errors.push(`Invalid expense category. Allowed: ${EXPENSE_CATEGORIES.join(', ')}`);
    }

    if (data.type === TRANSACTION_TYPES.INCOME && !INCOME_SOURCES.includes(data.category)) {
      errors.push(`Invalid income source. Allowed: ${INCOME_SOURCES.join(', ')}`);
    }

    if (data.payment_method && !PAYMENT_METHODS.includes(data.payment_method)) {
      errors.push(`Invalid payment method. Allowed: ${PAYMENT_METHODS.join(', ')}`);
    }

    if (!data.transaction_date) {
      errors.push('Transaction date is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Transaction;
