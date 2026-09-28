import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  WalletCards, 
  Plus, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Edit3, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BudgetModal from '../components/BudgetModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatMonth, getCategoryColor } from '../utils/formatters';

export default function Budgets() {
  const { refreshKey, triggerRefresh } = useOutletContext() || {};
  const { showToast } = useAuth();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.getBudgets(selectedMonth);
      setBudgets(res.data?.budgets || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch budgets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, refreshKey]);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const promptDelete = (id) => {
    setDeletingId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setDeleteLoading(true);
      await api.deleteBudget(deletingId);
      showToast('Budget deleted.', 'success');
      setConfirmDeleteOpen(false);
      setDeletingId(null);
      fetchBudgets();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete budget', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Category Budgets</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Set monthly targets for food, transport, gaming, and shopping to avoid running out of pocket money!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '8px 14px' }}
          />

          <button
            onClick={() => {
              setEditingBudget(null);
              setModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating budgets and category spending..." />
      ) : budgets.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <WalletCards size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No budgets defined for {formatMonth(selectedMonth)}
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px auto' }}>
            Take control of your spending! Set a monthly limit for Food, Entertainment, or Transport to receive warnings before you overspend.
          </p>
          <button
            onClick={() => {
              setEditingBudget(null);
              setModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Create Your First Budget</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {budgets.map((b) => {
            const catColor = getCategoryColor(b.category);
            const isExceeded = b.status === 'exceeded';
            const isWarning = b.status === 'warning';

            return (
              <div
                key={b.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${isExceeded ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981'}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: `rgba(${parseInt(catColor.slice(1, 3) || '99', 16)}, ${parseInt(catColor.slice(3, 5) || '102', 16)}, ${parseInt(catColor.slice(5, 7) || '241', 16)}, 0.15)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: catColor,
                          fontWeight: 700
                        }}
                      >
                        <WalletCards size={18} />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{b.category}</h4>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleEdit(b)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        title="Edit Limit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => promptDelete(b.id)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '30px', height: '30px', color: '#F87171' }}
                        title="Delete Budget"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spent</span>
                      <p style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFFFFF', fontFamily: 'Outfit' }}>
                        {formatCurrency(b.spent)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Limit: {formatCurrency(b.amount)}</span>
                      <p
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          margin: 0,
                          color: isExceeded ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981'
                        }}
                      >
                        {isExceeded ? `Over by ${formatCurrency(b.spent - b.amount)}` : `${formatCurrency(b.remaining)} left`}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar-container" style={{ marginBottom: '12px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, b.percentage)}%`,
                        background: isExceeded
                          ? 'linear-gradient(90deg, #DC2626, #EF4444)'
                          : isWarning
                          ? 'linear-gradient(90deg, #D97706, #F59E0B)'
                          : 'linear-gradient(90deg, #059669, #10B981)'
                      }}
                    />
                  </div>
                </div>

                {/* Status alert message */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', marginTop: '6px' }}>
                  {isExceeded ? (
                    <>
                      <AlertCircle size={16} color="#EF4444" />
                      <span style={{ color: '#F87171', fontWeight: 600 }}>
                        {b.percentage}% used! You exceeded this budget.
                      </span>
                    </>
                  ) : isWarning ? (
                    <>
                      <AlertTriangle size={16} color="#F59E0B" />
                      <span style={{ color: '#FBBF24', fontWeight: 600 }}>
                        {b.percentage}% used! Approaching monthly limit.
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span style={{ color: '#34D399', fontWeight: 600 }}>
                        {b.percentage}% used. Spending comfortably within limits.
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBudget(null);
        }}
        currentMonth={selectedMonth}
        existingBudget={editingBudget}
        onSuccess={() => {
          fetchBudgets();
          if (triggerRefresh) triggerRefresh();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message="Are you sure you want to remove this category budget limit?"
        confirmText="Yes, Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
