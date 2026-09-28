const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Mobile/Internet',
  'Health',
  'Gifts',
  'Other'
];

const INCOME_SOURCES = [
  'Pocket Money',
  'Scholarship',
  'Gift',
  'Part-time income',
  'Other'
];

const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Card',
  'Bank Transfer',
  'Other'
];

const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

const CATEGORY_COLORS = {
  Food: '#FF6B6B',
  Transport: '#4D96FF',
  Shopping: '#FFD93D',
  Entertainment: '#6BCB77',
  Education: '#9D4EDD',
  'Mobile/Internet': '#00B4D8',
  Health: '#FF70A6',
  Gifts: '#F77F00',
  Other: '#A0AEC0'
};

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
  CATEGORY_COLORS
};
