import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_TASKS, CATEGORIES } from './utils/initialData';
import { playSound } from './utils/audio';
import { triggerConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsWidget } from './components/StatsWidget';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { PomodoroWidget } from './components/PomodoroWidget';
import { Toast } from './components/Toast';
import { IconPlus, IconCheckCircle, IconLayers } from './components/Icons';

export default function App() {
  // Persistence in LocalStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_categories');
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('taskflow_theme');
    // Default to the white & pink shade theme
    if (!saved || saved === 'dark') {
      return 'pink';
    }
    return saved;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('taskflow_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // UI state
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);

  const searchInputRef = useRef(null);

  // Sync tasks to local storage
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    } catch (err) {
      console.error('Storage error:', err);
    }
  }, [tasks]);

  // Sync categories to local storage
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_categories', JSON.stringify(categories));
    } catch (err) {
      console.error('Storage error:', err);
    }
  }, [categories]);

  // Apply theme to html root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  // Sync sound preference
  useEffect(() => {
    localStorage.setItem('taskflow_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if active in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTask(null);
        setIsModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
        setPomodoroOpen(false);
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio helper
  const handlePlaySound = (type) => {
    playSound(type, soundEnabled);
  };

  // Handlers
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'pink' : 'dark'));
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === taskData.id ? taskData : t)));
      setToast({ message: 'Task updated successfully' });
    } else {
      setTasks([taskData, ...tasks]);
      handlePlaySound('add');
      setToast({ message: 'New task created' });
    }
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const willBeCompleted = !target.completed;
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, completed: willBeCompleted } : t))
    );

    if (willBeCompleted) {
      handlePlaySound('complete');
      triggerConfetti();
      setToast({ message: `Completed "${target.title}"!` });
    }
  };

  const handleToggleStar = (taskId) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, starred: !t.starred } : t))
    );
  };

  const handleDeleteTask = (taskId) => {
    const toDelete = tasks.find((t) => t.id === taskId);
    if (!toDelete) return;

    setLastDeletedTask(toDelete);
    setTasks(tasks.filter((t) => t.id !== taskId));
    handlePlaySound('delete');
    setToast({
      message: `Deleted "${toDelete.title}"`,
      undoAction: true
    });
  };

  const handleUndoDelete = () => {
    if (lastDeletedTask) {
      setTasks((prev) => [lastDeletedTask, ...prev]);
      setLastDeletedTask(null);
      setToast({ message: 'Task restored' });
    }
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
  };

  const handleStartFocus = (task) => {
    setFocusTask(task);
    setPomodoroOpen(true);
  };

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory.id);
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    setTasks(tasks.filter((t) => !t.completed));
    setToast({ message: `Cleared ${completedCount} completed tasks` });
  };

  // Export tasks as JSON
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToast({ message: 'Tasks exported successfully' });
  };

  // Import tasks from JSON
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setTasks(imported);
          setToast({ message: `Imported ${imported.length} tasks` });
        }
      } catch (err) {
        setToast({ message: 'Failed to import JSON file' });
      }
    };
    reader.readAsText(file);
  };

  // Filter & Sort Logic
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((task) => {
    // 1. Smart views
    if (activeFilter === 'today' && task.dueDate !== todayStr) return false;
    if (activeFilter === 'upcoming' && (!task.dueDate || task.dueDate <= todayStr)) return false;
    if (activeFilter === 'starred' && !task.starred) return false;
    if (activeFilter === 'completed' && !task.completed) return false;

    // 2. Category
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description && task.description.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      const matchSub = task.subtasks && task.subtasks.some((st) => st.title.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchSub) return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Starred items always on top (unless viewing completed view)
    if (activeFilter !== 'completed') {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
    }

    if (sortBy === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      if (weightA !== weightB) return weightB - weightA;
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'created') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }

    // Default: incomplete first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return 0;
  });

  const getFilterTitle = () => {
    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.id === selectedCategory);
      return cat ? `${cat.name} Tasks` : 'Category Tasks';
    }
    switch (activeFilter) {
      case 'today': return "Today's Focus";
      case 'upcoming': return 'Upcoming Deadlines';
      case 'starred': return 'Starred & Important';
      case 'completed': return 'Completed Tasks';
      default: return 'All Tasks';
    }
  };

  const hasCompletedTasks = tasks.some((t) => t.completed);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onAddCategory={handleAddCategory}
        tasks={tasks}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Content Workspace */}
      <main className="main-content">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewTask={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          pomodoroOpen={pomodoroOpen}
          onTogglePomodoro={() => setPomodoroOpen(!pomodoroOpen)}
          onToggleMobileSidebar={() => setSidebarOpen(true)}
          searchInputRef={searchInputRef}
        />

        {/* Analytics & Metrics Cards */}
        <StatsWidget tasks={tasks} />

        {/* Action Controls & Task Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {getFilterTitle()}
            </h2>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '2px 9px',
                borderRadius: '12px',
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)'
              }}
            >
              {sortedTasks.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="priority">Priority (High to Low)</option>
                <option value="dueDate">Due Date</option>
                <option value="created">Recently Added</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>

            {hasCompletedTasks && (
              <button
                onClick={handleClearCompleted}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}
                title="Remove all completed tasks"
              >
                Clear Completed
              </button>
            )}
          </div>
        </div>

        {/* Task List Section */}
        {sortedTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categories={categories}
                onToggleComplete={handleToggleComplete}
                onToggleStar={handleToggleStar}
                onDelete={handleDeleteTask}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
                onStartFocus={handleStartFocus}
                onToggleSubtask={handleToggleSubtask}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            className="glass-panel"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(236, 72, 153, 0.18))',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {activeFilter === 'completed' ? <IconCheckCircle size={32} /> : <IconLayers size={32} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {searchQuery ? 'No matching tasks found' : 'No tasks in this view'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '380px' }}>
                {searchQuery
                  ? `No items match "${searchQuery}". Try a different keyword.`
                  : 'You are all clear! Enjoy the rest of your day or create a new goal.'}
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              style={{ marginTop: '0.5rem' }}
            >
              <IconPlus size={18} />
              <span>Create New Task</span>
            </button>
          </div>
        )}
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleSaveTask}
        editingTask={editingTask}
        categories={categories}
      />

      {/* Focus Pomodoro Timer Widget */}
      <PomodoroWidget
        isOpen={pomodoroOpen}
        onClose={() => setPomodoroOpen(false)}
        activeTask={focusTask}
        tasks={tasks}
        onPlaySound={handlePlaySound}
      />

      {/* Action Toast Notifications */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onUndo={handleUndoDelete}
      />
    </div>
  );
}
