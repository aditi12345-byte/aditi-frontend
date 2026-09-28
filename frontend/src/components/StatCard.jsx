import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#6366F1', badge, trend }) {
  return (
    <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: color,
          opacity: 0.12,
          filter: 'blur(25px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: '#FFFFFF', marginBottom: '6px' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
        {badge && (
          <span className={`badge ${badge.type ? `badge-${badge.type}` : 'badge-info'}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
