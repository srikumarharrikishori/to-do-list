import React, { useState, useEffect } from 'react';
import { IconX, IconPlus, IconTrash } from './Icons';

export const TaskModal = ({ isOpen, onClose, onSaveTask, editingTask, categories }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'Work');
      setPriority(editingTask.priority || 'medium');
      setDueDate(editingTask.dueDate || '');
      setSubtasks(editingTask.subtasks ? [...editingTask.subtasks] : []);
    } else {
      // Defaults for new task
      setTitle('');
      setDescription('');
      setCategory('Work');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setSubtasks([]);
    }
    setNewSubtaskText('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: newSubtaskText.trim(),
        completed: false
      }
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (subId) => {
    setSubtasks(subtasks.filter((s) => s.id !== subId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: editingTask ? editingTask.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      completed: editingTask ? editingTask.completed : false,
      starred: editingTask ? editingTask.starred : false,
      subtasks,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(51, 20, 34, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--glass-shadow)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Task Title *
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder="e.g. Design Landing Page mockups..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.7rem 0.9rem',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color var(--transition-fast)'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Notes & Description
            </label>
            <textarea
              rows={3}
              placeholder="Add extra context, details, or checklist instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.9rem',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color var(--transition-fast)'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          {/* Priority & Category side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.8rem',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((c) => (
                    <option key={c.id} value={c.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Priority Level
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['low', 'medium', 'high'].map((p) => {
                  const isSel = priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.2rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSel ? `2px solid var(--priority-${p})` : '1px solid var(--border-subtle)',
                        background: isSel ? `var(--priority-${p}-bg)` : 'var(--bg-input)',
                        color: isSel ? `var(--priority-${p})` : 'var(--text-dim)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          {/* Subtasks Builder */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Checklist / Subtasks
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 0.75rem',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
              >
                <IconPlus size={16} /> Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '140px', overflowY: 'auto' }}>
                {subtasks.map((st, index) => (
                  <div
                    key={st.id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-input)',
                      padding: '0.4rem 0.7rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <span>{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex' }}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
