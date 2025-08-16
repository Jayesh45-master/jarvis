import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HologramOrb from "./components/hologramOrb";
import JarvisChatbot from "./components/jarvischatbot"; // Make sure the filename matches!
import { enhanceVoiceAnimation as EnhancedJarvisCore } from "./components/hologramOrb";
import MainLayout from "./components/MainLayout";
import { TaskProvider } from "./context/TaskContext"; // ✅ Context provider

function App() {
  EnhancedJarvisCore();

  return (
    <TaskProvider>
      <Router>
        <Routes>
          {/* 🏠 Default landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* 💠 J.A.R.V.I.S UI */}
          <Route path="/hologramOrb" element={<HologramOrb />} />

          {/* 💬 Chatbot */}
          <Route path="/jarvischatbot" element={<JarvisChatbot />} />

          {/* 📂 Main layout (with tasks etc.) */}
          <Route path="/MainLayout" element={<MainLayout />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
