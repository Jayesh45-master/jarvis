import React, { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);
  const { tasks, history } = useTasks();

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback((title, options = {}) => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      setTimeout(() => notification.close(), 5000);
    }
  }, [permission]);

  // Add in-app notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
    
    // Auto remove after 5 seconds for success notifications
    if (notification.type === 'success') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Check for overdue tasks
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
          const dueDate = new Date(task.dueDate);
          const timeDiff = now - dueDate;
          
          // Notify if task is overdue by more than 1 hour
          if (timeDiff > 3600000 && timeDiff < 3660000) { // 1 hour window
            const notification = {
              type: 'error',
              title: 'Overdue Task',
              message: `"${task.title}" is overdue!`,
              action: 'View Task'
            };
            
            addNotification(notification);
            showBrowserNotification('Task Overdue', {
              body: `"${task.title}" is overdue!`,
              tag: `overdue-${task.id}`
            });
          }
        }
      });
    };

    const interval = setInterval(checkOverdueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, addNotification, showBrowserNotification]);

  // Check for upcoming tasks
  useEffect(() => {
    const checkUpcomingTasks = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.dueDate && task.dueTime && !task.completed) {
          const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
          const timeDiff = taskDateTime - now;
          
          // Notify 15 minutes before task
          if (timeDiff > 0 && timeDiff <= 900000 && timeDiff > 840000) { // 15-14 minute window
            const notification = {
              type: 'warning',
              title: 'Upcoming Task',
              message: `"${task.title}" is due in 15 minutes`,
              action: 'Prepare'
            };
            
            addNotification(notification);
            showBrowserNotification('Upcoming Task', {
              body: `"${task.title}" is due in 15 minutes`,
              tag: `upcoming-${task.id}`
            });
          }
          
          // Notify when task is due
          if (timeDiff > 0 && timeDiff <= 60000 && timeDiff > 0) { // 1 minute window
            const notification = {
              type: 'info',
              title: 'Task Due Now',
              message: `"${task.title}" is due now!`,
              action: 'Start Task'
            };
            
            addNotification(notification);
            showBrowserNotification('Task Due Now', {
              body: `"${task.title}" is due now!`,
              tag: `due-${task.id}`
            });
          }
        }
      });
    };

    const interval = setInterval(checkUpcomingTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, addNotification, showBrowserNotification]);

  // Listen for task completion
  useEffect(() => {
    const lastHistoryLength = localStorage.getItem('lastHistoryLength') || '0';
    const currentHistoryLength = history.length;
    
    if (currentHistoryLength > parseInt(lastHistoryLength)) {
      const latestTask = history[0];
      if (latestTask) {
        const notification = {
          type: 'success',
          title: 'Task Completed',
          message: `"${latestTask.title}" has been completed!`,
          action: 'View History'
        };
        
        addNotification(notification);
        showBrowserNotification('Task Completed', {
          body: `"${latestTask.title}" has been completed!`,
          tag: `completed-${latestTask.id}`
        });
      }
    }
    
    localStorage.setItem('lastHistoryLength', currentHistoryLength.toString());
  }, [history, addNotification, showBrowserNotification]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#00ff88';
      case 'error': return '#ff4444';
      case 'warning': return '#ffaa00';
      case 'info': return '#00fff7';
      default: return '#00ccff';
    }
  };

  return (
    <div className="notification-system">
      {/* Permission Request */}
      {permission === 'default' && (
        <div className="permission-banner">
          <span>Enable notifications to get task reminders</span>
          <button onClick={requestPermission} className="enable-btn">
            Enable Notifications
          </button>
        </div>
      )}
      
      {/* Notification List */}
      <div className="notification-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
            style={{ borderLeftColor: getNotificationColor(notification.type) }}
          >
            <div className="notification-header">
              <span className="notification-icon">
                {getNotificationIcon(notification.type)}
              </span>
              <span className="notification-title">{notification.title}</span>
              <button
                className="notification-close"
                onClick={() => removeNotification(notification.id)}
              >
                ×
              </button>
            </div>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </div>
            {notification.action && (
              <button className="notification-action">
                {notification.action}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Notification Counter */}
      {notifications.length > 0 && (
        <div className="notification-counter">
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
