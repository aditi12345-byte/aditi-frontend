const crypto = require('crypto');
const database = require('../config/db');
const { supabase, getLocalDb, saveLocalDb } = database;

const isUsingLocalFallback = () => database.isUsingLocalFallback();
const canUseLocalFallback = (error) =>
  ['PGRST205', '42P01'].includes(error.code) ||
  /could not find the table .* in the schema cache|relation .* does not exist/i.test(error.message || '');

/**
 * Service layer abstraction for Supabase PostgreSQL tables:
 * - users
 * - transactions
 * - budgets
 * - savings_goals
 */

const generateUUID = () => crypto.randomUUID();

// ================= USER OPERATIONS =================
const findUserByEmail = async (email) => {
  if (supabase && !isUsingLocalFallback()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      if (!canUseLocalFallback(error)) throw error;
      database.activateLocalFallback(error.message);
    }
  }

  const db = getLocalDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
};

const findUserById = async (id) => {
  if (supabase && !isUsingLocalFallback()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, created_at')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      if (!canUseLocalFallback(error)) throw error;
      database.activateLocalFallback(error.message);
    }
  }

  const db = getLocalDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at
  };
};

const createUser = async ({ name, email, password_hash }) => {
  const newUser = {
    id: generateUUID(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password_hash,
    created_at: new Date().toISOString()
  };

  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const db = getLocalDb();
    db.users.push(newUser);
    saveLocalDb(db);
    return newUser;
  }
};

// ================= TRANSACTION OPERATIONS =================
const getTransactions = async (userId, filters = {}) => {
  const { type, category, search, startDate, endDate, sort = 'desc' } = filters;

  if (supabase && !isUsingLocalFallback()) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);
    if (startDate) query = query.gte('transaction_date', startDate);
    if (endDate) query = query.lte('transaction_date', endDate);
    if (search) query = query.ilike('description', `%${search}%`);

    query = query.order('transaction_date', { ascending: sort === 'asc' })
      .order('created_at', { ascending: sort === 'asc' });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } else {
    const db = getLocalDb();
    let list = db.transactions.filter((t) => t.user_id === userId);

    if (type) list = list.filter((t) => t.type === type);
    if (category) list = list.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    if (startDate) list = list.filter((t) => t.transaction_date >= startDate);
    if (endDate) list = list.filter((t) => t.transaction_date <= endDate);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => (t.description && t.description.toLowerCase().includes(q)) || (t.category && t.category.toLowerCase().includes(q)));
    }

    list.sort((a, b) => {
      const diff = new Date(b.transaction_date) - new Date(a.transaction_date);
      return sort === 'asc' ? -diff : diff;
    });

    return list;
  }
};

const getTransactionById = async (userId, id) => {
  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } else {
    const db = getLocalDb();
    return db.transactions.find((t) => t.id === id && t.user_id === userId) || null;
  }
};

const createTransaction = async (userId, transactionData) => {
  const newTx = {
    id: generateUUID(),
    user_id: userId,
    type: transactionData.type,
    amount: Number(transactionData.amount),
    category: transactionData.category,
    description: transactionData.description || '',
    payment_method: transactionData.payment_method || 'UPI',
    transaction_date: transactionData.transaction_date,
    notes: transactionData.notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([newTx])
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const db = getLocalDb();
    db.transactions.push(newTx);
    saveLocalDb(db);
    return newTx;
  }
};

const updateTransaction = async (userId, id, updates) => {
  const updatedFields = {
    ...updates,
    amount: updates.amount !== undefined ? Number(updates.amount) : undefined,
    updated_at: new Date().toISOString()
  };

  // Clean undefined
  Object.keys(updatedFields).forEach((key) => updatedFields[key] === undefined && delete updatedFields[key]);

  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updatedFields)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const db = getLocalDb();
    const idx = db.transactions.findIndex((t) => t.id === id && t.user_id === userId);
    if (idx === -1) return null;

    db.transactions[idx] = {
      ...db.transactions[idx],
      ...updatedFields
    };
    saveLocalDb(db);
    return db.transactions[idx];
  }
};

const deleteTransaction = async (userId, id) => {
  if (supabase && !isUsingLocalFallback()) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } else {
    const db = getLocalDb();
    const initialLen = db.transactions.length;
    db.transactions = db.transactions.filter((t) => !(t.id === id && t.user_id === userId));
    saveLocalDb(db);
    return db.transactions.length < initialLen;
  }
};

// ================= BUDGET OPERATIONS =================
const getBudgets = async (userId, month) => {
  const activeMonth = month || new Date().toISOString().slice(0, 7);

  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', activeMonth);

    if (error) throw error;
    return data || [];
  } else {
    const db = getLocalDb();
    return db.budgets.filter((b) => b.user_id === userId && b.month === activeMonth);
  }
};

const upsertBudget = async (userId, { category, amount, month }) => {
  const activeMonth = month || new Date().toISOString().slice(0, 7);
  const numAmount = Number(amount);

  if (supabase && !isUsingLocalFallback()) {
    // Check existing
    const { data: existing } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .eq('month', activeMonth)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('budgets')
        .update({ amount: numAmount, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const newBudget = {
        id: generateUUID(),
        user_id: userId,
        category,
        amount: numAmount,
        month: activeMonth,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('budgets')
        .insert([newBudget])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  } else {
    const db = getLocalDb();
    const existingIdx = db.budgets.findIndex((b) => b.user_id === userId && b.category === category && b.month === activeMonth);
    if (existingIdx !== -1) {
      db.budgets[existingIdx].amount = numAmount;
      db.budgets[existingIdx].updated_at = new Date().toISOString();
      saveLocalDb(db);
      return db.budgets[existingIdx];
    } else {
      const newBudget = {
        id: generateUUID(),
        user_id: userId,
        category,
        amount: numAmount,
        month: activeMonth,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.budgets.push(newBudget);
      saveLocalDb(db);
      return newBudget;
    }
  }
};

const deleteBudget = async (userId, id) => {
  if (supabase && !isUsingLocalFallback()) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } else {
    const db = getLocalDb();
    const initialLen = db.budgets.length;
    db.budgets = db.budgets.filter((b) => !(b.id === id && b.user_id === userId));
    saveLocalDb(db);
    return db.budgets.length < initialLen;
  }
};

// ================= SAVINGS GOAL OPERATIONS =================
const getSavingsGoals = async (userId) => {
  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } else {
    const db = getLocalDb();
    return db.savings_goals
      .filter((g) => g.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

const createSavingsGoal = async (userId, goalData) => {
  const newGoal = {
    id: generateUUID(),
    user_id: userId,
    title: goalData.title.trim(),
    target_amount: Number(goalData.target_amount),
    current_amount: Number(goalData.current_amount || 0),
    target_date: goalData.target_date || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([newGoal])
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const db = getLocalDb();
    db.savings_goals.push(newGoal);
    saveLocalDb(db);
    return newGoal;
  }
};

const updateSavingsGoal = async (userId, id, updates) => {
  const updatedFields = {
    ...updates,
    target_amount: updates.target_amount !== undefined ? Number(updates.target_amount) : undefined,
    current_amount: updates.current_amount !== undefined ? Number(updates.current_amount) : undefined,
    updated_at: new Date().toISOString()
  };

  Object.keys(updatedFields).forEach((key) => updatedFields[key] === undefined && delete updatedFields[key]);

  if (supabase && !isUsingLocalFallback()) {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(updatedFields)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const db = getLocalDb();
    const idx = db.savings_goals.findIndex((g) => g.id === id && g.user_id === userId);
    if (idx === -1) return null;

    db.savings_goals[idx] = {
      ...db.savings_goals[idx],
      ...updatedFields
    };
    saveLocalDb(db);
    return db.savings_goals[idx];
  }
};

const deleteSavingsGoal = async (userId, id) => {
  if (supabase && !isUsingLocalFallback()) {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } else {
    const db = getLocalDb();
    const initialLen = db.savings_goals.length;
    db.savings_goals = db.savings_goals.filter((g) => !(g.id === id && g.user_id === userId));
    saveLocalDb(db);
    return db.savings_goals.length < initialLen;
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getBudgets,
  upsertBudget,
  deleteBudget,
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal
};
