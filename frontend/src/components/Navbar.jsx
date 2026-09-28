import React from 'react';
import { Menu, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenSidebar, onOpenTransactionModal, title = 'Dashboard' }) {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: '74px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(11, 15, 25, 0.75)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenSidebar}
          className="btn btn-secondary btn-icon mobile-menu-btn"
          style={{ display: 'none' }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>{title}</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Hey {user?.name ? user.name.split(' ')[0] : 'friend'}, let's manage your pocket money!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#818CF8',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🇮🇳 INR (₹)
        </span>

        {onOpenTransactionModal && (
          <>
            <button
              onClick={() => onOpenTransactionModal('income')}
              className="btn btn-income btn-sm"
            >
              <ArrowDownLeft size={16} />
              <span>Add Income</span>
            </button>

            <button
              onClick={() => onOpenTransactionModal('expense')}
              className="btn btn-expense btn-sm"
            >
              <ArrowUpRight size={16} />
              <span>Add Expense</span>
            </button>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
