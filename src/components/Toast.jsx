import React, { useEffect } from 'react';
import { IconCheckCircle, IconX } from './Icons';

export const Toast = ({ toast, onClose, onUndo }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--accent-primary)',
        boxShadow: 'var(--glass-shadow)'
      }}
    >
      <span style={{ color: 'var(--accent-primary)', display: 'flex' }}>
        <IconCheckCircle size={18} />
      </span>
      <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{toast.message}</span>

      {toast.undoAction && (
        <button
          onClick={() => {
            onUndo();
            onClose();
          }}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', borderColor: 'var(--accent-primary)' }}
        >
          Undo
        </button>
      )}

      <button
        onClick={onClose}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex' }}
      >
        <IconX size={15} />
      </button>
    </div>
  );
};
