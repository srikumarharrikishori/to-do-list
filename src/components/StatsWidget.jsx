import React from 'react';
import { IconCheckCircle, IconAlertTriangle, IconCalendar, IconLayers } from './Icons';

export const StatsWidget = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const todayStr = new Date().toISOString().split('T')[0];
  const dueToday = tasks.filter((t) => t.dueDate === todayStr && !t.completed).length;
  const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      subtext: `${pending} remaining`,
      icon: <IconLayers size={20} />,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)'
    },
    {
      label: 'Completed',
      value: completed,
      subtext: `${completionPct}% success rate`,
      icon: <IconCheckCircle size={20} />,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)'
    },
    {
      label: 'Due Today',
      value: dueToday,
      subtext: dueToday === 0 ? 'All caught up' : 'Action needed',
      icon: <IconCalendar size={20} />,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)'
    },
    {
      label: 'High Priority',
      value: highPriority,
      subtext: highPriority > 0 ? 'Urgent attention' : 'None urgent',
      icon: <IconAlertTriangle size={20} />,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.12)'
    }
  ];

  return (
    <div
      className="stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}
    >
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="glass-panel stat-card"
          style={{
            padding: '1.15rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {s.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {s.value}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 500 }}>
              {s.subtext}
            </span>
          </div>

          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: s.bg,
              color: s.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {s.icon}
          </div>
        </div>
      ))}

      <style>{`
        .stat-card {
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>
  );
};
