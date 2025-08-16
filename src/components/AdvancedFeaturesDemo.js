import React, { useState } from 'react';
import './AdvancedFeaturesDemo.css';

function AdvancedFeaturesDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: '🎤',
      title: 'Voice Commands',
      description: 'Speak naturally to JARVIS. Click the microphone and say "Schedule a meeting tomorrow at 2 PM"',
      examples: ['"Hey JARVIS, remind me to buy groceries"', '"Create a task to exercise every Monday"']
    },
    {
      icon: '📧',
      title: 'Email Integration',
      description: 'JARVIS can parse emails and automatically create tasks from important information',
      examples: ['"Parse this email: Subject: Team Meeting Tomorrow at 2 PM"', 'Automatic priority detection from email content']
    },
    {
      icon: '🧠',
      title: 'Smart Suggestions',
      description: 'JARVIS learns your patterns and suggests optimal scheduling based on your habits',
      examples: ['"You usually exercise on Mondays"', '"Consider scheduling during your most productive hours"']
    },
    {
      icon: '⚠️',
      title: 'Conflict Detection',
      description: 'Automatically detects scheduling conflicts and warns you before double-booking',
      examples: ['"You have a meeting at 2 PM already"', '2-hour buffer zone to prevent overlapping tasks']
    },
    {
      icon: '⏰',
      title: 'Optimal Scheduling',
      description: 'Analyzes your productivity patterns and suggests the best times for different types of tasks',
      examples: ['"Based on your productivity, schedule this for morning"', 'Work tasks during peak hours, personal tasks during downtime']
    },
    {
      icon: '📊',
      title: 'Productivity Analytics',
      description: 'Track your productivity patterns and get insights into your most effective time slots',
      examples: ['Morning: 90% productivity', 'Evening: 50% productivity', 'Automatic time slot recommendations']
    }
  ];

  const voiceCommands = [
    'Schedule a meeting tomorrow at 2 PM',
    'Remind me to buy groceries on Friday',
    'Create a daily reminder to exercise at 6 AM',
    'Set a high priority task to finish the report',
    'Book a doctor appointment next week'
  ];

  return (
    <div className="advanced-features-demo">
      <button 
        className="advanced-demo-btn"
        onClick={() => setShowDemo(!showDemo)}
        title="See Advanced AI Features"
      >
        🚀 AI Pro
      </button>

      {showDemo && (
        <div className="advanced-demo-panel">
          <div className="advanced-demo-header">
            <h3>🚀 JARVIS Advanced AI Features</h3>
            <button 
              className="close-advanced-demo-btn"
              onClick={() => setShowDemo(false)}
            >
              ×
            </button>
          </div>
          
          <div className="advanced-features-intro">
            <p>JARVIS is now powered by advanced AI that understands context, learns your patterns, and makes intelligent decisions!</p>
          </div>

          <div className="features-showcase">
            <h4>🌟 Revolutionary AI Capabilities:</h4>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">{feature.icon}</span>
                    <h5>{feature.title}</h5>
                  </div>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-examples">
                    <strong>Examples:</strong>
                    <ul>
                      {feature.examples.map((example, idx) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="voice-commands-section">
            <h4>🎤 Voice Command Examples:</h4>
            <div className="voice-commands-grid">
              {voiceCommands.map((command, index) => (
                <div key={index} className="voice-command-card">
                  <span className="voice-icon">🎤</span>
                  <div className="command-text">"{command}"</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-benefits">
            <h4>💡 Why This Makes JARVIS Revolutionary:</h4>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">🤖</span>
                <div className="benefit-content">
                  <strong>Contextual Understanding</strong>
                  <p>JARVIS doesn't just parse text - it understands the context, relationships, and implications of your requests.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📈</span>
                <div className="benefit-content">
                  <strong>Continuous Learning</strong>
                  <p>Every interaction makes JARVIS smarter. It learns your patterns, preferences, and productivity cycles.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎯</span>
                <div className="benefit-content">
                  <strong>Proactive Intelligence</strong>
                  <p>JARVIS doesn't wait for commands - it suggests optimizations, detects conflicts, and recommends improvements.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔮</span>
                <div className="benefit-content">
                  <strong>Predictive Scheduling</strong>
                  <p>Based on your productivity data, JARVIS predicts the best times for different types of tasks.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="usage-tips">
            <h4>🚀 How to Use Advanced Features:</h4>
            <div className="tips-grid">
              <div className="tip-card">
                <h5>🎤 Voice Commands</h5>
                <p>Click the microphone button and speak naturally. JARVIS will understand and create tasks from your voice.</p>
              </div>
              <div className="tip-card">
                <h5>📧 Email Parsing</h5>
                <p>Paste email content and JARVIS will extract tasks, priorities, and deadlines automatically.</p>
              </div>
              <div className="tip-card">
                <h5>🧠 Smart Suggestions</h5>
                <p>Let JARVIS learn your patterns. The more you use it, the smarter it becomes.</p>
              </div>
              <div className="tip-card">
                <h5>⏰ Productivity Insights</h5>
                <p>Ask "Show my productivity patterns" to see when you're most effective.</p>
              </div>
            </div>
          </div>

          <div className="demo-footer">
            <p>🎉 <strong>Welcome to the future of task management!</strong> JARVIS is now your intelligent AI assistant.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFeaturesDemo;
