import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, LogIn, UserPlus, Paperclip, Send, Mic, ClipboardCheck } from "lucide-react";


const JarvisChatbot = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "JARVIS", text: "Arriving newly! How can I assist you today?" },
  ]);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
   const [copiedIndex, setCopiedIndex] = useState(null);


  const mockChats = [
    { id: 1, title: "Quantum Core Status" },
    { id: 2, title: "Plasma Shield Calibration" },
    { id: 3, title: "Hyperdrive Diagnostics" },
    { id: 4, title: "Neural Network Uplink" },
    { id: 5, title: "Energy Matrix Report" },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

 const handleSendMessage = async () => {
  if (!message.trim()) return;

  // Add user message to chat
  const userMsg = { sender: "User", text: message };
  setChatMessages((prev) => [...prev, userMsg]);
  setMessage("");
  setIsTyping(true);

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    // Handle empty or invalid response
    if (!data?.reply) {
      throw new Error("Empty response from server");
    }

    let reply = data.reply;

    // Start with empty JARVIS message for typing effect
    setChatMessages((prev) => [...prev, { sender: "JARVIS", text: "" }]);

    // Typing animation
    let currentText = "";
    for (let i = 0; i < reply.length; i++) {
      currentText += reply[i];
      await new Promise((resolve) => setTimeout(resolve, 15));
      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          sender: "JARVIS", 
          text: currentText 
        };
        return updated;
      });
    }

  } catch (err) {
    console.error("Chat error:", err);
    setChatMessages((prev) => [
      ...prev,
      { 
        sender: "JARVIS", 
        text: "I'm having trouble connecting to my knowledge base. Please try again later." 
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileAttach = () => {
    alert("File attachment functionality coming soon!");
  };

  const handleLogin = () => {
    alert("Login successful!");
    setIsLoginPopupOpen(false);
  };

  const handleSignup = () => {
    alert("Sign up successful!");
    setIsSignupPopupOpen(false);
  };
   const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  


  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(circle at center, #003087, #000000)",
      fontFamily: "Orbitron, sans-serif",
      color: "#00b7eb",
      overflow: "hidden",
    }}>

      {/* Sidebar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isSidebarOpen ? 0 : "-300px",
          width: "260px",
          height: "100%",
          background: "#0a0f1c",
          color: "#00b7eb",
          padding: "20px",
          boxShadow: "2px 0 10px #00b7eb",
          transition: "left 0.3s ease-in-out",
          zIndex: 5,
          fontFamily: "Orbitron, sans-serif",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ marginBottom: "10px", marginTop: "60px" }}>J.A.R.V.I.S Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: "none", border: "none", color: "#00b7eb", cursor: "pointer" }}>
            <X />
          </button>
        </div>
        <button style={{ marginBottom: "15px", padding: "8px", background: "#00b7eb", color: "black", borderRadius: "8px", border: "none", width: "100%" }}>
          + New Chat
        </button>
        <input
          type="text"
          placeholder="Search chats..."
          style={{ marginBottom: "20px", width: "100%", padding: "8px", background: "#121a2e", color: "white", border: "none", borderRadius: "6px" }}
        />
        <div>
          <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#00b7eb" }}>Chats</h3>
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              style={{ padding: "10px", background: "#131c31", borderRadius: "6px", marginBottom: "10px", cursor: "pointer", border: "1px solid transparent" }}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Menu Button */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "transparent",
          border: "2px solid #00b7eb",
          color: "#00b7eb",
          padding: "10px 12px",
          fontSize: "16px",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 10,
          fontFamily: "Orbitron, sans-serif",
          boxShadow: "0 0 10px #00b7eb",
        }}
      >
        ☰
      </button>


      {/* Added Go to Voice Assistant Button */}
      <button
        onClick={() => navigate("/")} // Navigates to root (hologramOrb)
        style={{
          position: "absolute",
          top: "20px",
          right: "140px", // Positioned between signup and login buttons
          background: "rgba(0, 183, 235, 0.1)",
          border: "2px solid #00b7eb",
          borderRadius: "50%",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0 0 15px #00b7eb",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 0 25px #00b7eb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 15px #00b7eb";
        }}
      >
        <Mic size={24} color="#00b7eb" style={{ filter: "drop-shadow(0 0 5px #00b7eb)" }} />
      </button>

      {/* Futuristic Sign Up Logo */}
      <button
        onClick={() => setIsSignupPopupOpen(true)}
        style={{
          position: "absolute",
          top: "20px",
          right: "80px",
          background: "rgba(0, 183, 235, 0.1)",
          border: "2px solid #00b7eb",
          borderRadius: "50%",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0 0 15px #00b7eb",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 0 25px #00b7eb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 15px #00b7eb";
        }}
      >
        <UserPlus size={24} color="#00b7eb" style={{ filter: "drop-shadow(0 0 5px #00b7eb)" }} />
      </button>

      {/* Futuristic Login Logo */}
      <button
        onClick={() => setIsLoginPopupOpen(true)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(0, 183, 235, 0.1)",
          border: "2px solid #00b7eb",
          borderRadius: "50%",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0 0 15px #00b7eb",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 0 25px #00b7eb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 15px #00b7eb";
        }}
      >
        <LogIn size={24} color="#00b7eb" style={{ filter: "drop-shadow(0 0 5px #00b7eb)" }} />
      </button>

      {/* Chatbox */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "800px",
          height: "70%",
          background: "#0a0f1c",
          border: "2px solid #00b7eb",
          borderRadius: "12px",
          boxShadow: "0 0 30px #00b7eb",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        {/* Chat Messages */}
        <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {chatMessages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.sender === "User" ? "flex-end" : "flex-start",
            maxWidth: "70%",
            padding: "10px 15px",
            background: msg.sender === "User" ? "#00b7eb" : "#121a2e",
            color: msg.sender === "User" ? "black" : "#00b7eb",
            borderRadius: "8px",
            border: "1px solid #00b7eb",
            boxShadow: "0 0 10px rgba(0, 183, 235, 0.5)",
            position: "relative",
          }}>
            <strong>{msg.sender}: </strong> {msg.text}
            {msg.sender === "JARVIS" && (
              <div style={{ marginTop: "5px", display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => handleCopy(msg.text, index)}
                  style={{
                    fontSize: "12px",
                    background: "none",
                    color: "#00b7eb",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <ClipboardCheck size={16} /> {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ color: "#00b7eb", fontStyle: "italic" }}>JARVIS is thinking...</div>
        )}
      </div>





        {/* Input Area */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0" }}>
          <button
            onClick={handleFileAttach}
            style={{
              background: "none",
              border: "none",
              color: "#00b7eb",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "50%",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 0 10px #00b7eb",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
            }}
          >
            <Paperclip size={24} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              background: "#121a2e",
              color: "white",
              border: "1px solid #00b7eb",
              borderRadius: "6px",
              fontFamily: "Orbitron, sans-serif",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              background: "#00b7eb",
              border: "none",
              color: "black",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 0 10px #00b7eb",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
            }}
          >
            <Send size={24} />
          </button>
        </div>
      </div>

      {/* Sign Up Popup */}
      {isSignupPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              background: "#0a0f1c",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              border: "2px solid #00b7eb",
              boxShadow: "0 0 30px #00b7eb",
              fontFamily: "Orbitron, sans-serif",
              color: "#00b7eb",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsSignupPopupOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                color: "#00b7eb",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>J.A.R.V.I.S Sign Up</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#121a2e",
                  color: "white",
                  border: "1px solid #00b7eb",
                  borderRadius: "6px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#121a2e",
                  color: "white",
                  border: "1px solid #00b7eb",
                  borderRadius: "6px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#121a2e",
                  color: "white",
                  border: "1px solid #00b7eb",
                  borderRadius: "6px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              />
            </div>
            <button
              onClick={handleSignup}
              style={{
                width: "100%",
                padding: "10px",
                background: "#00b7eb",
                color: "black",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 0 15px #00b7eb",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {isLoginPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              background: "#0a0f1c",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              border: "2px solid #00b7eb",
              boxShadow: "0 0 30px #00b7eb",
              fontFamily: "Orbitron, sans-serif",
              color: "#00b7eb",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsLoginPopupOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                color: "#00b7eb",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>J.A.R.V.I.S Login</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#121a2e",
                  color: "white",
                  border: "1px solid #00b7eb",
                  borderRadius: "6px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#121a2e",
                  color: "white",
                  border: "1px solid #00b7eb",
                  borderRadius: "6px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              />
            </div>
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "10px",
                background: "#00b7eb",
                color: "black",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 0 15px #00b7eb",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
    };

export default JarvisChatbot;
