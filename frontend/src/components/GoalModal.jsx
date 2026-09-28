import React, { useState, useEffect } from 'react';
import { X, Check, Target, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GoalModal({ isOpen, onClose, goal = null, onSuccess }) {
  const { showToast } = useAuth();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTargetAmount(goal.target_amount);
      setCurrentAmount(goal.current_amount || '');
      setTargetDate(goal.target_date ? goal.target_date.split('T')[0] : '');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setTargetDate('');
    }
    setError('');
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetNum = Number(targetAmount);
    if (!title.trim()) {
      setError('Please give your savings goal a title');
      return;
    }

    if (!targetAmount || isNaN(targetNum) || targetNum <= 0) {
      setError('Please enter a target amount greater than ₹0');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        target_amount: targetNum,
        current_amount: Number(currentAmount) || 0,
        target_date: targetDate || null
      };

      if (goal?.id) {
        await api.updateSavingsGoal(goal.id, payload);
        showToast('Savings goal updated!', 'success');
      } else {
        await api.createSavingsGoal(payload);
        showToast(`Target goal "${title}" created! Let's save!`, 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {goal ? 'Edit Savings Target' : 'Create Savings Goal'}
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#FCA5A5', fontSize: '0.88rem', marginBottom: '16px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Goal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Headphones, Birthday Gift, Sneaker Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Target Amount (₹) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="2500"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Already Saved (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Date (Optional)</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              <Check size={18} />
              <span>{loading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
