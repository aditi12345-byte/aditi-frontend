import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  PiggyBank, 
  ShoppingBag, 
  Utensils, 
  Bus, 
  Gamepad2, 
  Clock, 
  Target 
} from 'lucide-react';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'alert-triangle': return AlertTriangle;
    case 'sparkles': return Sparkles;
    case 'piggy-bank': return PiggyBank;
    case 'utensils': return Utensils;
    case 'gamepad-2': return Gamepad2;
    case 'bus': return Bus;
    case 'shopping-bag': return ShoppingBag;
    case 'alert-circle': return AlertCircle;
    case 'clock': return Clock;
    case 'target': return Target;
    default: return Lightbulb;
  }
};

const getTypeStyles = (type) => {
  switch (type) {
    case 'danger':
      return {
        bg: 'rgba(239, 68, 68, 0.08)',
        border: 'rgba(239, 68, 68, 0.25)',
        badgeClass: 'badge-expense',
        iconColor: '#F87171'
      };
    case 'warning':
      return {
        bg: 'rgba(245, 158, 11, 0.08)',
        border: 'rgba(245, 158, 11, 0.25)',
        badgeClass: 'badge-warning',
        iconColor: '#FBBF24'
      };
    case 'success':
      return {
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.25)',
        badgeClass: 'badge-income',
        iconColor: '#34D399'
      };
    default:
      return {
        bg: 'rgba(99, 102, 241, 0.08)',
        border: 'rgba(99, 102, 241, 0.25)',
        badgeClass: 'badge-info',
        iconColor: '#818CF8'
      };
  }
};

export default function SmartTips({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Smart Spending Insights</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            Personalized, friendly tips designed to boost your pocket money habits
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {suggestions.map((tip) => {
          const Icon = getIcon(tip.icon);
          const style = getTypeStyles(tip.type);

          return (
            <div
              key={tip.id}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                transition: 'transform 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} color={style.iconColor} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>{tip.title}</span>
                  </div>
                  <span className={`badge ${style.badgeClass}`}>{tip.category}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  {tip.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
