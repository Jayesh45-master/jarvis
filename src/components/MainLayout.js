import React, { useState } from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import Clock from "./Clock";
import Chatbot from "./Chatbot";
import NotificationSystem from "./NotificationSystem";
import "./MainLayout.css";

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Handle tab changes and update the UI accordingly
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // You can add additional logic here for tab-specific actions
    console.log(`Switched to ${newTab} tab`);
  };

  return (
    <div className="jarvis-main-bg">
      <div className="jarvis-main-layout">
        <div className="jarvis-slider-section">
          <Slider activeTab={activeTab} />
        </div>
        <div className="jarvis-center-section">
          <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
          <Clock activeTab={activeTab} />
        </div>
        <div className="jarvis-chatbot-section">
          <Chatbot />
        </div>
        <NotificationSystem />
      </div>
    </div>
  );
};

export default MainLayout;
