import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Target, 
  Plus, 
  Sparkles, 
  Trophy, 
  Calendar, 
  Edit3, 
  Trash2, 
  Coins,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GoalModal from '../components/GoalModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function SavingsGoals() {
  const { refreshKey, triggerRefresh } = useOutletContext() || {};
  const { showToast } = useAuth();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Quick Deposit modal / input state
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.getSavingsGoals();
      setGoals(res.data?.goals || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch savings goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [refreshKey]);

  const handleEdit = (goal) => {
    setActiveGoal(goal);
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
      await api.deleteSavingsGoal(deletingId);
      showToast('Savings goal deleted.', 'success');
      setConfirmDeleteOpen(false);
      setDeletingId(null);
      fetchGoals();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete goal', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddDeposit = async (goalId) => {
    const num = Number(depositAmount);
    if (!depositAmount || isNaN(num) || num <= 0) {
      showToast('Please enter a valid deposit amount', 'error');
      return;
    }

    try {
      setDepositLoading(true);
      const res = await api.addDeposit(goalId, num);
      showToast(res.message || `Added ₹${num} to goal!`, 'success');
      setDepositGoalId(null);
      setDepositAmount('');
      fetchGoals();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to deposit', 'error');
    } finally {
      setDepositLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Wishlist & Savings Goals</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Save up for headphones, gadgets, birthday gifts, or college supplies step-by-step
          </p>
        </div>

        <button
          onClick={() => {
            setActiveGoal(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>New Savings Goal</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your goals and progress..." />
      ) : goals.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Trophy size={48} style={{ opacity: 0.3, marginBottom: '16px', color: '#F59E0B' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No savings goals created yet!
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px auto' }}>
            What are you dreaming of buying? Setting a goal helps you resist impulse buying and save pocket money with purpose.
          </p>
          <button
            onClick={() => {
              setActiveGoal(null);
              setModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Create Your First Goal</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
          {goals.map((goal) => {
            const isCompleted = goal.isCompleted;

            return (
              <div
                key={goal.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${isCompleted ? '#10B981' : '#6366F1'}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: isCompleted
                            ? 'linear-gradient(135deg, #10B981, #059669)'
                            : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}
                      >
                        {isCompleted ? <Trophy size={20} /> : <Target size={20} />}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{goal.title}</h4>
                        {goal.target_date && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> Target: {formatDate(goal.target_date)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleEdit(goal)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        title="Edit Goal"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => promptDelete(goal.id)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '30px', height: '30px', color: '#F87171' }}
                        title="Delete Goal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saved So Far</span>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', margin: 0, fontFamily: 'Outfit' }}>
                        {formatCurrency(goal.current_amount)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target: {formatCurrency(goal.target_amount)}</span>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: isCompleted ? '#10B981' : 'var(--text-secondary)' }}>
                        {isCompleted ? 'Goal Completed! 🥳' : `${formatCurrency(goal.remaining)} remaining`}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar-container" style={{ height: '12px', marginBottom: '16px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, goal.percentage)}%`,
                        background: isCompleted
                          ? 'linear-gradient(90deg, #10B981, #34D399)'
                          : 'linear-gradient(90deg, #6366F1, #EC4899)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className={`badge ${isCompleted ? 'badge-income' : 'badge-info'}`}>
                      {goal.percentage}% Reached
                    </span>

                    {isCompleted && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#34D399', fontWeight: 700 }}>
                        <CheckCircle2 size={14} /> Ready to buy!
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Add Deposit Section */}
                {!isCompleted && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                    {depositGoalId === goal.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          placeholder="Amount in ₹"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="form-input"
                          style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                        />
                        <button
                          onClick={() => handleAddDeposit(goal.id)}
                          disabled={depositLoading}
                          className="btn btn-income btn-sm"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setDepositGoalId(null);
                            setDepositAmount('');
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setDepositGoalId(goal.id);
                          setDepositAmount('500');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Coins size={15} color="#F59E0B" />
                        <span>Add Money to Goal</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveGoal(null);
        }}
        goal={activeGoal}
        onSuccess={() => {
          fetchGoals();
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
        title="Delete Savings Goal"
        message="Are you sure you want to remove this savings goal? You can always create a new one later."
        confirmText="Yes, Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
