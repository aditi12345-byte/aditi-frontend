const configuredApiUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const apiUrlWithoutTrailingSlash = configuredApiUrl.replace(/\/+$/, '');

// The backend mounts every route under `/api`. Accept either the Render origin
// or the full `/api` URL in VITE_API_BASE_URL so a missing suffix cannot break
// sign-in and sign-up requests after deployment.
const BASE_URL = apiUrlWithoutTrailingSlash.endsWith('/api')
  ? apiUrlWithoutTrailingSlash
  : `${apiUrlWithoutTrailingSlash}/api`;

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('teen_track_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('teen_track_token');
        localStorage.removeItem('teen_track_user');
        window.location.href = '/login';
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Transactions
  getTransactions: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.append(k, v);
    });
    const qs = query.toString();
    return request(`/transactions${qs ? `?${qs}` : ''}`);
  },
  createTransaction: (body) => request('/transactions', { method: 'POST', body: JSON.stringify(body) }),
  updateTransaction: (id, body) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  // Budgets
  getBudgets: (month) => request(`/budgets${month ? `?month=${month}` : ''}`),
  saveBudget: (body) => request('/budgets', { method: 'POST', body: JSON.stringify(body) }),
  deleteBudget: (id) => request(`/budgets/${id}`, { method: 'DELETE' }),

  // Savings Goals
  getSavingsGoals: () => request('/savings-goals'),
  createSavingsGoal: (body) => request('/savings-goals', { method: 'POST', body: JSON.stringify(body) }),
  updateSavingsGoal: (id, body) => request(`/savings-goals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  addDeposit: (id, deposit_amount) => request(`/savings-goals/${id}/deposit`, { method: 'POST', body: JSON.stringify({ deposit_amount }) }),
  deleteSavingsGoal: (id) => request(`/savings-goals/${id}`, { method: 'DELETE' }),

  // Analytics
  getDashboardSummary: () => request('/analytics/summary'),
  getDetailedAnalytics: () => request('/analytics/detailed')
};
