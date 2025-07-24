import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HologramOrb from "./components/hologramOrb";
import JarvisChatbot from "./components/jarvischatbot"; // Make sure the filename matches!
import { enhanceVoiceAnimation as EnhancedJarvisCore } from "./components/hologramOrb";
 // Updated import

function App() {
  EnhancedJarvisCore();
  return (
    <Router>
      <Routes>
        {/* 🏠 Default landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* 💠 J.A.R.V.I.S UI */}
        <Route path="/hologramOrb" element={<HologramOrb />} />

        {/* 💬 Chatbot */}
        <Route path="/jarvischatbot" element={<JarvisChatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
