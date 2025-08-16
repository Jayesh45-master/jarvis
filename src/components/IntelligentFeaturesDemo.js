import React, { useState } from 'react';
import './IntelligentFeaturesDemo.css';

function IntelligentFeaturesDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const examples = [
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

  return (
    <div className="intelligent-features-demo">
      <button 
        className="intelligent-demo-btn"
        onClick={() => setShowDemo(!showDemo)}
        title="See Intelligent Features"
      >
        🧠 AI Features
      </button>

      {showDemo && (
        <div className="intelligent-demo-panel">
          <div className="intelligent-demo-header">
            <h3>🧠 JARVIS Intelligent Features</h3>
            <button 
              className="close-intelligent-demo-btn"
              onClick={() => setShowDemo(false)}
            >
              ×
            </button>
          </div>
          
          <div className="intelligent-features-intro">
            <p>JARVIS now understands natural language and automatically creates tasks from your conversations!</p>
          </div>

          <div className="examples-section">
            <h4>💬 Natural Language Examples:</h4>
            <div className="examples-grid">
              {examples.map((example, index) => (
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
      )}
    </div>
  );
}

export default IntelligentFeaturesDemo;
