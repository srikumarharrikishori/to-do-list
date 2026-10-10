import React, { useState } from 'react';
import {
  IconCheck,
  IconStar,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconTimer
} from './Icons';

export const TaskCard = ({
  task,
  onToggleComplete,
  onToggleStar,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleSubtask,
  categories
}) => {
  const [subtasksExpanded, setSubtasksExpanded] = useState(false);

  // Compute category info
  const categoryInfo = categories.find((c) => c.id === task.category) || {
    name: task.category,
    color: '#6366f1'
  };

  // Due date format and status
  const getDueStatus = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: '#ef4444', isOverdue: true };
    }
    if (diffDays === 0) {
      return { label: 'Due Today', color: '#f59e0b', isToday: true };
    }
    if (diffDays === 1) {
      return { label: 'Tomorrow', color: '#3b82f6' };
    }
    return {
      label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(due),
      color: 'var(--text-dim)'
    };
  };

  const dueInfo = getDueStatus(task.dueDate);

  // Subtasks calculation
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

  return (
    <div
      className={`glass-panel task-card animate-fade-in ${task.completed ? 'completed' : ''}`}
      style={{
        padding: '1.15rem 1.35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        position: 'relative',
        transition: 'all var(--transition-fast)',
        borderLeft: task.starred ? '3px solid #f59e0b' : '1px solid var(--border-subtle)'
      }}
    >
      {/* Top row: Checkbox, Title, Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
        {/* Custom interactive checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '7px',
            border: task.completed ? 'none' : '2px solid var(--border-focus)',
            background: task.completed ? 'var(--accent-gradient)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '2px',
            color: '#fff',
            transition: 'all var(--transition-fast)'
          }}
        >
          {task.completed && <IconCheck size={16} />}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: task.completed ? 'var(--text-dim)' : 'var(--text-main)',
                textDecoration: task.completed ? 'line-through' : 'none',
                lineHeight: 1.35,
                wordBreak: 'break-word',
                transition: 'color var(--transition-fast)'
              }}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--text-muted)',
                marginTop: '0.3rem',
                lineHeight: 1.45,
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1
              }}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Action icons on right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          <button
            onClick={() => onToggleStar(task.id)}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title={task.starred ? 'Unstar task' : 'Star as important'}
          >
            <IconStar size={16} filled={task.starred} />
          </button>

          {!task.completed && (
            <button
              onClick={() => onStartFocus(task)}
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              title="Focus on this task with Pomodoro timer"
            >
              <IconTimer size={16} />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Edit task"
          >
            <IconEdit size={16} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="btn-icon"
            style={{ width: '32px', height: '32px', color: '#f43f5e' }}
            title="Delete task"
          >
            <IconTrash size={16} />
          </button>
        </div>
      </div>

      {/* Subtasks summary bar if any */}
      {totalSubtasks > 0 && (
        <div style={{ marginTop: '0.2rem' }}>
          <div
            onClick={() => setSubtasksExpanded(!subtasksExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '0.78rem',
              color: 'var(--text-dim)',
              padding: '0.25rem 0',
              fontWeight: 500
            }}
          >
            <span>
              Subtasks ({completedSubtasks}/{totalSubtasks})
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {subtasksExpanded ? 'Hide' : 'View checklist'}
            </span>
          </div>

          <div style={{ width: '100%', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                height: '100%',
                background: completedSubtasks === totalSubtasks ? '#10b981' : 'var(--accent-primary)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          {subtasksExpanded && (
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem' }}>
              {task.subtasks.map((st) => (
                <label
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.82rem',
                    color: st.completed ? 'var(--text-dim)' : 'var(--text-main)',
                    textDecoration: st.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask(task.id, st.id)}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                  />
                  <span>{st.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom row: Category badge, Priority pill, Due Date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Category Pill */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              background: 'var(--bg-input)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: categoryInfo.color }} />
            {categoryInfo.name}
          </span>

          {/* Priority Pill */}
          <span className={`badge priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>

        {/* Due Date Indicator */}
        {dueInfo && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: dueInfo.color
            }}
          >
            <IconCalendar size={14} />
            <span>{dueInfo.label}</span>
          </div>
        )}
      </div>

      <style>{`
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--card-hover-shadow);
        }
        .task-card.completed {
          opacity: 0.72;
          background: rgba(17, 24, 39, 0.4);
        }
      `}</style>
    </div>
  );
};
