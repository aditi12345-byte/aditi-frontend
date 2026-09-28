/**
 * Utilities for formatting Currency in Indian Rupees (₹), Dates, and Numbers
 */

export const formatCurrency = (amount, showDecimals = false) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatMonth = (monthString) => {
  if (!monthString) return '';
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const getCategoryColor = (category) => {
  const colors = {
    Food: '#FF6B6B',
    Transport: '#4D96FF',
    Shopping: '#FFD93D',
    Entertainment: '#6BCB77',
    Education: '#9D4EDD',
    'Mobile/Internet': '#00B4D8',
    Health: '#FF70A6',
    Gifts: '#F77F00',
    'Pocket Money': '#10B981',
    Scholarship: '#3B82F6',
    'Part-time income': '#8B5CF6',
    Other: '#A0AEC0'
  };
  return colors[category] || '#A0AEC0';
};
