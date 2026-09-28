import React from 'react';
import { User, ShieldCheck, Mail, Calendar, Coins, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>My Account & Preferences</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Manage your personal settings, currency, and account security
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{user?.name || 'Teen Track User'}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>{user?.email}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '20px', fontSize: '0.75rem', color: '#A5B4FC', fontWeight: 600 }}>
              <Sparkles size={13} />
              <span>Smart Teen Saver Level 1</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8' }}>
              <Mail size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
              <p style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <Coins size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default Currency</span>
              <p style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>Indian Rupee (₹ INR)</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Calendar size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member Since</span>
              <p style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>{formatDate(user?.created_at || new Date())}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Architecture Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Security & Data Protection</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>How your account and financial data is protected</p>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#10B981' }}>✔</span> Passwords securely salted and hashed using <strong>bcrypt</strong> (10 rounds). Plain text is never stored.
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#10B981' }}>✔</span> Authenticated via cryptographically signed JWT tokens with 7-day automated session rotation.
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#10B981' }}>✔</span> Architecture: Frontend communicates strictly via Express REST APIs. Database credentials never exposed.
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#10B981' }}>✔</span> All financial data is strictly scoped to your authenticated user identity.
          </li>
        </ul>
      </div>

      {/* Logout Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          <LogOut size={16} />
          <span>Sign Out of TeenTrack</span>
        </button>
      </div>
    </div>
  );
}
