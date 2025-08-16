import React, { useState } from 'react';
import './UnifiedFeaturesDemo.css';

function UnifiedFeaturesDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-pro');

  const tabs = [
    { id: 'ai-pro', label: '🚀 AI Pro', icon: '🚀' },
    { id: 'ai-features', label: '🧠 AI Features', icon: '🧠' },
    { id: 'features', label: '🎯 Features', icon: '🎯' }
  ];

  const aiProFeatures = [
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

  const aiFeaturesExamples = [
    {
      input: "Schedule a meeting with John tomorrow at 2 PM",
      output: "✅ Task created successfully!\n\n📝 **meeting with John**\n📅 **Date:** Tomorrow\n🏷️ **Category:** Work\n🚨 **Priority:** Medium"
    },
    {
      input: "Remind me to buy groceries on Friday",
      output: "✅ Task created successfully!\n\n📝 **buy groceries**\n📅 **Date:** Friday\n🏷️ **Category:** Shopping\n🚨 **Priority:** Medium"
    },
    {
      input: "Set a high priority task to finish the report by end of week",
      output: "✅ Task created successfully!\n\n📝 **finish the report**\n📅 **Date:** Next week\n🏷️ **Category:** Work\n🚨 **Priority:** High"
    },
    {
      input: "Create a daily reminder to exercise at 6 AM",
      output: "✅ Task created successfully!\n\n📝 **exercise**\n📅 **Date:** Today\n🏷️ **Category:** Health\n🚨 **Priority:** Medium\n🔄 **Recurring:** daily"
    }
  ];

  const interactiveFeatures = [
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-pro':
        return (
          <div className="tab-content">
            <div className="tab-intro">
              <p>JARVIS is now powered by advanced AI that understands context, learns your patterns, and makes intelligent decisions!</p>
            </div>
            
            <div className="features-showcase">
              <h4>🌟 Revolutionary AI Capabilities:</h4>
              <div className="features-grid">
                {aiProFeatures.map((feature, index) => (
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
          </div>
        );

      case 'ai-features':
        return (
          <div className="tab-content">
            <div className="tab-intro">
              <p>JARVIS now understands natural language and automatically creates tasks from your conversations!</p>
            </div>

            <div className="examples-section">
              <h4>💬 Natural Language Examples:</h4>
              <div className="examples-grid">
                {aiFeaturesExamples.map((example, index) => (
                  <div key={index} className="example-card">
                    <div className="example-input">
                      <strong>You say:</strong>
                      <div className="example-text">{example.input}</div>
                    </div>
                    <div className="example-output">
                      <strong>JARVIS creates:</strong>
                      <div className="example-text">{example.output}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="intelligent-features-list">
              <h4>🚀 What JARVIS Understands:</h4>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">📅</span>
                  <div className="feature-details">
                    <strong>Dates & Times</strong>
                    <p>today, tomorrow, Friday, next week, 2 PM, morning, evening</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏷️</span>
                  <div className="feature-details">
                    <strong>Categories</strong>
                    <p>meetings, exercise, shopping, study, personal tasks</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🚨</span>
                  <div className="feature-details">
                    <strong>Priorities</strong>
                    <p>urgent, high priority, low priority, ASAP</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <div className="feature-details">
                    <strong>Recurring</strong>
                    <p>daily, weekly, every Monday, monthly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="intelligent-tips">
              <h4>💡 How to Use:</h4>
              <ul>
                <li>Just talk to JARVIS naturally in the chat</li>
                <li>Include dates, times, and priorities in your message</li>
                <li>JARVIS will automatically categorize and schedule tasks</li>
                <li>All tasks are saved to your calendar automatically</li>
                <li>Get notifications when tasks are created</li>
              </ul>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="tab-content">
            <div className="tab-intro">
              <p>Discover all the powerful features that make JARVIS your intelligent AI assistant!</p>
            </div>

            <div className="features-grid">
              {interactiveFeatures.map((feature, index) => (
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
              <div className="tips-list">
                <div className="tip-item">💡 **Pro Tip:** Use voice commands for hands-free task creation while driving or cooking</div>
                <div className="tip-item">💡 **Pro Tip:** JARVIS learns from every interaction - the more you use it, the smarter it gets</div>
                <div className="tip-item">💡 **Pro Tip:** Ask "Show my productivity patterns" to optimize your daily schedule</div>
                <div className="tip-item">💡 **Pro Tip:** Use natural language like "Remind me to buy groceries when I'm near the store"</div>
                <div className="tip-item">💡 **Pro Tip:** JARVIS can parse complex requests like "Schedule a team meeting every Monday at 9 AM for the next month"</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="unified-features-demo">
      <button 
        className="unified-demo-btn"
        onClick={() => setShowDemo(!showDemo)}
        title="See All JARVIS Features"
      >
        🚀 Features
      </button>

      {showDemo && (
        <div className="unified-demo-panel">
          <div className="unified-demo-header">
            <h3>🚀 JARVIS Features</h3>
            <button 
              className="close-unified-demo-btn"
              onClick={() => setShowDemo(false)}
            >
              ×
            </button>
          </div>
          
          <div className="tab-navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      )}
    </div>
  );
}

export default UnifiedFeaturesDemo;
