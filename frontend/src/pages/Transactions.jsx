import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  Plus, 
  Receipt, 
  Calendar,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

const ALL_CATEGORIES = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Mobile/Internet',
  'Health',
  'Gifts',
  'Pocket Money',
  'Scholarship',
  'Part-time income',
  'Other'
];

export default function Transactions() {
  const { refreshKey, triggerRefresh } = useOutletContext() || {};
  const { showToast } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      params.sort = sortOrder;

      const res = await api.getTransactions(params);
      setTransactions(res.data?.transactions || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, typeFilter, categoryFilter, startDate, endDate, sortOrder, refreshKey]);

  const handleEdit = (tx) => {
    setActiveTransaction(tx);
    setEditModalOpen(true);
  };

  const promptDelete = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setDeleteLoading(true);
      await api.deleteTransaction(deletingId);
      showToast('Transaction deleted safely.', 'success');
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      fetchTransactions();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete transaction', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('All');
    setStartDate('');
    setEndDate('');
    setSortOrder('desc');
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with Title and Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Transaction History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Filter, search, review, and edit all your pocket expenses and incomes
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTransaction(null);
            setAddModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by description or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select"
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Date range filters */}
          <div>
            <input
              type="date"
              placeholder="From Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
              title="Start Date"
            />
          </div>

          <div>
            <input
              type="date"
              placeholder="To Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
              title="End Date"
            />
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div>
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <X size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {loading ? (
          <LoadingSpinner message="Fetching transactions..." />
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <Receipt size={48} style={{ opacity: 0.3, marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
              No transactions match your search
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '18px' }}>
              Try adjusting your filters or record a new transaction.
            </p>
            <button onClick={clearFilters} className="btn btn-secondary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 16px' }}>Date</th>
                  <th style={{ padding: '14px 16px' }}>Category / Source</th>
                  <th style={{ padding: '14px 16px' }}>Description</th>
                  <th style={{ padding: '14px 16px' }}>Method</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const catColor = getCategoryColor(tx.category);

                  return (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {formatDate(tx.transaction_date)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            background: `rgba(${parseInt(catColor.slice(1, 3) || '99', 16)}, ${parseInt(catColor.slice(3, 5) || '102', 16)}, ${parseInt(catColor.slice(5, 7) || '241', 16)}, 0.15)`,
                            color: catColor
                          }}
                        >
                          {isIncome ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 500 }}>
                        {tx.description || <span style={{ color: 'var(--text-muted)' }}>-</span>}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span className="badge badge-info">{tx.payment_method || 'UPI'}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontFamily: 'Outfit', fontSize: '1.05rem', color: isIncome ? '#10B981' : '#F43F5E' }}>
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(tx)}
                            title="Edit Transaction"
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => promptDelete(tx.id)}
                            title="Delete Transaction"
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px', color: '#F87171' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Modal (Add or Edit) */}
      <TransactionModal
        isOpen={addModalOpen || editModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditModalOpen(false);
          setActiveTransaction(null);
        }}
        transaction={activeTransaction}
        onSuccess={() => {
          fetchTransactions();
          if (triggerRefresh) triggerRefresh();
        }}
      />

      {/* Confirmation Modal for Deletion */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This will permanently adjust your balance."
        confirmText="Yes, Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
