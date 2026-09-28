/**
 * Rule-Based Recommendation Engine for Teen Financial Wellness
 * Focuses on:
 * - Budgeting awareness
 * - Healthy saving habits
 * - Tracking daily expenses
 * - Avoiding impulsive purchases
 * - Understanding teen spending patterns
 * 
 * Strict Constraint: NO investment schemes, loans, credit cards, or risky financial products.
 */

const generateSuggestions = ({ totalIncome, totalExpense, categoryTotals, budgets = [], savingsRate = 0, previousMonthExpense = 0 }) => {
  const suggestions = [];

  // 1. Overall Balance and Cashflow Analysis
  if (totalIncome > 0 && totalExpense > totalIncome) {
    suggestions.push({
      id: 'tip-overspending',
      type: 'warning',
      category: 'Overall',
      icon: 'alert-triangle',
      title: 'Spending exceeds income',
      message: 'You have spent more than you received this month. Take a pause before new purchases and focus on essentials.'
    });
  } else if (totalIncome > 0 && savingsRate >= 25) {
    suggestions.push({
      id: 'tip-star-saver',
      type: 'success',
      category: 'Savings',
      icon: 'sparkles',
      title: 'Awesome saving habit!',
      message: `You saved ${Math.round(savingsRate)}% of your pocket money this month! Consistent saving early on creates great life habits.`
    });
  } else if (totalIncome > 0 && savingsRate < 10) {
    suggestions.push({
      id: 'tip-low-savings',
      type: 'info',
      category: 'Savings',
      icon: 'piggy-bank',
      title: 'Try the "Pay Yourself First" rule',
      message: 'Try setting aside a small portion (like 10-20%) of your pocket money immediately when you get it, before spending the rest.'
    });
  }

  // 2. Category-Specific Rules (Percentage of total expenses)
  if (totalExpense > 0) {
    const foodSpent = categoryTotals['Food'] || 0;
    const foodRatio = (foodSpent / totalExpense) * 100;
    if (foodRatio >= 35) {
      suggestions.push({
        id: 'tip-food-high',
        type: 'warning',
        category: 'Food',
        icon: 'utensils',
        title: 'Food is taking a big bite of your wallet',
        message: `Food represents ${Math.round(foodRatio)}% of your expenses this month. Packing home snacks or setting a weekly canteen budget can save serious cash!`
      });
    }

    const entertainmentSpent = categoryTotals['Entertainment'] || 0;
    const entertainmentRatio = (entertainmentSpent / totalExpense) * 100;
    if (entertainmentRatio >= 25) {
      suggestions.push({
        id: 'tip-ent-high',
        type: 'info',
        category: 'Entertainment',
        icon: 'gamepad-2',
        title: 'Entertainment spending is up',
        message: `Entertainment took ${Math.round(entertainmentRatio)}% of your spending this month. Look out for student discounts or fun free hangout spots.`
      });
    }

    const transportSpent = categoryTotals['Transport'] || 0;
    const transportRatio = (transportSpent / totalExpense) * 100;
    if (transportRatio >= 20) {
      suggestions.push({
        id: 'tip-transport-high',
        type: 'info',
        category: 'Transport',
        icon: 'bus',
        title: 'Transport expenses check',
        message: 'Your travel spending is notable this month. Review cab or auto rides, or check if student transit passes or sharing rides can help reduce costs.'
      });
    }

    const shoppingSpent = categoryTotals['Shopping'] || 0;
    const shoppingRatio = (shoppingSpent / totalExpense) * 100;
    if (shoppingRatio >= 30) {
      suggestions.push({
        id: 'tip-shopping-rule',
        type: 'tip',
        category: 'Shopping',
        icon: 'shopping-bag',
        title: 'Try the 24-Hour Rule',
        message: 'Before buying clothes, gadgets, or accessories, wait 24 hours. If you still feel you really need it after a day, then go for it!'
      });
    }
  }

  // 3. Budget alerts integration
  budgets.forEach((b) => {
    const spent = categoryTotals[b.category] || 0;
    const percentage = b.amount > 0 ? (spent / b.amount) * 100 : 0;

    if (percentage >= 100) {
      suggestions.push({
        id: `tip-budget-exceeded-${b.category}`,
        type: 'danger',
        category: b.category,
        icon: 'alert-circle',
        title: `${b.category} Budget Exceeded!`,
        message: `You've used ${Math.round(percentage)}% of your ₹${b.amount} limit for ${b.category}. Try holding off on further purchases in this category.`
      });
    } else if (percentage >= 80) {
      suggestions.push({
        id: `tip-budget-warning-${b.category}`,
        type: 'warning',
        category: b.category,
        icon: 'clock',
        title: `${b.category} Budget Warning`,
        message: `You've reached ${Math.round(percentage)}% of your ₹${b.amount} ${b.category} budget. Keep an eye on remaining days this month.`
      });
    }
  });

  // Default friendly advice if few transactions exist
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'tip-default-1',
      type: 'info',
      category: 'Habits',
      icon: 'compass',
      title: 'Track every single rupee',
      message: 'Small expenses like daily snacks and sodas add up quickly. Logging them as soon as you pay keeps you fully in control.'
    });
    suggestions.push({
      id: 'tip-default-2',
      type: 'tip',
      category: 'Goals',
      icon: 'target',
      title: 'Set a savings goal',
      message: 'Having a specific target (like new sneakers, headphones, or a gaming console) makes saying "no" to impulse buys much easier.'
    });
  }

  return suggestions;
};

module.exports = {
  generateSuggestions
};
