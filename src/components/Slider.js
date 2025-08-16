import React, { useState, useRef } from "react";
import "./Slider.css";
import { useTasks, TASK_CATEGORIES, PRIORITY_LEVELS } from "../context/TaskContext";

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#00fff7" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00fff7" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00fff7" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00fff7" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00fff7" strokeWidth="2" strokeLinecap="round">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </svg>
);

function SidebarTaskMenu({ onRename, onArchive, onDelete, onShare, onClose, onEdit }) {
  return (
    <div className="sidebar-task-menu" tabIndex={-1} onBlur={onClose}>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onShare}>Share</button>
      <button onClick={onRename}>Rename</button>
      <button onClick={onArchive}>Archive</button>
      <button className="sidebar-task-menu-delete" onClick={onDelete}>Delete</button>
    </div>
  );
}

function SidebarTaskItem({ task, active, onClick, onRename, onArchive, onDelete, onShare, onEdit, isHistory }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(task.title);
  const inputRef = useRef();

  // Focus input when renaming
  React.useEffect(() => { if (renaming && inputRef.current) inputRef.current.focus(); }, [renaming]);

  const handleRename = () => {
    if (renameValue.trim() && renameValue !== task.title) onRename(task.id, renameValue.trim());
    setRenaming(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const categoryInfo = TASK_CATEGORIES[task.category] || TASK_CATEGORIES.personal;
  const priorityInfo = PRIORITY_LEVELS[task.priority] || PRIORITY_LEVELS.medium;

  return (
    <div
      className={`sidebar-task-item${active ? " active" : ""}${isOverdue ? " overdue" : ""}`}
      onClick={() => onClick(task)}
      tabIndex={0}
      title={task.title}
      onBlur={() => setMenuOpen(false)}
    >
      <div className="task-header">
        <div className="task-category" style={{ backgroundColor: categoryInfo.color }}>
          {categoryInfo.icon}
        </div>
        <div className="task-priority" style={{ backgroundColor: priorityInfo.color }}>
          {priorityInfo.name}
        </div>
      </div>
      
      {renaming ? (
        <input
          ref={inputRef}
          className="sidebar-task-rename-input"
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={handleRename}
          onKeyDown={e => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
        />
      ) : (
        <span className="sidebar-task-title">{task.title}</span>
      )}
      
      {task.description && (
        <span className="sidebar-task-description">{task.description}</span>
      )}
      
      <div className="task-details">
        {task.dueDate && (
          <span className={`task-due-date${isOverdue ? " overdue" : ""}`}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        {task.dueTime && (
          <span className="task-due-time">
            ⏰ {task.dueTime}
          </span>
        )}
        {task.recurring && (
          <span className="task-recurring">
            🔄 {task.recurring}
          </span>
        )}
      </div>
      
      <button
        className="sidebar-task-dots"
        tabIndex={0}
        aria-label="Task menu"
        onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
      >
        <DotsIcon />
      </button>
      
      {menuOpen && (
        <SidebarTaskMenu
          onRename={() => { setRenaming(true); setMenuOpen(false); }}
          onEdit={() => { onEdit(task); setMenuOpen(false); }}
          onArchive={() => { onArchive(task.id); setMenuOpen(false); }}
          onDelete={() => { if(window.confirm("Delete this task?")) onDelete(task.id, isHistory); setMenuOpen(false); }}
          onShare={() => { onShare(task); setMenuOpen(false); }}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

const NewTaskModal = ({ open, onClose, onSave, initial, categories, priorities }) => {
  const [formData, setFormData] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    category: initial?.category || "personal",
    priority: initial?.priority || "medium",
    dueDate: initial?.dueDate || "",
    dueTime: initial?.dueTime || "",
    recurring: initial?.recurring || "",
    tags: initial?.tags?.join(", ") || ""
  });

  const isEdit = !!initial;

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const taskData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : []
    };
    
    onSave(taskData);
  };

  return (
    <div className="sidebar-modal-bg">
      <div className="sidebar-modal">
        <h2>{isEdit ? "Edit Task" : "New Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="sidebar-modal-input"
            type="text"
            placeholder="Task title *"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <textarea
            className="sidebar-modal-textarea"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows="3"
          />
          
          <div className="form-row">
            <select
              className="sidebar-modal-select"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {Object.entries(categories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            
            <select
              className="sidebar-modal-select"
              value={formData.priority}
              onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            >
              {Object.entries(priorities).map(([key, priority]) => (
                <option key={key} value={key}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <input
              className="sidebar-modal-input"
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
            
            <input
              className="sidebar-modal-input"
              type="time"
              value={formData.dueTime}
              onChange={e => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
            />
          </div>
          
          <select
            className="sidebar-modal-select"
            value={formData.recurring}
            onChange={e => setFormData(prev => ({ ...prev, recurring: e.target.value }))}
          >
            <option value="">No Recurring</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          
          <input
            className="sidebar-modal-input"
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          />
          
          <div className="sidebar-modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={!formData.title.trim()}>
              {isEdit ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Slider = () => {
  const { 
    tasks, 
    history, 
    addTask, 
    editTask, 
    deleteTask, 
    completeTask, 
    deleteHistory,
    getTasksByCategory,
    getOverdueTasks,
    getTodayTasks,
    getUpcomingTasks,
    getTaskStatistics
  } = useTasks();
  
  const [search, setSearch] = useState("");
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const user = { name: "DRASHTI JAIN", status: "5028" };
  const stats = getTaskStatistics();

  const handleAddTask = (taskData) => {
    addTask(taskData);
    setModalOpen(false);
  };

  const handleEditTask = (taskData) => {
    editTask(editTaskData.id, taskData);
    setEditTaskData(null);
    setModalOpen(false);
  };

  const handleDeleteTask = (id, isHistory) => {
    if (isHistory) deleteHistory(id);
    else deleteTask(id);
  };

  const handleRenameTask = (id, newTitle) => {
    editTask(id, { title: newTitle });
  };

  const handleArchiveTask = (id) => {
    completeTask(id);
  };

  const handleShareTask = (task) => {
    const taskInfo = `Task: ${task.title}\nCategory: ${TASK_CATEGORIES[task.category]?.name}\nPriority: ${PRIORITY_LEVELS[task.priority]?.name}${task.dueDate ? `\nDue: ${task.dueDate}` : ''}`;
    navigator.clipboard.writeText(taskInfo);
    alert("Task info copied to clipboard!");
  };

  const handleEditTaskClick = (task) => {
    setEditTaskData(task);
    setModalOpen(true);
  };

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "overdue":
        return getOverdueTasks();
      case "today":
        return getTodayTasks();
      case "upcoming":
        return getUpcomingTasks();
      case "all":
      default:
        return filteredTasks;
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-menu-icon">
          <MenuIcon />
        </div>
        <button className="sidebar-new-task-btn" onClick={() => { setEditTaskData(null); setModalOpen(true); }}>
          <PlusIcon /> New Task
        </button>
        <div className="sidebar-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Task Statistics */}
      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-number">{stats.totalTasks}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.overdueTasks}</span>
          <span className="stat-label">Overdue</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.todayTasks}</span>
          <span className="stat-label">Today</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="sidebar-filters">
        <button 
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        <button 
          className={`filter-btn ${activeFilter === "today" ? "active" : ""}`}
          onClick={() => setActiveFilter("today")}
        >
          Today
        </button>
        <button 
          className={`filter-btn ${activeFilter === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveFilter("upcoming")}
        >
          Upcoming
        </button>
        <button 
          className={`filter-btn ${activeFilter === "overdue" ? "active" : ""}`}
          onClick={() => setActiveFilter("overdue")}
        >
          Overdue
        </button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Tasks ({getFilteredTasks().length})</div>
        <div className="sidebar-task-list">
          {getFilteredTasks().length === 0 ? (
            <div className="sidebar-empty">No tasks found.</div>
          ) : (
            getFilteredTasks().map(task => (
              <SidebarTaskItem
                key={task.id}
                task={task}
                active={task.id === activeTaskId}
                onClick={t => setActiveTaskId(t.id)}
                onRename={handleRenameTask}
                onEdit={handleEditTaskClick}
                onArchive={handleArchiveTask}
                onDelete={handleDeleteTask}
                onShare={handleShareTask}
                isHistory={false}
              />
            ))
          )}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">History ({history.length})</div>
        <div className="sidebar-task-list">
          {history.length === 0 ? (
            <div className="sidebar-empty">No past tasks.</div>
          ) : (
            history.map(task => (
              <SidebarTaskItem
                key={task.id}
                task={task}
                active={false}
                onClick={t => setActiveTaskId(t.id)}
                onRename={handleRenameTask}
                onEdit={handleEditTaskClick}
                onArchive={() => {}}
                onDelete={handleDeleteTask}
                onShare={handleShareTask}
                isHistory={true}
              />
            ))
          )}
        </div>
      </div>

      <div className="sidebar-user-info">
        <div className="sidebar-user-dot"></div>
        <div>
          <div className="sidebar-user-name">{user.name}</div>
          <div className="sidebar-user-status">{user.status}</div>
        </div>
      </div>

      <NewTaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTaskData(null); }}
        onSave={editTaskData ? handleEditTask : handleAddTask}
        initial={editTaskData}
        categories={TASK_CATEGORIES}
        priorities={PRIORITY_LEVELS}
      />
    </div>
  );
};

export default Slider;