import React, { useState, useEffect } from 'react';
import './JarvisNotificationCalendar.css';

function JarvisNotificationCalendar() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState('');
  const [taskCategory, setTaskCategory] = useState('personal');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const taskCategories = {
    personal: { name: 'Personal', color: '#00ff88', icon: '👤' },
    work: { name: 'Work', color: '#ffaa00', icon: '💼' },
    health: { name: 'Health', color: '#ff4444', icon: '🏥' },
    study: { name: 'Study', color: '#8844ff', icon: '📚' },
    shopping: { name: 'Shopping', color: '#ff44aa', icon: '🛒' }
  };

  const priorityLevels = {
    low: { name: 'Low', color: '#00ff88', icon: '🟢' },
    medium: { name: 'Medium', color: '#ffaa00', icon: '🟡' },
    high: { name: 'High', color: '#ff4444', icon: '🔴' }
  };

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('jarvisTasks')) || {};
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('jarvisTasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    const dateStr = formatDateString(day);
    setSelectedDate(dateStr);
    setShowTaskForm(true);
    setEditingTask(null);
    setTaskInput('');
    setTaskCategory('personal');
    setTaskPriority('medium');
  };

  const handleTaskEdit = (taskId) => {
    const task = tasks[selectedDate].find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setTaskInput(task.text);
      setTaskCategory(task.category);
      setTaskPriority(task.priority);
    }
  };

  const handleTaskSave = () => {
    if (selectedDate && taskInput.trim()) {
      const newTask = {
        id: editingTask ? editingTask.id : Date.now(),
        text: taskInput.trim(),
        category: taskCategory,
        priority: taskPriority,
        completed: editingTask ? editingTask.completed : false,
        createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingTasks = tasks[selectedDate] || [];
      let updatedTasks;

      if (editingTask) {
        updatedTasks = existingTasks.map(t => t.id === editingTask.id ? newTask : t);
        // Show notification for task update
        if (window.jarvisAddNotification) {
          window.jarvisAddNotification(`Task updated: "${newTask.text}"`, 'info');
        }
      } else {
        updatedTasks = [...existingTasks, newTask];
        // Show notification for new task
        if (window.jarvisAddNotification) {
          const priorityText = priorityLevels[taskPriority].name;
          const categoryText = taskCategories[taskCategory].name;
          window.jarvisAddNotification(`New ${priorityText} priority ${categoryText} task added: "${newTask.text}"`, 'info');
        }
      }

      const newTasks = { ...tasks, [selectedDate]: updatedTasks };
      setTasks(newTasks);
      resetTaskForm();
    }
  };

  const handleTaskDelete = (taskId) => {
    if (selectedDate) {
      const existingTasks = tasks[selectedDate] || [];
      const taskToDelete = existingTasks.find(t => t.id === taskId);
      const updatedTasks = existingTasks.filter(t => t.id !== taskId);
      
      if (updatedTasks.length === 0) {
        const newTasks = { ...tasks };
        delete newTasks[selectedDate];
        setTasks(newTasks);
      } else {
        setTasks({ ...tasks, [selectedDate]: updatedTasks });
      }

      // Show notification for task deletion
      if (window.jarvisAddNotification && taskToDelete) {
        window.jarvisAddNotification(`Task deleted: "${taskToDelete.text}"`, 'info');
      }
    }
  };

  const handleTaskToggle = (taskId) => {
    if (selectedDate) {
      const existingTasks = tasks[selectedDate] || [];
      const updatedTasks = existingTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      setTasks({ ...tasks, [selectedDate]: updatedTasks });

      // Show celebration notification for task completion
      const completedTask = updatedTasks.find(t => t.id === taskId);
      if (completedTask && completedTask.completed && window.jarvisAddNotification) {
        const emojis = ['🎉', '✅', '🚀', '💪', '🌟', '🔥', '🎯', '🏆'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        window.jarvisAddNotification(`${randomEmoji} Task completed: "${completedTask.text}"`, 'welcome');
      }
    }
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showCalendar) return;
      
      switch(e.key) {
        case 'Escape':
          if (showTaskForm) {
            resetTaskForm();
          } else {
            setShowCalendar(false);
          }
          break;
        case 'Enter':
          if (showTaskForm && taskInput.trim()) {
            handleTaskSave();
          }
          break;
        case 'n':
          if (!showTaskForm) {
            setShowTaskForm(true);
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey) {
            handlePrevMonth();
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey) {
            handleNextMonth();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showCalendar, showTaskForm, taskInput]);

  // Add task reminder notifications for upcoming tasks
  useEffect(() => {
    const checkUpcomingTasks = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const tomorrowTasks = tasks[tomorrowStr] || [];
      
      if (tomorrowTasks.length > 0 && window.jarvisAddNotification) {
        const highPriorityTasks = tomorrowTasks.filter(t => t.priority === 'high');
        if (highPriorityTasks.length > 0) {
          window.jarvisAddNotification(`⚠️ You have ${highPriorityTasks.length} high priority task(s) tomorrow!`, 'info');
        }
      }
    };

    // Check for upcoming tasks every hour
    const interval = setInterval(checkUpcomingTasks, 60 * 60 * 1000);
    
    // Initial check
    checkUpcomingTasks();
    
    return () => clearInterval(interval);
  }, [tasks]);

  // Add task statistics and insights
  const getTaskInsights = () => {
    const allTasks = Object.values(tasks).flat();
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.completed).length;
    const highPriorityTasks = allTasks.filter(t => t.priority === 'high' && !t.completed).length;
    const overdueTasks = allTasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      const today = new Date();
      return !t.completed && taskDate < today;
    }).length;

    return {
      totalTasks,
      completedTasks,
      highPriorityTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const insights = getTaskInsights();

  const resetTaskForm = () => {
    setTaskInput('');
    setTaskCategory('personal');
    setTaskPriority('medium');
    setShowTaskForm(false);
    setEditingTask(null);
    setSelectedDate(null);
  };

  const formatDateString = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const getTasksForDay = (day) => {
    const dateStr = formatDateString(day);
    return tasks[dateStr] || [];
  };

  const getDayProgress = (day) => {
    const dayTasks = getTasksForDay(day);
    if (dayTasks.length === 0) return 0;
    const completed = dayTasks.filter(t => t.completed).length;
    return Math.round((completed / dayTasks.length) * 100);
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div className="calendar-day empty" key={`empty-${i}`} />);
    }

    for (let day = 1; day <= days; day++) {
      const dateStr = formatDateString(day);
      const dayTasks = getTasksForDay(day);
      const hasTask = dayTasks.length > 0;
      const isCurrentDay = isToday(day);
      const progress = getDayProgress(day);
      
      let className = 'calendar-day';
      if (hasTask) className += ' task-day';
      if (isCurrentDay) className += ' today';

      calendarDays.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDayClick(day)}
          title={`${day} - ${dayTasks.length} task(s) - ${progress}% complete`}
        >
          <div className="day-number">{day}</div>
          {hasTask && (
            <div className="day-tasks-info">
              <div className="task-count">{dayTasks.length}</div>
              {progress > 0 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#00ff88' : '#00ffff' }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return calendarDays;
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getMonthStats = () => {
    const monthTasks = Object.values(tasks).flat();
    const totalTasks = monthTasks.length;
    const completedTasks = monthTasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { totalTasks, completedTasks, completionRate };
  };

  const monthStats = getMonthStats();

  return (
    <div className="jarvis-calendar-wrapper">
      <div className="calendar-notify" onClick={toggleCalendar} title="Open Calendar">
        📅
        {monthStats.totalTasks > 0 && (
          <span className="month-task-badge" style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: monthStats.completionRate === 100 ? '#00ff88' : '#00ffff',
            color: '#000',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {monthStats.totalTasks}
          </span>
        )}
      </div>

      {showCalendar && (
        <div className="jarvis-calendar-popup">
          <div className="calendar-header">
            <button onClick={handlePrevMonth} title="Previous Month">◀</button>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </span>
            <button onClick={handleNextMonth} title="Next Month">▶</button>
          </div>

          {/* Month Statistics */}
          <div className="month-stats">
            <div className="stat-item">
              <span className="stat-label">Total Tasks:</span>
              <span className="stat-value">{monthStats.totalTasks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed:</span>
              <span className="stat-value">{monthStats.completedTasks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Progress:</span>
              <span className="stat-value">{monthStats.completionRate}%</span>
            </div>
          </div>

          {/* Task Insights */}
          {insights.totalTasks > 0 && (
            <div className="task-insights">
              <div className="insights-header">
                <span style={{ color: '#00ffff', fontSize: '14px', fontWeight: '600' }}>📊 Task Insights</span>
              </div>
              <div className="insights-grid">
                {insights.highPriorityTasks > 0 && (
                  <div className="insight-item high-priority">
                    <span className="insight-icon">🔴</span>
                    <span className="insight-text">{insights.highPriorityTasks} High Priority</span>
                  </div>
                )}
                {insights.overdueTasks > 0 && (
                  <div className="insight-item overdue">
                    <span className="insight-icon">⏰</span>
                    <span className="insight-text">{insights.overdueTasks} Overdue</span>
                  </div>
                )}
                {insights.completionRate >= 80 && (
                  <div className="insight-item achievement">
                    <span className="insight-icon">🏆</span>
                    <span className="insight-text">Great Progress!</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{
                textAlign: 'center',
                padding: '8px 4px',
                fontSize: '12px',
                color: '#00ffff',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          {/* Task Management Section */}
          {selectedDate && (
            <div className="task-management-section">
              <div className="section-header">
                <h4>Tasks for {selectedDate}</h4>
                <button 
                  className="add-task-btn"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                >
                  {showTaskForm ? 'Cancel' : 'Add Task'}
                </button>
              </div>

              {/* Task Form */}
              {showTaskForm && (
                <div className="task-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Enter your task..."
                      className="task-input"
                    />
                  </div>
                  
                  <div className="form-row">
                    <select 
                      value={taskCategory} 
                      onChange={(e) => setTaskCategory(e.target.value)}
                      className="task-select"
                    >
                      {Object.entries(taskCategories).map(([key, cat]) => (
                        <option key={key} value={key}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    
                    <select 
                      value={taskPriority} 
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className="task-select"
                    >
                      {Object.entries(priorityLevels).map(([key, pri]) => (
                        <option key={key} value={key}>
                          {pri.icon} {pri.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button 
                      onClick={handleTaskSave} 
                      disabled={!taskInput.trim()}
                      className="save-btn"
                    >
                      {editingTask ? 'Update' : 'Save'}
                    </button>
                    {editingTask && (
                      <button 
                        onClick={resetTaskForm}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Task List */}
              <div className="task-list">
                {(tasks[selectedDate] || []).map(task => (
                  <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <div className="task-content">
                      <button
                        onClick={() => handleTaskToggle(task.id)}
                        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                        title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? '✓' : ''}
                      </button>
                      
                      <div className="task-details">
                        <span className="task-text">{task.text}</span>
                        <div className="task-meta">
                          <span 
                            className="task-category"
                            style={{ color: taskCategories[task.category]?.color }}
                          >
                            {taskCategories[task.category]?.icon} {taskCategories[task.category]?.name}
                          </span>
                          <span 
                            className="task-priority"
                            style={{ color: priorityLevels[task.priority]?.color }}
                          >
                            {priorityLevels[task.priority]?.icon}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="task-actions">
                      <button
                        onClick={() => handleTaskEdit(task.id)}
                        className="edit-btn"
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleTaskDelete(task.id)}
                        className="delete-btn"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                
                {(tasks[selectedDate] || []).length === 0 && (
                  <div className="no-tasks">No tasks for this date</div>
                )}
              </div>
            </div>
          )}

          <div style={{
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '8px' }}>Click on any day to manage tasks</div>
            <div style={{ 
              fontSize: '10px', 
              color: 'rgba(255, 255, 255, 0.4)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              textAlign: 'left'
            }}>
              <div><strong>⌨️ Shortcuts:</strong></div>
              <div></div>
              <div>• <kbd>Esc</kbd> Close/Cancel</div>
              <div>• <kbd>Enter</kbd> Save Task</div>
              <div>• <kbd>N</kbd> New Task</div>
              <div>• <kbd>Ctrl+←/→</kbd> Change Month</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JarvisNotificationCalendar;
