import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PiggyBank, 
  Receipt, 
  Flame, 
  Sparkles,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import SmartTips from '../components/SmartTips';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

export default function Dashboard() {
  const { refreshKey, openTransactionModal } = useOutletContext() || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardSummary();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  if (loading && !data) {
    return <LoadingSpinner message="Calculating your pocket balance & insights..." />;
  }

  const { summary = {}, healthHighlights = [], suggestions = [], recentTransactions = [] } = data || {};

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Financial Health Banner */}
      {healthHighlights.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '18px 24px',
            marginBottom: '28px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <TrendingUp size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#A5B4FC' }}>
                Financial Health Summary
              </span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                {healthHighlights[0]}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => openTransactionModal && openTransactionModal('income')}
              className="btn btn-income btn-sm"
            >
              <ArrowDownLeft size={16} />
              <span>+ Income</span>
            </button>
            <button
              onClick={() => openTransactionModal && openTransactionModal('expense')}
              className="btn btn-expense btn-sm"
            >
              <ArrowUpRight size={16} />
              <span>+ Expense</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary 4 Metric Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        <StatCard
          title="Remaining Balance"
          value={formatCurrency(summary.remainingBalance)}
          subtitle="Net pocket money available"
          icon={Wallet}
          color="#6366F1"
          badge={{ text: 'Available', type: 'info' }}
        />
        <StatCard
          title="Money Received This Month"
          value={formatCurrency(summary.totalIncome)}
          subtitle="Pocket money & gifts"
          icon={ArrowDownLeft}
          color="#10B981"
          badge={{ text: 'This Month', type: 'income' }}
        />
        <StatCard
          title="Total Spent This Month"
          value={formatCurrency(summary.totalExpense)}
          subtitle="All daily expenses"
          icon={ArrowUpRight}
          color="#F43F5E"
          badge={{ text: `${summary.transactionCount || 0} Spends`, type: 'expense' }}
        />
        <StatCard
          title="Saved In Goals"
          value={formatCurrency(summary.totalGoalsSaved)}
          subtitle={`${summary.savingsRate || 0}% savings rate`}
          icon={PiggyBank}
          color="#F59E0B"
          badge={{ text: 'Target Savings', type: 'warning' }}
        />
      </div>

      {/* Smart rule-based suggestions section */}
      <SmartTips suggestions={suggestions} />

      {/* Two Column Section: Recent Spends & Spending Highlight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }} className="grid-cols-2">
        {/* Recent Transactions List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#818CF8" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Recent Activity</h3>
            </div>
            <Link
              to="/transactions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#818CF8',
                textDecoration: 'none'
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Receipt size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No transactions recorded yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Log your pocket money or daily snacks to start tracking!</p>
              <button
                onClick={() => openTransactionModal && openTransactionModal('expense')}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '16px' }}
              >
                <PlusCircle size={16} />
                <span>Record First Transaction</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const catColor = getCategoryColor(tx.category);

                return (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: `rgba(${parseInt(catColor.slice(1, 3) || '99', 16)}, ${parseInt(catColor.slice(3, 5) || '102', 16)}, ${parseInt(catColor.slice(5, 7) || '241', 16)}, 0.15)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: catColor,
                          fontWeight: 700
                        }}
                      >
                        {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>

                      <div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                          {tx.category}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                          {tx.description || tx.payment_method || 'No description'} • {formatDate(tx.transaction_date)}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          fontFamily: 'Outfit',
                          color: isIncome ? '#10B981' : '#F43F5E'
                        }}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                        {tx.payment_method || 'Cash'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Highlights Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Spending Category Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444'
                }}
              >
                <Flame size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Top Spending Category</h3>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '8px'
                }}
              >
                {summary.highestCategory || 'None'}
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: 'Outfit' }}>
                {formatCurrency(summary.highestCategoryAmount)}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Largest portion of this month's budget
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Fast Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/analytics"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '12px 16px' }}
              >
                <span>📊 Graphical Analytics & Charts</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/budgets"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '12px 16px' }}
              >
                <span>🎯 Monthly Category Budgets</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/savings-goals"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '12px 16px' }}
              >
                <span>🏆 Wishlist & Savings Goals</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
