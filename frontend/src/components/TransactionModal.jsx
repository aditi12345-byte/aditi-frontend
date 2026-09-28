import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
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

const INCOME_SOURCES = [
  'Pocket Money',
  'Scholarship',
  'Gift',
  'Part-time income',
  'Other'
];

const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Bank Transfer', 'Other'];

export default function TransactionModal({ isOpen, onClose, initialType = 'expense', transaction = null, onSuccess }) {
  const { showToast } = useAuth();
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialType === 'income' ? 'Pocket Money' : 'Food');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setDescription(transaction.description || '');
      setPaymentMethod(transaction.payment_method || 'UPI');
      setDate(transaction.transaction_date ? transaction.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0]);
      setNotes(transaction.notes || '');
    } else {
      setType(initialType);
      setCategory(initialType === 'income' ? 'Pocket Money' : 'Food');
      setAmount('');
      setDescription('');
      setPaymentMethod('UPI');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setError('');
  }, [transaction, initialType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }

    if (!category) {
      setError('Please select a category or source');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        type,
        amount: numAmount,
        category,
        description: description.trim(),
        payment_method: paymentMethod,
        transaction_date: date,
        notes: notes.trim()
      };

      if (transaction?.id) {
        await api.updateTransaction(transaction.id, payload);
        showToast('Transaction updated successfully!', 'success');
      } else {
        await api.createTransaction(payload);
        showToast(`${type === 'income' ? 'Income added' : 'Expense recorded'} of ₹${numAmount}!`, 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const categories = type === 'income' ? INCOME_SOURCES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {transaction ? 'Edit Transaction' : type === 'income' ? 'Add Income / Pocket Money' : 'Add Expense'}
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Type Toggle */}
        {!transaction && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Food');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: type === 'expense' ? 'linear-gradient(135deg, #E11D48, #F43F5E)' : 'transparent',
                color: type === 'expense' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <ArrowUpRight size={18} />
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Pocket Money');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: type === 'income' ? 'linear-gradient(135deg, #059669, #10B981)' : 'transparent',
                color: type === 'income' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <ArrowDownLeft size={18} />
              Income
            </button>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#FCA5A5', fontSize: '0.88rem', marginBottom: '16px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Amount in INR */}
          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '1.2rem', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Category / Source */}
          <div className="form-group">
            <label className="form-label">{type === 'income' ? 'Income Source *' : 'Category *'}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              required
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Note</label>
            <input
              type="text"
              placeholder={type === 'income' ? 'e.g. Monthly allowance from Dad' : 'e.g. Burger & Fries with friends'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Date & Payment Method */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-select"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`btn ${type === 'income' ? 'btn-income' : 'btn-expense'}`}
              style={{ flex: 2 }}
            >
              <Check size={18} />
              <span>{loading ? 'Saving...' : transaction ? 'Update' : type === 'income' ? 'Save Income' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
