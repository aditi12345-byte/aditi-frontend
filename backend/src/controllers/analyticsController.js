const dbService = require('../services/supabaseService');
const { generateSuggestions } = require('../services/suggestionEngine');
const { successResponse } = require('../utils/responseHandler');
const { CATEGORY_COLORS } = require('../utils/constants');

const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

    // Fetch all user transactions
    const allTransactions = await dbService.getTransactions(userId);
    const budgets = await dbService.getBudgets(userId, currentMonth);
    const savingsGoals = await dbService.getSavingsGoals(userId);

    // This month's transactions
    const thisMonthTransactions = allTransactions.filter((tx) =>
      tx.transaction_date && tx.transaction_date.startsWith(currentMonth)
    );

    // Previous month calculation
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthStr = prevMonthDate.toISOString().slice(0, 7);
    const prevMonthTransactions = allTransactions.filter((tx) =>
      tx.transaction_date && tx.transaction_date.startsWith(prevMonthStr)
    );

    // Calculations
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};

    thisMonthTransactions.forEach((tx) => {
      const amt = Number(tx.amount);
      if (tx.type === 'income') {
        totalIncome += amt;
      } else if (tx.type === 'expense') {
        totalExpense += amt;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
      }
    });

    let prevMonthExpense = 0;
    let prevMonthFoodExpense = 0;
    let prevMonthTransportExpense = 0;
    prevMonthTransactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const amt = Number(tx.amount);
        prevMonthExpense += amt;
        if (tx.category === 'Food') prevMonthFoodExpense += amt;
        if (tx.category === 'Transport') prevMonthTransportExpense += amt;
      }
    });

    // All-time balance
    let allTimeIncome = 0;
    let allTimeExpense = 0;
    allTransactions.forEach((tx) => {
      const amt = Number(tx.amount);
      if (tx.type === 'income') allTimeIncome += amt;
      else if (tx.type === 'expense') allTimeExpense += amt;
    });

    const remainingBalance = allTimeIncome - allTimeExpense;
    const currentMonthNet = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, (currentMonthNet / totalIncome) * 100) : 0;

    // Highest spending category
    let highestCategory = 'None';
    let highestCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestCategoryAmount) {
        highestCategoryAmount = amt;
        highestCategory = cat;
      }
    });

    // Total saved across goals
    const totalGoalsSaved = savingsGoals.reduce((sum, g) => sum + Number(g.current_amount || 0), 0);

    // Financial health highlights
    const healthHighlights = [];
    if (totalIncome > 0 && savingsRate > 0) {
      healthHighlights.push(`You saved ${Math.round(savingsRate)}% of your pocket money this month.`);
    }
    if (categoryTotals['Food'] && categoryTotals['Food'] > prevMonthFoodExpense && prevMonthFoodExpense > 0) {
      healthHighlights.push("You're spending more on food this month compared to last month.");
    }
    if (categoryTotals['Transport'] && categoryTotals['Transport'] > prevMonthTransportExpense && prevMonthTransportExpense > 0) {
      healthHighlights.push('Transport expenses increased compared with last month.');
    }
    if (healthHighlights.length === 0) {
      healthHighlights.push('Welcome! Start tracking daily spends to reveal personalized insights.');
    }

    // Rule-based smart suggestions
    const suggestions = generateSuggestions({
      totalIncome,
      totalExpense,
      categoryTotals,
      budgets,
      savingsRate,
      previousMonthExpense: prevMonthExpense
    });

    // Recent 5 transactions
    const recentTransactions = allTransactions.slice(0, 5);

    return successResponse(
      res,
      {
        summary: {
          currentMonth,
          totalIncome,
          totalExpense,
          remainingBalance,
          currentMonthNet,
          savingsRate: Math.round(savingsRate),
          transactionCount: thisMonthTransactions.length,
          totalTransactionsAllTime: allTransactions.length,
          highestCategory,
          highestCategoryAmount,
          totalGoalsSaved
        },
        healthHighlights,
        suggestions,
        recentTransactions
      },
      'Dashboard analytics summary retrieved.'
    );
  } catch (err) {
    next(err);
  }
};

const getDetailedAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allTransactions = await dbService.getTransactions(userId, { sort: 'asc' });

    // 1. Category Breakdown for Pie / Donut Chart
    const categoryTotals = {};
    allTransactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const amt = Number(tx.amount);
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
      }
    });

    const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#94A3B8'
    }));

    // 2. Month-by-month Income vs Expense (last 6 months)
    const monthMap = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7); // '2026-03'
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthMap[key] = { monthKey: key, label, income: 0, expense: 0, net: 0 };
    }

    allTransactions.forEach((tx) => {
      if (!tx.transaction_date) return;
      const key = tx.transaction_date.slice(0, 7);
      if (monthMap[key]) {
        const amt = Number(tx.amount);
        if (tx.type === 'income') {
          monthMap[key].income += amt;
        } else if (tx.type === 'expense') {
          monthMap[key].expense += amt;
        }
        monthMap[key].net = monthMap[key].income - monthMap[key].expense;
      }
    });

    const monthlyTrends = Object.values(monthMap);

    // 3. Daily Spending Trend for current month (Line chart)
    const currentMonth = now.toISOString().slice(0, 7);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyMap = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
      dailyMap[dayStr] = { date: String(day), fullDate: dayStr, expense: 0, income: 0 };
    }

    allTransactions.forEach((tx) => {
      if (tx.transaction_date && tx.transaction_date.startsWith(currentMonth)) {
        if (dailyMap[tx.transaction_date]) {
          const amt = Number(tx.amount);
          if (tx.type === 'expense') {
            dailyMap[tx.transaction_date].expense += amt;
          } else if (tx.type === 'income') {
            dailyMap[tx.transaction_date].income += amt;
          }
        }
      }
    });

    const dailyTrends = Object.values(dailyMap);

    // 4. Monthly Spending by Category for Bar Chart
    const monthlyCategoryData = [];
    Object.keys(monthMap).slice(-3).forEach((mKey) => {
      const mObj = { month: monthMap[mKey].label };
      allTransactions
        .filter((tx) => tx.type === 'expense' && tx.transaction_date && tx.transaction_date.startsWith(mKey))
        .forEach((tx) => {
          mObj[tx.category] = (mObj[tx.category] || 0) + Number(tx.amount);
        });
      monthlyCategoryData.push(mObj);
    });

    return successResponse(
      res,
      {
        categoryBreakdown: categoryData,
        monthlyTrends,
        dailyTrends,
        monthlyCategoryData
      },
      'Detailed analytics retrieved successfully.'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardSummary,
  getDetailedAnalytics
};
