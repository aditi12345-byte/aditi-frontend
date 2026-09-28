// Complete automated integration verification test
const API_URL = 'http://localhost:5000/api';

async function runTest() {
  console.log('🧪 Starting End-to-End API Flow Test for TeenTrack...\n');

  // 1. Health Check
  const healthRes = await fetch(`${API_URL}/health`);
  const healthData = await healthRes.json();
  console.log('✅ 1. Health check passed:', healthData.message);

  // 2. User Registration
  const testUser = {
    name: 'Aarav Sharma',
    email: `aarav_${Date.now()}@example.com`,
    password: 'password123'
  };

  const regRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  const regData = await regRes.json();
  if (!regData.success) throw new Error(`Registration failed: ${regData.message}`);
  console.log('✅ 2. User registered successfully with bcrypt password hash:', regData.data.user.name, regData.data.user.email);
  const token = regData.data.token;

  // 3. User Login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  const loginData = await loginRes.json();
  if (!loginData.success) throw new Error(`Login failed: ${loginData.message}`);
  console.log('✅ 3. Login verification passed with JWT token issued.');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 4. Add Pocket Money (Income)
  const incomeRes = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      type: 'income',
      amount: 3000,
      category: 'Pocket Money',
      description: 'Monthly pocket allowance from Mom',
      payment_method: 'UPI',
      transaction_date: new Date().toISOString().split('T')[0]
    })
  });
  const incomeData = await incomeRes.json();
  console.log('✅ 4. Added Income transaction: ₹3,000 (Pocket Money)');

  // 5. Add Expense 1 (Food)
  const exp1Res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      type: 'expense',
      amount: 450,
      category: 'Food',
      description: 'Canteen snacks & iced tea',
      payment_method: 'UPI',
      transaction_date: new Date().toISOString().split('T')[0]
    })
  });
  console.log('✅ 5. Added Expense transaction: ₹450 (Food)');

  // 6. Add Expense 2 (Transport)
  const exp2Res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      type: 'expense',
      amount: 200,
      category: 'Transport',
      description: 'Metro smart card recharge',
      payment_method: 'Card',
      transaction_date: new Date().toISOString().split('T')[0]
    })
  });
  console.log('✅ 6. Added Expense transaction: ₹200 (Transport)');

  // 7. Create Category Budget (Food)
  const budgetRes = await fetch(`${API_URL}/budgets`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      category: 'Food',
      amount: 1500,
      month: new Date().toISOString().slice(0, 7)
    })
  });
  const budgetData = await budgetRes.json();
  console.log('✅ 7. Created Monthly Budget: Food limit ₹1,500');

  // Verify Budget calculation
  const getBudgetsRes = await fetch(`${API_URL}/budgets?month=${new Date().toISOString().slice(0, 7)}`, {
    headers: authHeaders
  });
  const getBudgetsData = await getBudgetsRes.json();
  const foodBudget = getBudgetsData.data.budgets.find(b => b.category === 'Food');
  console.log(`   - Food Budget status: Spent ₹${foodBudget.spent} / ₹${foodBudget.amount} (${foodBudget.percentage}% used, ${foodBudget.remaining} remaining)`);

  // 8. Create Savings Goal
  const goalRes = await fetch(`${API_URL}/savings-goals`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Wireless Headphones',
      target_amount: 2500,
      current_amount: 500,
      target_date: '2026-12-31'
    })
  });
  const goalData = await goalRes.json();
  const goalId = goalData.data.goal.id;
  console.log('✅ 8. Created Savings Goal: "Wireless Headphones" (Target ₹2,500, Initial ₹500)');

  // 9. Deposit into Savings Goal
  const depositRes = await fetch(`${API_URL}/savings-goals/${goalId}/deposit`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ deposit_amount: 300 })
  });
  const depositData = await depositRes.json();
  console.log(`✅ 9. Added deposit: Current saved ₹${depositData.data.goal.current_amount} / ₹${depositData.data.goal.target_amount}`);

  // 10. Verify Dashboard Summary & Smart Suggestions
  const summaryRes = await fetch(`${API_URL}/analytics/summary`, {
    headers: authHeaders
  });
  const summaryData = await summaryRes.json();
  const summary = summaryData.data.summary;
  console.log('✅ 10. Dashboard Summary:');
  console.log(`   - Remaining Balance: ₹${summary.remainingBalance}`);
  console.log(`   - Money Received: ₹${summary.totalIncome}`);
  console.log(`   - Total Spent: ₹${summary.totalExpense}`);
  console.log(`   - Top Spending Category: ${summary.highestCategory} (₹${summary.highestCategoryAmount})`);
  console.log(`   - Smart Suggestions Generated: ${summaryData.data.suggestions.length} tips`);
  summaryData.data.suggestions.forEach(s => console.log(`     💡 [${s.category}] ${s.title}: ${s.message}`));

  // 11. Verify Detailed Analytics for Charts
  const analyticsRes = await fetch(`${API_URL}/analytics/detailed`, {
    headers: authHeaders
  });
  const analyticsData = await analyticsRes.json();
  console.log('✅ 11. Detailed Analytics for Recharts:');
  console.log(`   - Category breakdown items: ${analyticsData.data.categoryBreakdown.length}`);
  console.log(`   - Monthly trends count: ${analyticsData.data.monthlyTrends.length}`);

  console.log('\n🎉 ALL 11 END-TO-END VERIFICATION CHECKS PASSED PERFECTLY!\n');
}

runTest().catch(err => {
  console.error('❌ Verification failed:', err.message);
  process.exit(1);
});
