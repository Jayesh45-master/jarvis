import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import NotificationBell from "./NotificationBell";
import JarvisNotificationCalendar from "./JarvisNotificationCalendar";
import UnifiedFeaturesDemo from "./UnifiedFeaturesDemo";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello, I'm JARVIS. I can help you manage tasks naturally! Try saying: 'Schedule a meeting tomorrow at 2 PM' or 'Remind me to buy groceries on Friday'\n\n🎤 **Voice Commands:** Click the microphone to speak naturally\n📧 **Email Integration:** I can parse emails into tasks\n🧠 **Smart Suggestions:** I learn your patterns\n⚠️ **Conflict Detection:** I'll warn about scheduling conflicts\n⏰ **Optimal Scheduling:** I'll suggest the best times based on your productivity",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Disable auto-scrolling to prevent any page jumps
  const scrollToBottom = () => {
    // no-op: we keep the layout fixed with no scrolling
  };

  useEffect(() => {
    // Do not auto-scroll; only initialize data
    loadUserPreferences();
    loadProductivityData();
  }, [messages]);

  // Auto-resize textarea like ChatGPT
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 66; // px, ~3 lines to match CSS cap
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
  }, [inputValue]);

  // Load user preferences and patterns
  const loadUserPreferences = () => {
    const saved = localStorage.getItem('jarvisUserPreferences');
    if (saved) {
      setUserPreferences(JSON.parse(saved));
    }
  };

  // Load productivity data for optimal scheduling
  const loadProductivityData = () => {
    const saved = localStorage.getItem('jarvisProductivityData');
    if (!saved) {
      // Initialize with default productivity patterns
      const defaultData = {
        morning: { productivity: 0.9, tasks: [] },
        afternoon: { productivity: 0.7, tasks: [] },
        evening: { productivity: 0.5, tasks: [] },
        night: { productivity: 0.3, tasks: [] }
      };
      localStorage.setItem('jarvisProductivityData', JSON.stringify(defaultData));
    }
  };

  // Voice Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    }
  }, []);

  // Initialize recognition instance lazily
  const ensureRecognition = () => {
    if (!window.SpeechRecognition) return null;
    if (!recognitionRef.current) {
      const rec = new window.SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        addMessage('bot', '🎤 Listening... Speak your task now.');
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        addMessage('user', transcript);
        handleVoiceInput(transcript);
      };

      rec.onerror = (event) => {
        addMessage('bot', `Voice recognition error: ${event.error}`);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
    return recognitionRef.current;
  };

  const startVoiceRecognition = () => {
    if (!window.SpeechRecognition) {
      addMessage('bot', 'Voice recognition is not supported in your browser. Please use text input instead.');
      return;
    }
    const rec = ensureRecognition();
    try {
      rec && rec.start();
    } catch (_) {
      // start() may throw if already started; ignore
    }
  };

  const stopVoiceRecognition = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try { rec.stop(); } catch (_) {}
    }
  };

  const toggleVoiceRecognition = () => {
    if (!window.SpeechRecognition) {
      addMessage('bot', 'Voice recognition is not supported in your browser.');
      return;
    }
    if (isListening) stopVoiceRecognition(); else startVoiceRecognition();
  };

  // Attach button handlers
  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const summary = files.map(f => `${f.name} (${Math.round(f.size/1024)} KB)`).join(', ');
    addMessage('user', `Attached: ${summary}`);
    // Reset input so selecting the same file again will trigger change
    e.target.value = '';
  };

  const handleVoiceInput = (transcript) => {
    // Process voice input with natural language
    setTimeout(() => {
      const parsedTask = parseTaskFromText(transcript);
      const createdTask = createTaskFromParsedData(parsedTask);
      
      if (createdTask) {
        const { task, dateStr } = createdTask;
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });

        const botResponse = `🎤 **Voice Task Created!**\n\n📝 **${task.text}**\n📅 **Date:** ${formattedDate}\n🏷️ **Category:** ${task.category}\n🚨 **Priority:** ${task.priority}${task.recurring ? `\n🔄 **Recurring:** ${task.recurring}` : ''}\n\nI've added this to your calendar based on your voice command.`;
        
        addMessage('bot', botResponse);
        
        // Send notification
        if (window.jarvisAddNotification) {
          window.jarvisAddNotification(`Voice task created: ${task.text}`, 'info');
        }
      }
    }, 1000);
  };

  // Email Integration - Parse email content into tasks
  const parseEmailIntoTask = (emailContent) => {
    const lines = emailContent.split('\n');
    let taskText = '';
    let priority = 'medium';
    let category = 'work';
    
    // Extract subject line as task text
    for (const line of lines) {
      if (line.toLowerCase().includes('subject:') || line.toLowerCase().includes('re:')) {
        taskText = line.replace(/^(subject|re):\s*/i, '').trim();
        break;
      }
    }
    
    // Analyze email content for priority and category
    if (emailContent.toLowerCase().includes('urgent') || emailContent.toLowerCase().includes('asap')) {
      priority = 'high';
    }
    
    if (emailContent.toLowerCase().includes('meeting') || emailContent.toLowerCase().includes('call')) {
      category = 'work';
    } else if (emailContent.toLowerCase().includes('shopping') || emailContent.toLowerCase().includes('purchase')) {
      category = 'shopping';
    }
    
    return { taskText, priority, category };
  };

  // Smart Suggestions based on user patterns
  const getSmartSuggestions = (input) => {
    const suggestions = [];
    const tasks = JSON.parse(localStorage.getItem('jarvisTasks')) || {};
    
    // Analyze recurring patterns
    const allTasks = Object.values(tasks).flat();
    const categoryCounts = {};
    const dayPatterns = {};
    
    allTasks.forEach(task => {
      categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
      
      if (task.recurring) {
        const day = new Date(task.createdAt).getDay();
        dayPatterns[day] = (dayPatterns[day] || 0) + 1;
      }
    });
    
    // Suggest based on patterns
    if (input.toLowerCase().includes('exercise') && dayPatterns[1]) { // Monday
      suggestions.push("💡 **Smart Suggestion:** You usually exercise on Mondays. Would you like me to schedule this as a recurring Monday task?");
    }
    
    if (input.toLowerCase().includes('meeting') && categoryCounts.work > 3) {
      suggestions.push("💡 **Smart Suggestion:** You have many work tasks. Consider scheduling this during your most productive hours.");
    }
    
    return suggestions;
  };

  // Conflict Detection
  const detectConflicts = (proposedDate, proposedTime) => {
    const tasks = JSON.parse(localStorage.getItem('jarvisTasks')) || {};
    const dateStr = proposedDate.toISOString().split('T')[0];
    const dayTasks = tasks[dateStr] || [];
    
    if (!proposedTime) return null;
    
    const conflicts = dayTasks.filter(task => {
      if (task.time) {
        const taskHour = task.time.hour;
        const proposedHour = proposedTime.hour;
        return Math.abs(taskHour - proposedHour) < 2; // 2-hour buffer
      }
      return false;
    });
    
    if (conflicts.length > 0) {
      return {
        hasConflict: true,
        conflictingTasks: conflicts,
        message: `⚠️ **Schedule Conflict Detected!** You already have ${conflicts.length} task(s) around ${proposedTime.hour}:${proposedTime.minute.toString().padStart(2, '0')}. Consider rescheduling.`
      };
    }
    
    return { hasConflict: false };
  };

  // Optimal Scheduling based on productivity patterns
  const getOptimalTimeSlot = (taskCategory, taskPriority) => {
    const productivityData = JSON.parse(localStorage.getItem('jarvisProductivityData')) || {};
    const timeSlots = Object.entries(productivityData);
    
    // Sort by productivity score
    timeSlots.sort((a, b) => b[1].productivity - a[1].productivity);
    
    // High priority tasks get the most productive time
    if (taskPriority === 'high') {
      return timeSlots[0][0];
    }
    
    // Work tasks prefer morning/afternoon, personal tasks prefer evening
    if (taskCategory === 'work') {
      return timeSlots.find(([time]) => time === 'morning' || time === 'afternoon')?.[0] || timeSlots[0][0];
    } else {
      return timeSlots.find(([time]) => time === 'evening' || time === 'afternoon')?.[0] || timeSlots[0][0];
    }
  };

  // Enhanced task parsing with new features
  const parseTaskFromText = (text) => {
    const task = {
      text: '',
      date: null,
      time: null,
      priority: 'medium',
      category: 'personal',
      recurring: null
    };

    // Extract date patterns
    const datePatterns = [
      { regex: /(?:today|tonight)/i, value: new Date() },
      { regex: /(?:tomorrow|tmr)/i, value: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      { regex: /(?:next week|next week)/i, value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { regex: /(?:this weekend)/i, value: getNextWeekend() },
      { regex: /(?:next monday|next tuesday|next wednesday|next thursday|next friday|next saturday|next sunday)/i, value: getNextWeekday(text) },
      { regex: /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, value: getNextWeekday(text) }
    ];

    // Extract time patterns
    const timePatterns = [
      { regex: /(\d{1,2}):(\d{2})\s*(am|pm)/i, format: '12hour' },
      { regex: /(\d{1,2}):(\d{2})/i, format: '24hour' },
      { regex: /(\d{1,2})\s*(am|pm)/i, format: '12hour_simple' },
      { regex: /(morning|afternoon|evening|night)/i, format: 'word' }
    ];

    // Extract priority patterns
    const priorityPatterns = [
      { regex: /(?:urgent|asap|immediately|critical)/i, value: 'high' },
      { regex: /(?:low priority|not urgent|whenever)/i, value: 'low' },
      { regex: /(?:high priority|important|urgent)/i, value: 'high' }
    ];

    // Extract category patterns
    const categoryPatterns = [
      { regex: /(?:meeting|call|appointment|conference)/i, value: 'work' },
      { regex: /(?:exercise|workout|gym|run)/i, value: 'health' },
      { regex: /(?:study|read|learn|research)/i, value: 'study' },
      { regex: /(?:buy|purchase|shopping|grocery)/i, value: 'shopping' },
      { regex: /(?:family|friend|personal|home)/i, value: 'personal' }
    ];

    // Extract recurring patterns
    const recurringPatterns = [
      { regex: /(?:every day|daily)/i, value: 'daily' },
      { regex: /(?:every week|weekly)/i, value: 'weekly' },
      { regex: /(?:every month|monthly)/i, value: 'monthly' },
      { regex: /(?:every monday|every tuesday|every wednesday|every thursday|every friday|every saturday|every sunday)/i, value: 'weekly' }
    ];

    // Process patterns
    for (const pattern of datePatterns) {
      if (pattern.regex.test(text)) {
        task.date = pattern.value;
        break;
      }
    }

    for (const pattern of timePatterns) {
      const match = text.match(pattern.regex);
      if (match) {
        task.time = parseTime(match, pattern.format);
        break;
      }
    }

    for (const pattern of priorityPatterns) {
      if (pattern.regex.test(text)) {
        task.priority = pattern.value;
        break;
      }
    }

    for (const pattern of categoryPatterns) {
      if (pattern.regex.test(text)) {
        task.category = pattern.value;
        break;
      }
    }

    for (const pattern of recurringPatterns) {
      if (pattern.regex.test(text)) {
        task.recurring = pattern.value;
        break;
      }
    }

    // Extract the main task text
    let cleanText = text
      .replace(/(?:today|tonight|tomorrow|tmr|next week|this weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, '')
      .replace(/(?:urgent|asap|immediately|critical|low priority|not urgent|whenever|high priority|important)/gi, '')
      .replace(/(?:meeting|call|appointment|conference|exercise|workout|gym|run|study|read|learn|research|buy|purchase|shopping|grocery|family|friend|personal|home)/gi, '')
      .replace(/(?:every day|daily|every week|weekly|every month|monthly)/gi, '')
      .replace(/\d{1,2}:\d{2}\s*(am|pm)/gi, '')
      .replace(/\d{1,2}:\d{2}/gi, '')
      .replace(/\d{1,2}\s*(am|pm)/gi, '')
      .replace(/(morning|afternoon|evening|night)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    task.text = cleanText || 'Task from conversation';

    return task;
  };

  // Helper functions for date/time parsing
  const getNextWeekend = () => {
    const today = new Date();
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday;
  };

  const getNextWeekday = (text) => {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = weekdays.find(day => text.toLowerCase().includes(day));
    if (!targetDay) return null;

    const today = new Date();
    const targetDayIndex = weekdays.indexOf(targetDay);
    const daysUntilTarget = (targetDayIndex - today.getDay() + 7) % 7;
    const nextTargetDay = new Date(today);
    nextTargetDay.setDate(today.getDate() + daysUntilTarget);
    return nextTargetDay;
  };

  const parseTime = (match, format) => {
    if (format === '12hour') {
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const period = match[3].toLowerCase();
      
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      
      return { hour, minute };
    } else if (format === '24hour') {
      return { hour: parseInt(match[1]), minute: parseInt(match[2]) };
    } else if (format === '12hour_simple') {
      let hour = parseInt(match[1]);
      const period = match[2].toLowerCase();
      
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      
      return { hour, minute: 0 };
    } else if (format === 'word') {
      const timeMap = {
        'morning': { hour: 9, minute: 0 },
        'afternoon': { hour: 14, minute: 0 },
        'evening': { hour: 18, minute: 0 },
        'night': { hour: 20, minute: 0 }
      };
      return timeMap[match[1].toLowerCase()] || { hour: 9, minute: 0 };
    }
    return null;
  };

  // Enhanced task creation with new features
  const createTaskFromParsedData = (parsedTask) => {
    if (!parsedTask.text || parsedTask.text === 'Task from conversation') {
      return null;
    }

    // Get optimal time if none specified
    if (!parsedTask.time) {
      const optimalTime = getOptimalTimeSlot(parsedTask.category, parsedTask.priority);
      parsedTask.time = parseTime([optimalTime], 'word');
    }

    const task = {
      id: Date.now(),
      text: parsedTask.text,
      category: parsedTask.category,
      priority: parsedTask.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recurring: parsedTask.recurring,
      time: parsedTask.time
    };

    // Format date for storage
    if (parsedTask.date) {
      const dateStr = parsedTask.date.toISOString().split('T')[0];
      
      // Check for conflicts
      const conflictCheck = detectConflicts(parsedTask.date, parsedTask.time);
      if (conflictCheck && conflictCheck.hasConflict) {
        return { task, dateStr, conflict: conflictCheck };
      }
      
      // Get existing tasks for this date
      const existingTasks = JSON.parse(localStorage.getItem('jarvisTasks')) || {};
      const dayTasks = existingTasks[dateStr] || [];
      
      // Add new task
      dayTasks.push(task);
      existingTasks[dateStr] = dayTasks;
      
      // Save to localStorage
      localStorage.setItem('jarvisTasks', JSON.stringify(existingTasks));
      
      // Update productivity data
      updateProductivityData(parsedTask.time, task);
      
      return { task, dateStr };
    }

    return null;
  };

  // Update productivity data based on task completion
  const updateProductivityData = (time, task) => {
    const productivityData = JSON.parse(localStorage.getItem('jarvisProductivityData')) || {};
    const timeSlot = getTimeSlot(time.hour);
    
    if (productivityData[timeSlot]) {
      productivityData[timeSlot].tasks.push({
        id: task.id,
        category: task.category,
        priority: task.priority,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 tasks for analysis
      if (productivityData[timeSlot].tasks.length > 50) {
        productivityData[timeSlot].tasks = productivityData[timeSlot].tasks.slice(-50);
      }
      
      localStorage.setItem('jarvisProductivityData', JSON.stringify(productivityData));
    }
  };

  const getTimeSlot = (hour) => {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  // Helper function to add messages
  const addMessage = (type, content) => {
    const message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  // Handle user input with enhanced features
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const submittedText = inputValue;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: submittedText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const parsedTask = parseTaskFromText(submittedText);
      const createdTask = createTaskFromParsedData(parsedTask);

      let botResponse = '';

      if (createdTask) {
        const { task, dateStr, conflict } = createdTask;
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });

        const timeStr = task.time ? ` at ${task.time.hour}:${task.time.minute.toString().padStart(2, '0')}` : '';
        
        botResponse = `✅ Task created successfully!\n\n📝 **${task.text}**\n📅 **Date:** ${formattedDate}${timeStr}\n🏷️ **Category:** ${task.category}\n🚨 **Priority:** ${task.priority}${task.recurring ? `\n🔄 **Recurring:** ${task.recurring}` : ''}`;

        // Add conflict warning if applicable
        if (conflict) {
          botResponse += `\n\n${conflict.message}`;
        }

        // Add smart suggestions
        const suggestions = getSmartSuggestions(inputValue);
        if (suggestions.length > 0) {
          botResponse += `\n\n${suggestions.join('\n')}`;
        }

        botResponse += `\n\nI've added this to your calendar. You can view and manage it by clicking the calendar icon above.`;

        // Send notification
        if (window.jarvisAddNotification) {
          window.jarvisAddNotification(`New ${task.priority} priority ${task.category} task scheduled for ${formattedDate}`, 'info');
        }
      } else {
        botResponse = `I couldn't understand how to schedule that task. Try being more specific, for example:\n\n• "Schedule a meeting tomorrow at 2 PM"\n• "Remind me to buy groceries on Friday"\n• "Set a high priority task to finish the report by end of week"\n• "Create a daily reminder to exercise at 6 AM"\n\n🎤 **Voice Commands:** Click the microphone to speak naturally\n📧 **Email Integration:** I can parse emails into tasks\n🧠 **Smart Suggestions:** I learn your patterns\n⚠️ **Conflict Detection:** I'll warn about scheduling conflicts\n⏰ **Optimal Scheduling:** I'll suggest the best times based on your productivity`;
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  // Handle special commands
  const handleSpecialCommands = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('show tasks') || lowerInput.includes('view calendar')) {
      // Trigger calendar open
      if (window.jarvisOpenCalendar) {
        window.jarvisOpenCalendar();
      }
      return "Opening your calendar to view all tasks...";
    }
    
    if (lowerInput.includes('clear all') || lowerInput.includes('delete all tasks')) {
      // Use window.confirm instead of global confirm to avoid ESLint error
      if (window.confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
        localStorage.removeItem('jarvisTasks');
        return "All tasks have been cleared from your calendar.";
      }
      return "Task deletion cancelled.";
    }

    if (lowerInput.includes('email') || lowerInput.includes('parse email')) {
      return "📧 **Email Integration:** I can parse emails into tasks! Just paste the email content and I'll extract the important information.\n\nTry: 'Parse this email: Subject: Team Meeting Tomorrow at 2 PM'";
    }

    if (lowerInput.includes('productivity') || lowerInput.includes('optimal time')) {
      const productivityData = JSON.parse(localStorage.getItem('jarvisProductivityData')) || {};
      const timeSlots = Object.entries(productivityData);
      
      // Sort by productivity score
      timeSlots.sort((a, b) => b[1].productivity - a[1].productivity);
      
      return `⏰ **Your Productivity Patterns:**\n\n${timeSlots.map(([time, data]) => 
        `${time.charAt(0).toUpperCase() + time.slice(1)}: ${Math.round(data.productivity * 100)}% productivity (${data.tasks.length} tasks)`
      ).join('\n')}\n\nI'll automatically schedule tasks at your most productive times!`;
    }
    
    return null;
  };

  return (
    <div className="jarvis-chatbot">
      <div className="jarvis-chatbot-header">
        JARVIS
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UnifiedFeaturesDemo />
          <JarvisNotificationCalendar />
          <NotificationBell />
        </div>
      </div>
      
      <div className="jarvis-chatbot-messages">
        {messages.map(message => (
          <div key={message.id} className={`jarvis-chatbot-message ${message.type}`}>
            <div className="message-content">
              {message.content.split('\n').map((line, index) => (
                <div key={index}>
                  {line.startsWith('📝 **') ? (
                    <span style={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('📅 **') ? (
                    <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('🏷️ **') ? (
                    <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('🚨 **') ? (
                    <span style={{ color: '#ff4444', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('🔄 **') ? (
                    <span style={{ color: '#8844ff', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('🎤 **') ? (
                    <span style={{ color: '#ff44aa', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('📧 **') ? (
                    <span style={{ color: '#44aaff', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('🧠 **') ? (
                    <span style={{ color: '#8844ff', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('⚠️ **') ? (
                    <span style={{ color: '#ff8800', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('⏰ **') ? (
                    <span style={{ color: '#44ff88', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : line.startsWith('💡 **') ? (
                    <span style={{ color: '#ffaa44', fontWeight: 'bold' }}>
                      {line.replace(/\*\*/g, '')}
                    </span>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="jarvis-chatbot-message bot">
            <div className="typing-indicator">
              <span>JARVIS is processing</span>
              <span className="dots">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="jarvis-chatbot-input chatgpt-composer">
        <div className="composer">
          <button
            type="button"
            className="icon-btn attach-btn"
            title="Attach files"
            aria-label="Attach files"
            onClick={handleAttachClick}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M16.5 6.5L8.5 14.5C7.12 15.88 7.12 18.12 8.5 19.5C9.88 20.88 12.12 20.88 13.5 19.5L20 13C21.93 11.07 21.93 7.93 20 6C18.07 4.07 14.93 4.07 13 6L6 13C4.62 14.38 4.62 16.62 6 18C7.38 19.38 9.62 19.38 11 18L18 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <textarea
            ref={textareaRef}
            className="composer-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message JARVIS…"
            disabled={isProcessing}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button 
            type="button"
            className={`icon-btn voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoiceRecognition}
            title={isListening ? 'Stop voice input' : 'Start voice input'}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            aria-pressed={isListening}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 14C13.657 14 15 12.657 15 11V6C15 4.343 13.657 3 12 3C10.343 3 9 4.343 9 6V11C9 12.657 10.343 14 12 14Z" stroke="currentColor" stroke-width="1.6"/>
              <path d="M19 11C19 14.866 15.866 18 12 18C8.134 18 5 14.866 5 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              <path d="M12 18V21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
          <button type="submit" className="send-btn" disabled={isProcessing || !inputValue.trim()} aria-label="Send message">
            <svg className="send-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 12L20 4L13 20L11 13L4 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            accept="image/*,.pdf"
            onChange={handleFilesSelected}
          />
        </div>
      </form>
    </div>
  );
};

export default Chatbot;