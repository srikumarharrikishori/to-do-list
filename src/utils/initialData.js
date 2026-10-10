export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Finalize React Project Architecture & Design System',
    description: 'Review custom tokens, CSS variables, glassmorphism blur and responsive layouts.',
    category: 'Work',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    completed: false,
    starred: true,
    subtasks: [
      { id: 'sub-1-1', title: 'Setup responsive grid layout', completed: true },
      { id: 'sub-1-2', title: 'Implement dark & light theme tokens', completed: true },
      { id: 'sub-1-3', title: 'Add audio feedback with Web Audio API', completed: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'task-2',
    title: 'Prepare Interactive Client Pitch Presentation',
    description: 'Assemble key performance metrics, prototype video, and user testimonial slides.',
    category: 'Urgent',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0], // Today
    completed: false,
    starred: true,
    subtasks: [
      { id: 'sub-2-1', title: 'Export high-res charts', completed: false },
      { id: 'sub-2-2', title: 'Rehearse speech timing', completed: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'task-3',
    title: 'Daily 30-min HIIT Cardio & Core Training',
    description: 'Keep the fitness streak alive! Stay hydrated and track heart rate zones.',
    category: 'Fitness',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0], // Today
    completed: true,
    starred: false,
    subtasks: [
      { id: 'sub-3-1', title: 'Warm-up stretch (5 mins)', completed: true },
      { id: 'sub-3-2', title: 'Interval sprints (20 mins)', completed: true },
      { id: 'sub-3-3', title: 'Cool down & foam roll', completed: true }
    ],
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'task-4',
    title: 'Study TypeScript 5.5 Advanced Generics & Inference',
    description: 'Read the official documentation on type guards, satisfies operator, and variance.',
    category: 'Study',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    completed: false,
    starred: false,
    subtasks: [
      { id: 'sub-4-1', title: 'Solve 3 generic challenges on type-challenges', completed: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: 'task-5',
    title: 'Weekly Grocery Run & Meal Prep Planning',
    description: 'Organic berries, Greek yogurt, spinach, chicken breast, quinoa, almond butter.',
    category: 'Personal',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    completed: false,
    starred: false,
    subtasks: [],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Tasks', icon: 'Layers', color: '#6366f1' },
  { id: 'Work', name: 'Work', icon: 'Briefcase', color: '#3b82f6' },
  { id: 'Personal', name: 'Personal', icon: 'User', color: '#ec4899' },
  { id: 'Urgent', name: 'Urgent', icon: 'AlertTriangle', color: '#ef4444' },
  { id: 'Study', name: 'Study', icon: 'BookOpen', color: '#8b5cf6' },
  { id: 'Fitness', name: 'Fitness', icon: 'Activity', color: '#10b981' },
  { id: 'Ideas', name: 'Ideas', icon: 'Lightbulb', color: '#f59e0b' }
];
