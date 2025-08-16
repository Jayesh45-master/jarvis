import React, { createContext, useContext, useEffect, useState } from "react";

const TaskContext = createContext();

const TASKS_KEY = "jarvis_tasks";
const HISTORY_KEY = "jarvis_history";
const SETTINGS_KEY = "jarvis_settings";

// Task categories with colors
export const TASK_CATEGORIES = {
  work: { name: "Work", color: "#00fff7", icon: "💼" },
  personal: { name: "Personal", color: "#00ff88", icon: "👤" },
  health: { name: "Health", color: "#ff4444", icon: "🏃‍♂️" },
  study: { name: "Study", color: "#8844ff", icon: "📚" },
  shopping: { name: "Shopping", color: "#ffaa00", icon: "🛒" },
  family: { name: "Family", color: "#ff44aa", icon: "👨‍👩‍👧‍👦" },
  urgent: { name: "Urgent", color: "#ff0066", icon: "🚨" }
};

// Priority levels
export const PRIORITY_LEVELS = {
  low: { name: "Low", color: "#00ccff", value: 1 },
  medium: { name: "Medium", color: "#00ff88", value: 2 },
  high: { name: "High", color: "#ffaa00", value: 3 },
  urgent: { name: "Urgent", color: "#ff4444", value: 4 }
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    defaultCategory: 'personal',
    defaultPriority: 'medium',
    enableNotifications: true,
    theme: 'dark'
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    const storedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const storedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    
    setTasks(storedTasks);
    setHistory(storedHistory);
    setSettings(prev => ({ ...prev, ...storedSettings }));
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);
  
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Enhanced task creation with validation
  const createTask = (taskData) => {
    const newTask = {
      id: Date.now() + Math.random(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      category: taskData.category || settings.defaultCategory,
      priority: taskData.priority || settings.defaultPriority,
      dueDate: taskData.dueDate || null,
      dueTime: taskData.dueTime || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recurring: taskData.recurring || null,
      tags: taskData.tags || [],
      estimatedDuration: taskData.estimatedDuration || null,
      actualDuration: null,
      notes: taskData.notes || '',
      attachments: taskData.attachments || []
    };

    return newTask;
  };

  // Actions
  const addTask = (taskData) => {
    const newTask = createTask(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const editTask = (id, updates) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const completedTask = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString(),
        actualDuration: task.estimatedDuration ? 
          Math.floor((new Date() - new Date(task.createdAt)) / (1000 * 60)) : null
      };
      
      setTasks(prev => prev.filter(t => t.id !== id));
      setHistory(prev => [completedTask, ...prev]);
      
      // Handle recurring tasks
      if (task.recurring) {
        const nextTask = createNextRecurringTask(task);
        if (nextTask) {
          setTasks(prev => [...prev, nextTask]);
        }
      }
    }
  };

  const createNextRecurringTask = (completedTask) => {
    const now = new Date();
    let nextDate = new Date(now);
    
    switch (completedTask.recurring) {
      case 'daily':
        nextDate.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(now.getMonth() + 1);
        break;
      default:
        return null;
    }
    
    return {
      ...completedTask,
      id: Date.now() + Math.random(),
      completed: false,
      completedAt: null,
      actualDuration: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: nextDate.toISOString().split('T')[0]
    };
  };

  const deleteHistory = (id) => setHistory(prev => prev.filter(t => t.id !== id));

  const clearHistory = () => setHistory([]);

  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < now;
    });
  };

  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today);
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return task.dueDate >= today;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const searchTasks = (query) => {
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getTaskStatistics = () => {
    const totalTasks = tasks.length;
    const completedTasks = history.length;
    const overdueTasks = getOverdueTasks().length;
    const todayTasks = getTodayTasks().length;
    
    const categoryStats = Object.keys(TASK_CATEGORIES).map(category => ({
      category,
      count: getTasksByCategory(category).length
    }));
    
    const priorityStats = Object.keys(PRIORITY_LEVELS).map(priority => ({
      priority,
      count: getTasksByPriority(priority).length
    }));
    
    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      todayTasks,
      categoryStats,
      priorityStats
    };
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      history,
      settings,
      TASK_CATEGORIES,
      PRIORITY_LEVELS,
      addTask,
      editTask,
      deleteTask,
      completeTask,
      deleteHistory,
      clearHistory,
      getTasksByCategory,
      getTasksByPriority,
      getOverdueTasks,
      getTodayTasks,
      getUpcomingTasks,
      searchTasks,
      updateSettings,
      getTaskStatistics
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
