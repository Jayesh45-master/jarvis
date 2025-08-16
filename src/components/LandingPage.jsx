import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, LogIn, UserPlus, Globe, Square, Phone } from "lucide-react";

const features = [
  {
    title: "Voice-Controlled Commands",
    description: "Control your assistant with simple voice commands. Activate features, manage devices, or get updates hands-free.",
  },
  {
    title: "IoT Device Management",
    description: "Seamlessly connect and manage your IoT devices. Turn on lights, adjust thermostats, or monitor security systems with ease.",
  },
  {
    title: "Task Scheduling",
    description: "Organize your day with intelligent task scheduling. Set reminders, create to-dos, and get notifications to stay on track.",
    path: "/MainLayout", 
  },
  {
    title: "Personal Assistant Intelligence",
    description: "Get personalized assistance with AI-driven insights. From daily briefings to custom recommendations, your assistant adapts to you.",
  },
  {
    title: "Custom Voice Feedback",
    description: "Hear responses in a voice that suits you. Customize the tone, accent, and style of your assistant’s voice feedback.",
  },
  {
    title: "Real-time Chat with J.A.R.V.I.S",
    description: "Engage in real-time conversations with J.A.R.V.I.S. Ask questions, get instant answers, and enjoy a seamless chat experience.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputRefs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Login success
      alert(data.message || "Login successful!"); // Use server message
      localStorage.setItem("token", data.token);
      
      // Optional: Store user data if returned
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      setIsLoginPopupOpen(false);
      
      // Optional: Refresh or redirect
      window.location.reload(); // Or use react-router navigation
    } else {
      // Login failed (server returned error)
      const errorMessage = data.message || "Invalid username or password";
      alert(`Login failed: ${errorMessage}`);
      
      // Optional: Clear password field for security
      setLoginPassword("");
    }
  } catch (err) {
    console.error("Login error:", err);
    
    // Differentiate between network errors and other errors
    if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
      alert("Network error - please check your connection");
    } else {
      alert("Login request failed. Please try again later.");
    }
  }
};


  const handleGoogleLogin = () => {
    alert("Logged in with Google as user@example.com");
    setIsLoginPopupOpen(false);
  };

  const handleMicrosoftLogin = () => {
    alert("Logged in with Microsoft as user@outlook.com");
    setIsLoginPopupOpen(false);
  };

  const handlePhoneLogin = () => {
    setIsLoginPopupOpen(false);
    setIsPhonePopupOpen(true);
  };

  const handlePhoneVerify = () => {
    setIsPhonePopupOpen(false);
    setIsOtpPopupOpen(true);
    setOtpTimer(60);
  };

  const handleOtpVerify = () => {
    alert("Phone number verified successfully!");
    setIsOtpPopupOpen(false);
  };

  const handleResendOtp = () => {
    alert("OTP resent successfully!");
    setOtpTimer(60);
  };

  const handleSignup = async () => {
  try {
    const res = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "yourUsername",
        email: "your@email.com",
        password: "yourPassword",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful!");
      setOtpTimer(60);
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Error during signup");
  }
};


  React.useEffect(() => {
    let timer;
    if (isOtpPopupOpen && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpPopupOpen, otpTimer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current.focus();
    }
  };

  return (
    <div
      style={{
        fontFamily: "Orbitron, sans-serif",
        color: "#ffffff",
        backgroundColor: "#000000",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #222",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h1 style={{ fontSize: "24px", color: "#00b7eb" }}>J.A.R.V.I.S</h1>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/hologramOrb")}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
            }}
          >
            Launch Assistant
          </button>
          <button
            onClick={() => navigate("/chatbot")}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
            }}
          >
            Open Chatbot
          </button>
          <button
            onClick={() => setIsLoginPopupOpen(true)}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignupPopupOpen(true)}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 20px",
          textAlign: "center",
          background: "radial-gradient(circle at center, #003087, #000000)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(36px, 5vw, 48px)",
            marginBottom: "20px",
            color: "#ffffff",
            textShadow: "0 0 10px #00b7eb",
          }}
        >
          Your AI Assistant, Reimagined
        </h2>
        <p
          style={{
            maxWidth: "600px",
            margin: "0 auto 40px",
            fontSize: "clamp(16px, 2vw, 18px)",
            color: "#cccccc",
          }}
        >
          J.A.R.V.I.S is your all-in-one intelligent system. Speak, command, automate.
        </p>
        <button
          onClick={() => navigate("/hologramOrb")}
          style={{ ...buttonStyle, padding: "14px 30px", fontSize: "clamp(16px, 2vw, 18px)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
          }}
        >
          Get Started
        </button>
      </section>

      <section
      style={{
        padding: "60px 20px",
        background: "linear-gradient(180deg, #000000, #001a3d)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "clamp(28px, 4vw, 36px)",
          color: " #00b7eb",
          marginBottom: "40px",
          textShadow: "0 0 10px #00b7eb",
        }}
      >
        Explore J.A.R.V.I.S Features
      </h2>
      {features.map((feature, index) => {
        const isImageOnLeft = index % 2 === 0;
        const imagePath = `/images/${feature.title
          .toLowerCase()
          .replace(/ /g, "-")}.jpg`;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: isImageOnLeft ? "row" : "row-reverse",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              marginBottom: "60px",
              padding: "20px",
              background: "rgba(17, 17, 17, 0.8)",
              border: "1px solid #00b7eb",
              borderRadius: "12px",
              boxShadow: "0 0 15px rgba(0, 183, 235, 0.3)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              flexWrap: "wrap",
              cursor: feature.title === "Task Scheduling" ? "pointer" : "default", // 👈 make only Task Scheduling clickable
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(0, 183, 235, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 15px rgba(0, 183, 235, 0.3)";
            }}
            onClick={() => {
              if (feature.title === "Task Scheduling") {
                navigate("/MainLayout"); // 👈 redirect only when it's Task Scheduling
              }
            }}
          >
            <img
              src={imagePath}
              alt={feature.title}
              style={{
                width: "300px",
                height: "200px",
                border: "2px solid #00b7eb",
                borderRadius: "10px",
                objectFit: "cover",
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.src = "/images/fallback.jpg";
                e.currentTarget.alt = "Feature image";
              }}
            />
            <div
              style={{
                maxWidth: "500px",
                color: "#ffffff",
                textAlign: isImageOnLeft ? "left" : "right",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  color: "#00b7eb",
                  marginBottom: "15px",
                  textShadow: "0 0 5px #00b7eb",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#cccccc",
                  lineHeight: "1.5",
                }}
              >
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>

      {/* Footer */}
      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#555",
          borderTop: "1px solid #111",
        }}
      >
        Made by Jayesh ⚡ Powered by AI
      </footer>

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
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>
              J.A.R.V.I.S Login
            </h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value ={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
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
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
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
              onClick={() => {
                handleLogin();
              }}
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "20px 0",
                color: "#00b7eb",
                fontSize: "14px",
              }}
            >
              <div
                style={{ flex: 1, height: "1px", background: "#00b7eb", opacity: 0.5 }}
              ></div>
              <span style={{ margin: "0 10px" }}>OR</span>
              <div
                style={{ flex: 1, height: "1px", background: "#00b7eb", opacity: 0.5 }}
              ></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(0, 183, 235, 0.1)",
                color: "#00b7eb",
                border: "1px solid #00b7eb",
                borderRadius: "8px",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 0 10px #00b7eb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
              }}
            >
              <Globe size={20} style={{ marginRight: "10px" }} />
              Continue with Google
            </button>

            <button
              onClick={handleMicrosoftLogin}
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(0, 183, 235, 0.1)",
                color: "#00b7eb",
                border: "1px solid #00b7eb",
                borderRadius: "8px",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 0 10px #00b7eb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
              }}
            >
              <Square size={20} style={{ marginRight: "10px" }} />
              Continue with Microsoft
            </button>

            <button
              onClick={handlePhoneLogin}
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(0, 183, 235, 0.1)",
                color: "#00b7eb",
                border: "1px solid #00b7eb",
                borderRadius: "8px",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 0 10px #00b7eb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 20px #00b7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 10px #00b7eb";
              }}
            >
              <Phone size={20} style={{ marginRight: "10px" }} />
              Continue with Phone Number
            </button>
          </div>
        </div>
      )}

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
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>
              J.A.R.V.I.S Sign Up
            </h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                Username
              </label>
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
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                Email
              </label>
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
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                Password
              </label>
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

      {/* Phone Number Popup */}
      {isPhonePopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "0",
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
              onClick={() => setIsPhonePopupOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                color: " #00b7eb",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>
              Enter Phone Number
            </h3>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              <select
                style={{
                  width: "100px",
                  padding: "10px",
                  background: "#121a2e",
                  color: "white",
                  border: "1px solid #00b7eb",
                  borderRadius: "6px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              >
                <option value="+91">India (+91)</option>
                <option value="+1">USA (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+81">Japan (+81)</option>
                <option value="+86">China (+86)</option>
              </select>
              <input
                type="tel"
                placeholder="Enter phone number"
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
            </div>
            <button
              onClick={handlePhoneVerify}
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
              Verify
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Popup */}
      {isOtpPopupOpen && (
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
              onClick={() => setIsOtpPopupOpen(false)}
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
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>
              OTP Verification
            </h3>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={otpInputRefs[index]}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    background: "#121a2e",
                    color: "white",
                    border: "1px solid #00b7eb",
                    borderRadius: "6px",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "18px",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={handleResendOtp}
                disabled={otpTimer > 0}
                style={{
                  background: "none",
                  border: "none",
                  color: otpTimer > 0 ? "#005f73" : "#00b7eb",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "14px",
                  cursor: otpTimer > 0 ? "not-allowed" : "pointer",
                  textDecoration: "underline",
                }}
              >
                Resend OTP
              </button>
              <span style={{ fontSize: "14px" }}>
                {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Timer expired"}
              </span>
            </div>
            <button
              onClick={handleOtpVerify}
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
              Verify OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#00b7eb",
  color: "#000",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 0 10px #00b7eb",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

export default LandingPage;