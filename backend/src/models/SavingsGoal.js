/**
 * Savings Goal Model definition & validation
 */

class SavingsGoal {
  constructor({ id, user_id, title, target_amount, current_amount, target_date, created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.target_amount = Number(target_amount);
    this.current_amount = Number(current_amount || 0);
    this.target_date = target_date || null;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Goal title is required (e.g., New Headphones, Laptop, Concert Ticket)');
    }

    const target = Number(data.target_amount);
    if (isNaN(target) || target <= 0) {
      errors.push('Target amount must be a positive number');
    }

    if (data.current_amount !== undefined && (isNaN(Number(data.current_amount)) || Number(data.current_amount) < 0)) {
      errors.push('Current amount cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = SavingsGoal;
