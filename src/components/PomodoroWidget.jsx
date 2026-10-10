import React, { useState, useEffect } from 'react';
import { IconPlay, IconPause, IconRotateCcw, IconX, IconTimer } from './Icons';

export const PomodoroWidget = ({ isOpen, onClose, activeTask, tasks, onPlaySound }) => {
  const MODES = {
    focus: { name: 'Focus', time: 25 * 60, color: 'var(--accent-primary)' },
    shortBreak: { name: 'Short Break', time: 5 * 60, color: '#10b981' },
    longBreak: { name: 'Long Break', time: 15 * 60, color: '#3b82f6' }
  };

  const [currentMode, setCurrentMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.time);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(activeTask ? activeTask.id : '');

  useEffect(() => {
    if (activeTask) {
      setSelectedTaskId(activeTask.id);
    }
  }, [activeTask]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      onPlaySound?.('pomodoro');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onPlaySound]);

  if (!isOpen) return null;

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setTimeLeft(MODES[mode].time);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[currentMode].time);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = ((MODES[currentMode].time - timeLeft) / MODES[currentMode].time) * 100;

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
        zIndex: 90,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--glass-shadow)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: MODES[currentMode].color, display: 'flex' }}><IconTimer size={20} /></span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Focus Pomodoro</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {Object.entries(MODES).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              style={{
                flex: 1,
                padding: '0.45rem',
                border: 'none',
                borderRadius: '6px',
                background: currentMode === key ? config.color : 'transparent',
                color: currentMode === key ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {config.name}
            </button>
          ))}
        </div>

        {/* Circular Progress & Timer Display */}
        <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 1.5rem' }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="100"
              cy="100"
              r="85"
              stroke="var(--border-subtle)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="100"
              cy="100"
              r="85"
              stroke={MODES[currentMode].color}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 85}
              strokeDashoffset={2 * Math.PI * 85 * (1 - progressPct / 100)}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
              {formatTime(timeLeft)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {MODES[currentMode].name}
            </span>
          </div>
        </div>

        {/* Associated Task */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Focus Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.55rem 0.75rem',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            <option value="">No task selected (General Focus)</option>
            {tasks
              .filter((t) => !t.completed)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
          </select>
        </div>

        {/* Timer Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn-icon" onClick={handleReset} title="Reset Timer">
            <IconRotateCcw size={18} />
          </button>

          <button
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <IconPause size={18} /> Pause
              </>
            ) : (
              <>
                <IconPlay size={18} /> Start
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
