import React, { useState } from 'react';
import './InteractiveDemo.css';

function InteractiveDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: '🎤',
      title: 'Voice Commands',
      description: 'Speak naturally to JARVIS',
      tip: 'Click the microphone button and say "Schedule a meeting tomorrow at 2 PM"'
    },
    {
      icon: '📧',
      title: 'Email Integration',
      description: 'Parse emails into tasks automatically',
      tip: 'Paste email content and JARVIS extracts tasks, priorities, and deadlines'
    },
    {
      icon: '🧠',
      title: 'Smart Suggestions',
      description: 'Learns your patterns and habits',
      tip: 'JARVIS will suggest optimal scheduling based on your productivity data'
    },
    {
      icon: '⚠️',
      title: 'Conflict Detection',
      description: 'Prevents double-booking',
      tip: 'Automatically warns about scheduling conflicts with 2-hour buffer zones'
    },
    {
      icon: '⏰',
      title: 'Optimal Scheduling',
      description: 'AI-powered time recommendations',
      tip: 'High-priority tasks get your most productive time slots automatically'
    },
    {
      icon: '📊',
      title: 'Productivity Analytics',
      description: 'Track your effectiveness patterns',
      tip: 'Ask "Show my productivity patterns" to see when you\'re most effective'
    },
    {
      icon: '🔄',
      title: 'Recurring Tasks',
      description: 'Set up automatic repetition',
      tip: 'Say "Create a daily reminder to exercise" for automatic recurring tasks'
    },
    {
      icon: '🏷️',
      title: 'Smart Categorization',
      description: 'Automatic task organization',
      tip: 'JARVIS automatically categorizes tasks based on keywords and context'
    }
  ];

  const proTips = [
    '💡 **Pro Tip:** Use voice commands for hands-free task creation while driving or cooking',
    '💡 **Pro Tip:** JARVIS learns from every interaction - the more you use it, the smarter it gets',
    '💡 **Pro Tip:** Ask "Show my productivity patterns" to optimize your daily schedule',
    '💡 **Pro Tip:** Use natural language like "Remind me to buy groceries when I\'m near the store"',
    '💡 **Pro Tip:** JARVIS can parse complex requests like "Schedule a team meeting every Monday at 9 AM for the next month"'
  ];

  return (
    <div className="interactive-demo">
      <button 
        className="demo-toggle-btn"
        onClick={() => setShowDemo(!showDemo)}
        title="See Interactive Features"
      >
        🎯 Features
      </button>

      {showDemo && (
        <div className="demo-panel">
          <div className="demo-header">
            <h3>🎯 JARVIS Interactive Features</h3>
            <button 
              className="close-demo-btn"
              onClick={() => setShowDemo(false)}
            >
              ×
            </button>
          </div>
          
          <div className="demo-intro">
            <p>Discover all the powerful features that make JARVIS your intelligent AI assistant!</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                  <div className="feature-tip">{feature.tip}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="demo-tips">
            <h4>🚀 Pro Tips for Power Users:</h4>
            {proTips.map((tip, index) => (
              <div key={index} className="tip-item">
                {tip}
              </div>
            ))}
          </div>

          <div className="demo-footer">
            <p>🎉 <strong>Try these features now!</strong> Start with voice commands or natural language input.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveDemo;
