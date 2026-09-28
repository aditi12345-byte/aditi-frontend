import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Mobile/Internet',
  'Health',
  'Gifts',
  'Other'
];

export default function BudgetModal({ isOpen, onClose, currentMonth, existingBudget = null, onSuccess }) {
  const { showToast } = useAuth();
  const [category, setCategory] = useState(existingBudget?.category || 'Food');
  const [amount, setAmount] = useState(existingBudget?.amount || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingBudget) {
      setCategory(existingBudget.category);
      setAmount(existingBudget.amount);
    } else {
      setCategory('Food');
      setAmount('');
    }
    setError('');
  }, [existingBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid monthly budget amount greater than ₹0');
      return;
    }

    try {
      setLoading(true);
      await api.saveBudget({
        category,
        amount: numAmount,
        month: currentMonth || new Date().toISOString().slice(0, 7)
      });

      showToast(`Monthly budget of ₹${numAmount} set for ${category}!`, 'success');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {existingBudget ? 'Edit Category Budget' : 'Set Category Budget'}
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
            <label className="form-label">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              required
              disabled={!!existingBudget}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Limit (₹) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 2000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '1.1rem', fontWeight: 600 }}
              />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              You will get friendly alerts when you reach 80% and 100% of this limit.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              <Check size={18} />
              <span>{loading ? 'Saving...' : 'Save Budget'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
