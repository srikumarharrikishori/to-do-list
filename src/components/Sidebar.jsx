import React, { useState } from 'react';
import {
  IconLayers,
  IconCalendar,
  IconStar,
  IconCheckCircle,
  IconBriefcase,
  IconUser,
  IconAlertTriangle,
  IconBookOpen,
  IconActivity,
  IconLightbulb,
  IconFlame,
  IconPlus,
  IconX
} from './Icons';

export const Sidebar = ({
  activeFilter,
  setActiveFilter,
  selectedCategory,
  setSelectedCategory,
  categories,
  onAddCategory,
  tasks,
  isOpen,
  onClose,
  onExportData,
  onImportData
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Compute smart filter counts
  const todayStr = new Date().toISOString().split('T')[0];
  const allCount = tasks.length;
  const todayCount = tasks.filter((t) => t.dueDate === todayStr && !t.completed).length;
  const upcomingCount = tasks.filter((t) => t.dueDate > todayStr && !t.completed).length;
  const starredCount = tasks.filter((t) => t.starred && !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const totalCompleted = tasks.filter((t) => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Briefcase': return <IconBriefcase size={17} />;
      case 'User': return <IconUser size={17} />;
      case 'AlertTriangle': return <IconAlertTriangle size={17} />;
      case 'BookOpen': return <IconBookOpen size={17} />;
      case 'Activity': return <IconActivity size={17} />;
      case 'Lightbulb': return <IconLightbulb size={17} />;
      default: return <IconLayers size={17} />;
    }
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const colors = ['#ec4899', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onAddCategory({
      id: newCatName.trim(),
      name: newCatName.trim(),
      icon: 'Tag',
      color: randomColor
    });
    setNewCatName('');
    setIsAddingCat(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(51, 20, 34, 0.45)',
            backdropFilter: 'blur(6px)',
            zIndex: 35
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Top Header on Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)' }}>
            Navigation
          </span>
          {isOpen && (
            <button className="btn-icon" onClick={onClose}>
              <IconX size={18} />
            </button>
          )}
        </div>

        {/* Smart Filter Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button
            className={`nav-item ${activeFilter === 'all' && selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('all'); setSelectedCategory('all'); onClose?.(); }}
          >
            <span className="nav-icon"><IconLayers size={18} /></span>
            <span className="nav-label">All Tasks</span>
            <span className="nav-count">{allCount}</span>
          </button>

          <button
            className={`nav-item ${activeFilter === 'today' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('today'); onClose?.(); }}
          >
            <span className="nav-icon" style={{ color: '#38bdf8' }}><IconCalendar size={18} /></span>
            <span className="nav-label">Today</span>
            {todayCount > 0 && <span className="nav-count highlight">{todayCount}</span>}
          </button>

          <button
            className={`nav-item ${activeFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('upcoming'); onClose?.(); }}
          >
            <span className="nav-icon" style={{ color: '#a78bfa' }}><IconCalendar size={18} /></span>
            <span className="nav-label">Upcoming</span>
            <span className="nav-count">{upcomingCount}</span>
          </button>

          <button
            className={`nav-item ${activeFilter === 'starred' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('starred'); onClose?.(); }}
          >
            <span className="nav-icon" style={{ color: '#fbbf24' }}><IconStar size={18} filled /></span>
            <span className="nav-label">Starred</span>
            <span className="nav-count">{starredCount}</span>
          </button>

          <button
            className={`nav-item ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('completed'); onClose?.(); }}
          >
            <span className="nav-icon" style={{ color: '#34d399' }}><IconCheckCircle size={18} /></span>
            <span className="nav-label">Completed</span>
            <span className="nav-count">{completedCount}</span>
          </button>
        </nav>

        {/* Categories Section */}
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)' }}>
              Categories
            </span>
            <button
              onClick={() => setIsAddingCat(!isAddingCat)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
              title="Add Category"
            >
              <IconPlus size={14} /> New
            </button>
          </div>

          {isAddingCat && (
            <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', gap: '0.4rem', margin: '0.2rem 0' }}>
              <input
                type="text"
                autoFocus
                placeholder="Category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-focus)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.6rem',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem' }}>
                Add
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {categories.map((cat) => {
              if (cat.id === 'all') return null;
              const catCount = tasks.filter((t) => t.category === cat.id && !t.completed).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  className={`nav-item category-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'all' : cat.id);
                    setActiveFilter('all');
                    onClose?.();
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: cat.color || 'var(--accent-primary)',
                      flexShrink: 0
                    }}
                  />
                  <span className="nav-label">{cat.name}</span>
                  <span className="nav-count">{catCount}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Productivity Streak & Progress Card */}
        <div
          className="streak-card"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1))',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#f59e0b', display: 'flex' }}><IconFlame size={20} /></span>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>5-Day Streak!</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {completionRate}%
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${completionRate}%`,
                height: '100%',
                background: 'var(--accent-gradient)',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {totalCompleted} of {tasks.length} total tasks completed
          </span>
        </div>

        {/* Import / Export JSON buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.25rem' }}>
          <button
            onClick={onExportData}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem',
              color: 'var(--text-dim)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all var(--transition-fast)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--text-dim)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            title="Download tasks as JSON"
          >
            Export JSON
          </button>

          <label
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem',
              color: 'var(--text-dim)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
              textAlign: 'center',
              transition: 'all var(--transition-fast)',
              display: 'block'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--text-dim)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            title="Import tasks from JSON"
          >
            Import JSON
            <input type="file" accept=".json" onChange={onImportData} style={{ display: 'none' }} />
          </label>
        </div>

        <style>{`
          .nav-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.65rem 0.85rem;
            border-radius: var(--radius-sm);
            background: transparent;
            border: 1px solid transparent;
            color: var(--text-muted);
            font-size: 0.88rem;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            text-align: left;
            transition: all var(--transition-fast);
          }
          .nav-item:hover {
            color: var(--text-main);
            background: var(--bg-card-hover);
          }
          .nav-item.active {
            color: var(--accent-primary);
            background: rgba(236, 72, 153, 0.12);
            border-color: rgba(236, 72, 153, 0.3);
            font-weight: 700;
          }
          .nav-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nav-label {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .nav-count {
            font-size: 0.75rem;
            padding: 2px 7px;
            border-radius: 10px;
            background: rgba(236, 72, 153, 0.1);
            color: var(--text-dim);
            font-weight: 600;
          }
          .nav-count.highlight {
            background: var(--accent-primary);
            color: #fff;
          }
        `}</style>
      </aside>
    </>
  );
};
