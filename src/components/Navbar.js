import React, { useState } from "react";
import { useTasks, TASK_CATEGORIES, PRIORITY_LEVELS } from "../context/TaskContext";
import "./Navbar.css";

const TaskHoverCard = ({ tasks, title, onClose }) => {
  if (tasks.length === 0) {
    return (
      <div className="task-hover-card">
        <div className="hover-card-header">
          <h4>{title}</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="no-tasks">No {title.toLowerCase()} found</div>
      </div>
    );
  }

  return (
    <div className="task-hover-card">
      <div className="hover-card-header">
        <h4>{title} ({tasks.length})</h4>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="hover-task-list">
        {tasks.slice(0, 5).map(task => {
          const categoryInfo = TASK_CATEGORIES[task.category] || TASK_CATEGORIES.personal;
          const priorityInfo = PRIORITY_LEVELS[task.priority] || PRIORITY_LEVELS.medium;
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
          
          return (
            <div key={task.id} className={`hover-task-item ${isOverdue ? 'overdue' : ''}`}>
              <div className="task-header-mini">
                <span className="task-category-icon" style={{ color: categoryInfo.color }}>
                  {categoryInfo.icon}
                </span>
                <span className="task-priority-badge" style={{ backgroundColor: priorityInfo.color }}>
                  {priorityInfo.name}
                </span>
              </div>
              <div className="task-content">
                <div className="task-title-mini">{task.title}</div>
                {task.description && (
                  <div className="task-desc-mini">{task.description}</div>
                )}
                <div className="task-meta">
                  {task.dueDate && (
                    <span className={`task-date ${isOverdue ? 'overdue' : ''}`}>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.dueTime && (
                    <span className="task-time">
                      ⏰ {task.dueTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {tasks.length > 5 && (
          <div className="more-tasks">+{tasks.length - 5} more tasks</div>
        )}
      </div>
    </div>
  );
};

const Navbar = ({ activeTab, setActiveTab }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const { getUpcomingTasks, tasks } = useTasks();
  
  const upcomingTasks = getUpcomingTasks();
  const ongoingTasks = tasks.filter(task => {
    const now = new Date();
    const taskDate = new Date(task.dueDate);
    const taskTime = task.dueTime ? new Date(`${task.dueDate}T${task.dueTime}`) : null;
    return taskTime && taskTime <= now && taskDate >= new Date(now.toDateString()) && !task.completed;
  });

  return (
    <nav className="jarvis-navbar">
      <div className="jarvis-navbar-tabs">
        <div
          className={`jarvis-navbar-tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
          onMouseEnter={() => setHoveredTab("upcoming")}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <span>Upcoming Tasks</span>
          <span className="task-count">{upcomingTasks.length}</span>
          {hoveredTab === "upcoming" && (
            <TaskHoverCard 
              tasks={upcomingTasks} 
              title="Upcoming Tasks" 
              onClose={() => setHoveredTab(null)}
            />
          )}
        </div>
        <div
          className={`jarvis-navbar-tab ${activeTab === "ongoing" ? "active" : ""}`}
          onClick={() => setActiveTab("ongoing")}
          onMouseEnter={() => setHoveredTab("ongoing")}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <span>Ongoing Tasks</span>
          <span className="task-count">{ongoingTasks.length}</span>
          {hoveredTab === "ongoing" && (
            <TaskHoverCard 
              tasks={ongoingTasks} 
              title="Ongoing Tasks" 
              onClose={() => setHoveredTab(null)}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
