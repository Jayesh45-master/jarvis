import React, { useState, useEffect, useRef } from "react";
import { useTasks } from "../context/TaskContext";
import "./Clock.css";

const Clock = ({ activeTab }) => {
  const [time, setTime] = useState(new Date());
  // New hand refs
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const rafRef = useRef(null);
  const startedRef = useRef(false);
  const runningRef = useRef(false);
  const [isAnalog, setIsAnalog] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [hoveredAngle, setHoveredAngle] = useState(null);
  const [showTimeInfo, setShowTimeInfo] = useState(false);
  const { getTodayTasks, getUpcomingTasks, tasks } = useTasks();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Single rAF loop to rotate hands with current smooth timings
  useEffect(() => {
    if (startedRef.current) return; // prevent double-start in StrictMode
    startedRef.current = true;
    const animate = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;      // smooth seconds
      const m = now.getMinutes() + s / 60;         // smooth minutes
      const h = (now.getHours() % 12) + m / 60;    // smooth hours

      const secondDeg = s * 6;   // 360/60
      const minuteDeg = m * 6;   // 360/60
      const hourDeg = h * 30;    // 360/12

      const base = 'translate(-50%, -100%) translateZ(0)';
      if (secondRef.current) secondRef.current.style.transform = `${base} rotate(${secondDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `${base} rotate(${minuteDeg}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `${base} rotate(${hourDeg}deg)`;

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    runningRef.current = true;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startedRef.current = false;
      runningRef.current = false;
    };
  }, []);

  // Pause rAF when tab is hidden to save CPU; resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        runningRef.current = false;
      } else {
        if (!runningRef.current) {
          const animate = () => {
            const now = new Date();
            const ms = now.getMilliseconds();
            const s = now.getSeconds() + ms / 1000;
            const m = now.getMinutes() + s / 60;
            const h = (now.getHours() % 12) + m / 60;

            const secondDeg = s * 6;
            const minuteDeg = m * 6;
            const hourDeg = h * 30;

            const base = 'translate(-50%, -100%) translateZ(0)';
            if (secondRef.current) secondRef.current.style.transform = `${base} rotate(${secondDeg}deg)`;
            if (minuteRef.current) minuteRef.current.style.transform = `${base} rotate(${minuteDeg}deg)`;
            if (hourRef.current) hourRef.current.style.transform = `${base} rotate(${hourDeg}deg)`;

            rafRef.current = requestAnimationFrame(animate);
          };
          rafRef.current = requestAnimationFrame(animate);
          runningRef.current = true;
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Clock face should not toggle time overlay anymore
  const handleClockClick = () => {};

  const handleCenterClick = (e) => {
    e.stopPropagation();
    setIsAnalog(!isAnalog);
  };

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate hand angles properly for 12 o'clock start
  const hourAngle = ((hours % 12) * 30 + minutes * 0.5);
  const minuteAngle = (minutes * 6);
  const secondAngle = (seconds * 6);

  const formatTime = (num) => num.toString().padStart(2, '0');

  const handleOpenChat = (task) => {
    if (!task) return;
    // Prefer a prop if parent provides a chatbot integration
    if (typeof window !== 'undefined') {
      // Dispatch a custom event as a generic integration point
      try {
        window.dispatchEvent(new CustomEvent('open-chat', { detail: { task } }));
      } catch (e) {
        // no-op
      }
    }
    // Optional: if a prop is provided in the future, call it
    if (typeof (Clock.onOpenChat) === 'function') {
      try { Clock.onOpenChat(task); } catch (_) {}
    }
  };

  // Get tasks for display
  const todayTasks = getTodayTasks();

  // Compute next due task today (after current time)
  const nextTask = React.useMemo(() => {
    const now = new Date();
    const toDate = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      const d = new Date();
      d.setHours(h || 0, m || 0, 0, 0);
      return d;
    };
    const upcoming = todayTasks
      .filter(t => t.dueTime)
      .map(t => ({ t, when: toDate(t.dueTime) }))
      .filter(x => x.when >= now)
      .sort((a, b) => a.when - b.when);
    return upcoming.length ? upcoming[0] : null;
  }, [todayTasks, time]);

  const timeRemainingText = React.useMemo(() => {
    if (!nextTask) return '';
    const now = new Date();
    const deltaMs = nextTask.when - now;
    const minutes = Math.max(0, Math.round(deltaMs / 60000));
    if (minutes < 1) return 'due now';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }, [nextTask, time]);

  // Create task markers for clock positions
  const getTaskPosition = (task) => {
    if (!task.dueTime) return null;
    const [hours, minutes] = task.dueTime.split(':').map(Number);
    const angle = (hours % 12) * 30 + minutes * 0.5;
    return angle;
  };

  return (
    <div className={`jarvis-clock-container ${highContrast ? 'theme-contrast' : ''}`}>
      <div className="clock-header">
        <h3>Current Time</h3>
        <div>
          <button 
            className="clock-toggle-btn"
            onClick={() => setIsAnalog(!isAnalog)}
            style={{ marginRight: 8 }}
          >
            {isAnalog ? 'Digital' : 'Analog'}
          </button>
          <button
            className="clock-toggle-btn"
            onClick={() => setHighContrast((v) => !v)}
            aria-pressed={highContrast}
            title="Toggle high contrast"
          >
            {highContrast ? 'Standard' : 'High Contrast'}
          </button>
        </div>
      </div>
      
      {isAnalog ? (
        <div className="analog-clock">
          {/* Background effects layer */}
          <div className="clock-background"></div>
          
          {/* Foreground clock face */}
          <div
            className="clock-face"
            onMouseEnter={() => setShowTimeInfo(false)}
            onMouseMove={() => setShowTimeInfo(false)}
          >
            {/* Clock numbers removed for cleaner look */}
            
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="hour-marker"
                style={{
                  transform: `rotate(${i * 30}deg)`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTimeInfo(false);
                }}
                onMouseEnter={() => setShowTimeInfo(false)}
                onMouseMove={() => setShowTimeInfo(false)}
              />
            ))}
            
            {/* Minute markers */}
            {[...Array(60)].map((_, i) => {
              if (i % 5 !== 0) {
                return (
                  <div
                    key={i}
                    className="minute-marker"
                    style={{
                      transform: `rotate(${i * 6}deg)`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTimeInfo(false);
                    }}
                    onMouseEnter={() => setShowTimeInfo(false)}
                    onMouseMove={() => setShowTimeInfo(false)}
                  />
                );
              }
              return null;
            })}
            
            {/* Task markers on clock */}
            {todayTasks.map((task, index) => {
              const angle = getTaskPosition(task);
              if (!angle) return null;
              return (
                <div
                  key={task.id}
                  className="task-marker"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-190px)`,
                    backgroundColor: task.priority === 'urgent' ? '#ff4444' : task.priority === 'high' ? '#ffaa00' : '#00fff7'
                  }}
                  title={`${task.title} - ${task.dueTime}`}
                  onMouseEnter={() => { setHoveredTask(task); setHoveredTaskId(task.id); setHoveredAngle(angle); setShowTimeInfo(false); }}
                  onMouseMove={() => setShowTimeInfo(false)}
                  onMouseLeave={() => { setHoveredTask(null); setHoveredTaskId(null); setHoveredAngle(null); }}
                />
              );
            })}

            {/* Marker-anchored tooltip */}
            {hoveredTask && hoveredTaskId !== null && hoveredAngle !== null && (
              <div
                className="task-tooltip-box"
                style={{
                  transform: `rotate(${hoveredAngle}deg) translateY(-236px) rotate(${-hoveredAngle}deg)`
                }}
                onMouseLeave={() => { setHoveredTask(null); setHoveredTaskId(null); setHoveredAngle(null); }}
              >
                <div className="task-tooltip-title" role="button" tabIndex={0}
                  onClick={() => handleOpenChat(hoveredTask)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenChat(hoveredTask); }}
                >
                  {hoveredTask.title}
                </div>
                {hoveredTask.dueTime && (
                  <div className="task-tooltip-sub">{hoveredTask.dueTime}</div>
                )}
              </div>
            )}
            
            {/* Rebuilt clock hands */}
            <div className="hand hand-hour" ref={hourRef} />
            <div className="hand hand-minute" ref={minuteRef} />
            <div className="hand hand-second" ref={secondRef} />
            <div className="clock-center" onClick={handleCenterClick}></div>
            
            {/* Time info overlay disabled */}
            {false && (
              <div
                className="time-info-overlay"
                onMouseEnter={() => setShowTimeInfo(false)}
                onMouseMove={() => setShowTimeInfo(false)}
              >
                <div className="time-info">
                  <div className="current-time">{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</div>
                  <div className="time-details">
                    <div>Hour: {hours % 12 || 12}</div>
                    <div>Minute: {minutes}</div>
                    <div>Second: {seconds}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Old center tooltip removed (replaced by anchored tooltip) */}
          </div>
          
          {/* Today's tasks display */}
          {todayTasks.length > 0 && (
            <div className="today-tasks-display">
              <h4>Today's Tasks ({todayTasks.length})</h4>
              <div className="task-list-mini">
                {todayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="task-mini">
                    <span className="task-time">{task.dueTime || 'No time'}</span>
                    <span className="task-title">{task.title}</span>
                  </div>
                ))}
                {todayTasks.length > 3 && (
                  <div className="task-mini more">+{todayTasks.length - 3} more</div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="digital-clock">
          <div className="time-display">
            <span className="hours">{formatTime(hours)}</span>
            <span className="separator">:</span>
            <span className="minutes">{formatTime(minutes)}</span>
            <span className="separator">:</span>
            <span className="seconds">{formatTime(seconds)}</span>
          </div>
          <div className="date-display">
            {time.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      )}
      
      <div className="next-task-info">
        {nextTask ? (
          <>
            <div className="next-task-top">
              <div className="next-task-label">Next task</div>
              <div className="next-task-eta">in {timeRemainingText}</div>
            </div>
            <div className="next-task-title" title={nextTask.t.title}>
              {nextTask.t.title}
              {nextTask.t.dueTime ? (
                <span className="next-task-time">@ {nextTask.t.dueTime}</span>
              ) : null}
            </div>
            <div className="next-task-actions">
              <button className="next-task-btn" onClick={() => handleOpenChat(nextTask.t)}>Open Chat</button>
            </div>
          </>
        ) : (
          <div className="next-task-empty">No more tasks today</div>
        )}
      </div>
    </div>
  );
};

export default Clock;
