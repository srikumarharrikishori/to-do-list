import React from 'react';
import {
  IconCheck,
  IconPlus,
  IconSearch,
  IconSun,
  IconMoon,
  IconVolume2,
  IconVolumeX,
  IconTimer,
  IconMenu,
  IconX
} from './Icons';

export const Header = ({
  searchQuery,
  setSearchQuery,
  onOpenNewTask,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  pomodoroOpen,
  onTogglePomodoro,
  onToggleMobileSidebar,
  searchInputRef
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="header-bar glass-panel" style={{ padding: '0.9rem 1.5rem', marginBottom: '1.5rem' }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          title="Toggle Menu"
          aria-label="Toggle Navigation Menu"
        >
          <IconMenu size={20} />
        </button>

        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className="logo-icon"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px var(--accent-glow)'
            }}
          >
            <IconCheck size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              TaskFlow <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pro</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {todayFormatted} • Focus & Achieve
            </span>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="header-center" style={{ flex: '1', maxWidth: '440px', margin: '0 1.5rem', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            padding: '0.5rem 0.85rem',
            gap: '0.6rem',
            transition: 'border-color var(--transition-fast)'
          }}
        >
          <span style={{ color: 'var(--text-dim)', display: 'flex' }}>
            <IconSearch size={17} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tasks, tags, notes... (Press /)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex'
              }}
              title="Clear search"
            >
              <IconX size={15} />
            </button>
          )}
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              background: 'var(--bg-card)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            /
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button
          className={`btn-icon ${pomodoroOpen ? 'active' : ''}`}
          onClick={onTogglePomodoro}
          title="Pomodoro Focus Timer"
          aria-label="Pomodoro Timer"
        >
          <IconTimer size={19} />
        </button>

        <button
          className="btn-icon"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          aria-label="Sound Toggle"
        >
          {soundEnabled ? <IconVolume2 size={19} /> : <IconVolumeX size={19} />}
        </button>

        <button
          className="btn-icon"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Theme Toggle"
        >
          {theme === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
        </button>

        <button
          className="btn btn-primary"
          onClick={onOpenNewTask}
          title="Create task (Shortcut: N)"
          style={{ marginLeft: '0.35rem' }}
        >
          <IconPlus size={18} />
          <span>New Task</span>
        </button>
      </div>

      <style>{`
        .header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mobile-menu-btn {
          display: none;
        }
        @media (max-width: 900px) {
          .mobile-menu-btn {
            display: inline-flex;
          }
          .header-center {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
