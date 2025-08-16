import React, { useState, useEffect } from "react";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem('jarvisNotifications') || '[]');
    setNotifications(savedNotifications);
    setUnreadCount(savedNotifications.filter(n => !n.read).length);
  }, []);

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem('jarvisNotifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  // Expose addNotification globally for other components
  useEffect(() => {
    window.jarvisAddNotification = addNotification;
    return () => {
      delete window.jarvisAddNotification;
    };
  }, []);

  return (
    <div className="notification-bell">
      <button 
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <button onClick={markAllAsRead} title="Mark all as read">
                ✓
              </button>
              <button onClick={clearNotifications} title="Clear all">
                🗑️
            </button>
            </div>
          </div>
          
          <div className="notification-list">
          {notifications.length === 0 ? (
              <div className="no-notifications">
                No notifications
              </div>
          ) : (
            notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${getNotificationClass(notification.type)} ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator" />
                  )}
              </div>
            ))
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
