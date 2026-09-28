const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const config = require('./env');

let supabase = null;
let isUsingLocalFallback = false;

// Local JSON store path for offline development fallback
const LOCAL_DB_PATH = path.join(__dirname, '..', '..', 'local_database.json');

const initLocalStore = () => {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const defaultData = {
      users: [],
      transactions: [],
      budgets: [],
      savings_goals: []
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
};

if (config.SUPABASE_URL && config.SUPABASE_KEY && !config.SUPABASE_URL.includes('your-project-id')) {
  try {
    supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY, {
      auth: {
        persistSession: false
      }
    });
    console.log('✅ Supabase PostgreSQL Client initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error.message);
    isUsingLocalFallback = true;
    initLocalStore();
  }
} else {
  console.log('ℹ️ Supabase credentials not set in .env. Using resilient local store engine for seamless development.');
  isUsingLocalFallback = true;
  initLocalStore();
}

const getLocalDb = () => {
  try {
    initLocalStore();
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading local db:', err);
    return { users: [], transactions: [], budgets: [], savings_goals: [] };
  }
};

const saveLocalDb = (data) => {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local db:', err);
  }
};

module.exports = {
  supabase,
  isUsingLocalFallback,
  getLocalDb,
  saveLocalDb
};
