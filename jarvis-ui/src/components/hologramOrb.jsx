import  { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, LogIn, Globe, Square, Phone, UserPlus, MessageSquare } from "lucide-react";

const JarvisCore = () => {
  const navigate = useNavigate();
  
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const recognitionRef = useRef(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [britishVoice, setBritishVoice] = useState(null);

  const mockChats = [
    { id: 1, title: "Quantum Core Status" },
    { id: 2, title: "Plasma Shield Calibration" },
    { id: 3, title: "Hyperdrive Diagnostics" },
    { id: 4, title: "Neural Network Uplink" },
    { id: 5, title: "Energy Matrix Report" },
  ];

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const particles = [];
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: centerX + Math.random() * 200 - 100,
        y: centerY + Math.random() * 200 - 100,
        baseRadius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
      });
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const drawCore = () => {
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        if (!analyser || !dataArray) return;

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const voiceWave = 40 + volume / 5;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 600);
        gradient.addColorStop(0, "#003087");
        gradient.addColorStop(1, "#000000");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

          const particleScale = 1 + (volume / 255) * 0.5;
          const scaledRadius = p.baseRadius * particleScale;

          ctx.beginPath();
          ctx.arc(p.x, p.y, scaledRadius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 183, 235, 0.6)";
          ctx.fill();
          ctx.closePath();
        });

        ctx.save();
        ctx.translate(centerX, centerY);
        if (!isPaused) rotationCore += 0.01;
        ctx.rotate(rotationCore);
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, voiceWave);
        coreGradient.addColorStop(0, "#00b7eb");
        coreGradient.addColorStop(1, "#005f73");
        ctx.beginPath();
        ctx.arc(0, 0, voiceWave, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.shadowColor = "#00b7eb";
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        const middleRadius = voiceWave + 15;
        if (!isPaused) rotationMiddle += 0.01;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationMiddle);
        ctx.beginPath();
        ctx.arc(0, 0, middleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "#00b7eb";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00b7eb";
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.closePath();

        const numTicks = 40;
        for (let i = 0; i < numTicks; i++) {
          const angle = (i / numTicks) * Math.PI * 2;
          const x1 = Math.cos(angle) * (middleRadius - 4);
          const y1 = Math.sin(angle) * (middleRadius - 4);
          const x2 = Math.cos(angle) * (middleRadius + 4);
          const y2 = Math.sin(angle) * (middleRadius + 4);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "rgba(0, 183, 235, 0.6)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.closePath();
        }
        ctx.restore();

        const bigRadius = middleRadius + 80;
        if (!isPaused) rotationLarge -= 0.01;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationLarge);
        ctx.beginPath();
        const lineWidth = 3 + (volume / 255) * 2;
        ctx.arc(0, 0, bigRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 183, 235, 0.3)";
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = "#00b7eb";
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.closePath();

        const bigTicks = 60;
        for (let i = 0; i < bigTicks; i++) {
          const angle = (i / bigTicks) * Math.PI * 2;
          const x1 = Math.cos(angle) * (bigRadius - 6);
          const y1 = Math.sin(angle) * (bigRadius - 6);
          const x2 = Math.cos(angle) * (bigRadius + 6);
          const y2 = Math.sin(angle) * (bigRadius + 6);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "rgba(0, 183, 235, 0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.closePath();
        }
        ctx.restore();

        const pulseScale = 1 + Math.sin(Date.now() * 0.005) * (volume / 255) * 0.2;
        ctx.font = `bold ${50 * pulseScale}px Orbitron, sans-serif`;
        ctx.fillStyle = "#00b7eb";
        ctx.shadowColor = "#00b7eb";
        ctx.shadowBlur = 40;
        ctx.textAlign = "center";
        ctx.fillText("J.A.R.V.I.S", centerX, 100);

        requestAnimationFrame(drawCore);
      };

      drawCore();
    }).catch((err) => {
      console.error("Microphone access error:", err);
    });

    let rotationCore = 0;
    let rotationMiddle = 0;
    let rotationLarge = 0;

    const handleClick = () => {
      setIsPaused((prev) => !prev);
    };

    canvas.addEventListener("click", handleClick);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  const handleGoogleLogin = () => {
     window.location.href = "http://localhost:5000/auth/google";
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

  const handleSignup = () => {
    alert("Sign up successful!");
    setIsSignupPopupOpen(false);
  };

  // Define speakResponse FIRST before any functions that call it
  const speakResponse = (text) => {
  window.speechSynthesis.cancel(); // Clear any pending speech
  
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.8;
    
    // Force English voice (works in 95% of browsers)
    utterance.lang = 'en-GB';
    
    utterance.onend = resolve;
    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};
  useEffect(() => {
    let timer;
    if (isOtpPopupOpen && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpPopupOpen, otpTimer]);

    // Add this with your other useEffect hooks
  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = [
        'Google UK English Male',  // Chrome
        'Daniel',                 // Safari
        'Microsoft George - English (United Kingdom)',  // Edge
        'English (United Kingdom)' // General fallback
      ];
      
      // Find the best available British voice
      const foundVoice = voices.find(voice => 
        preferredVoices.some(name => voice.name.includes(name)) ||
        voice.lang.includes('en-GB')
      );
      
      setBritishVoice(foundVoice || null);
      setVoicesLoaded(true);
    };

    // Chrome needs this to load voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Initial load
    loadVoices();
  }, []);

  useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognitionRef.current = new SpeechRecognition();
  recognitionRef.current.continuous = false; // Process one command at a time
  recognitionRef.current.interimResults = false; // Only final results
  recognitionRef.current.maxAlternatives = 1; // Single interpretation

  recognitionRef.current.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    processCommand(transcript);
  };

  recognitionRef.current.onerror = (event) => {
    console.error("Recognition error:", event.error);
    setIsListening(false);
  };

  recognitionRef.current.onend = () => {
    if (isListening) {
      // Auto-restart if still in listening mode
      setTimeout(() => recognitionRef.current.start(), 100);
    }
  };

  return () => recognitionRef.current.stop();
}, [isListening]);



    // Add this after your existing useEffect hooks
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setLastCommand(transcript);
        processCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, []);

  useEffect(() => {
  console.log('Available voices:', window.speechSynthesis.getVoices());
}, [voicesLoaded]);

  // Then your useEffect hooks
  useEffect(() => {
    // Voice loading logic
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = [
        'Google UK English Male',
        'Daniel',
        'Microsoft George - English (United Kingdom)',
        'English (United Kingdom)'
      ];
      
      const foundVoice = voices.find(voice => 
        preferredVoices.some(name => voice.name.includes(name)) ||
        voice.lang.includes('en-GB')
      );
      
      setBritishVoice(foundVoice || null);
      setVoicesLoaded(true);
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
  }, [])

 const processCommand = async (command) => {
  const responseMap = {
    hello: "Hello sir, how may I assist you?",
    time: `The time is ${new Date().toLocaleTimeString('en-GB')}`,
    "how are you": "All systems operational, sir",
    "dad's back": "Welcome home, sir. Shall I prepare the house?",
    "open side bar": "Opening sidebar, sir",
    "Jayesh is mad": "Jayesh is always mad, sir. Shall I prepare the emergency protocols?",
    
  };

  const lowerCommand = command.toLowerCase();
  let response = "I didn't quite catch that, sir.";

  for (const [keyword, reply] of Object.entries(responseMap)) {
    if (lowerCommand.includes(keyword)) {
      response = reply;
      break;
    }
  }

  await speakResponse(response);
  if (isListening) recognitionRef.current.start(); // Re-arm the listener
};

  const toggleListening = async () => {
  try {
    if (isListening) {
      await speakResponse("Microphone offline");
      recognitionRef.current.stop();
    } else {
      await speakResponse("Listening...");
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  } catch (error) {
    console.error("Mic toggle error:", error);
    setIsListening(false);
  }
};

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
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>

      <button 
  onClick={() => {
    const testUtterance = new SpeechSynthesisUtterance("Testing voice synthesis");
    window.speechSynthesis.speak(testUtterance);
  }}
  style={{ 
    position: 'absolute',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px',
    background: '#00b7eb',
    color: 'black'
  }}
>
  Test Voice
</button>

      <button
  onClick={toggleListening}
  style={{
    background: isListening ? '#ff3d3d' : '#00b7eb',
    color: '#000',
    border: '2px solid #00b7eb',
    borderRadius: '50%',
    width: '70px',
    height: '70px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: isListening ? '0 0 25px #ff3d3d' : '0 0 25px #00b7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  }}
>
  {isListening ? (
    <div style={{ animation: 'pulse 1.5s infinite' }}>🔴</div>
  ) : (
    '🎤'
  )}
</button>

            {/* Add this right before your canvas element */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
        color: '#00b7eb'
      }}>
        <button
          onClick={toggleListening}
          style={{
            background: isListening ? '#ff0000' : '#00b7eb',
            color: '#000',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 0 15px #00b7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isListening ? '✖' : '🎤'}
        </button>
        <div style={{ marginTop: '10px' }}>
          {lastCommand && <div>Command: {lastCommand}</div>}
          {lastResponse && <div>Response: {lastResponse}</div>}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }} />

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
        <button style={{ marginBottom: "15px", padding: "8px", background: "#00b7eb", color: "black", borderRadius: "8px", border: "none", width: "100%" }}>+ New Chat</button>
        <input type="text" placeholder="Search chats..." style={{ marginBottom: "20px", width: "100%", padding: "8px", background: "#121a2e", color: "white", border: "none", borderRadius: "6px" }} />
        
        {/* Chats Section */}
        <div>
          <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#00b7eb" }}>Chats</h3>
          {mockChats.map(chat => (
            <div key={chat.id} style={{ padding: "10px", background: "#131c31", borderRadius: "6px", marginBottom: "10px", cursor: "pointer", border: "1px solid transparent" }}>
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

      {/* Added Go to Chatbot Button - Placed beside signup/login buttons */}
      <button
        onClick={() => navigate('/jarvischatbot')}
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
        <MessageSquare size={24} color="#00b7eb" style={{ filter: "drop-shadow(0 0 5px #00b7eb)" }} />
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

            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "#00b7eb", fontSize: "14px" }}>
              <div style={{ flex: 1, height: "1px", background: "#00b7eb", opacity: 0.5 }}></div>
              <span style={{ margin: "0 10px" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#00b7eb", opacity: 0.5 }}></div>
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

      {/* Phone Number Popup */}
      {isPhonePopupOpen && (
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
              onClick={() => setIsPhonePopupOpen(false)}
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
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>Enter Phone Number</h3>
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
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>OTP Verification</h3>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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

      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }} />
    </div>
  );
};

export default JarvisCore;
const EnhancedJarvisCore = (props) => {
  const enhanceAnimation = (ctx) => {
    if (ctx) {
      ctx.shadowBlur = 60; // Instant increase shadow for all circles
      ctx.shadowBlur = 40; // Reset core shadow immediately
      ctx.shadowBlur = 15; // Reset middle shadow
      ctx.shadowBlur = 20; // Reset large shadow
    }
  };

  const JarvisCoreWithEnhancement = (props) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const canvasRef = useRef(null);

    // Optimized speakResponse with pre-loaded voice
    const speakResponse = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1; // Slightly faster rate for quicker delivery
      utterance.pitch = 0.8;
      utterance.lang = 'en-GB'; // Force British English
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(voice => voice.lang.includes('en-GB'));
      if (britishVoice) utterance.voice = britishVoice;
      window.speechSynthesis.cancel(); // Clear pending speech
      window.speechSynthesis.speak(utterance); // Speak immediately without promise
    };

    useEffect(() => {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false; // Single listen
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const spokenCommand = event.results[0][0].transcript.toLowerCase();
        const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;
        const responseElement = document.querySelector("div[style*='bottom: 20px'] > div > div:nth-child(2)");
        const lastCommandElement = document.querySelector("div[style*='bottom: 20px'] > div > div:nth-child(1)");

        if (spokenCommand.includes("dad's back")) {
          const response = "Welcome home, sir.";
          speakResponse(response);
          if (ctx) enhanceAnimation(ctx);
          if (responseElement) responseElement.textContent = `Response: ${response}`;
          if (lastCommandElement) lastCommandElement.textContent = `Last Command: ${spokenCommand}`;
        } else {
          const errorResponse = `Try "dad's back".`;
          speakResponse(errorResponse);
          if (responseElement) responseElement.textContent = `Response: ${errorResponse}`;
          if (lastCommandElement) lastCommandElement.textContent = `Last Command: ${spokenCommand}`;
        }
        recognition.stop();
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;

      return () => recognition.stop();
    }, [isListening]);

    const toggleListening = async () => {
      try {
        if (isListening) {
          speakResponse("Microphone off");
          recognitionRef.current.stop();
        } else {
          speakResponse("Listening");
          recognitionRef.current.start();
        }
        setIsListening(!isListening);
      } catch (error) {
        console.error("Mic toggle error:", error);
        setIsListening(false);
      }
    };

    return <JarvisCore {...props} canvasRef={canvasRef} toggleListening={toggleListening} />;
  };

  return JarvisCoreWithEnhancement;
};

export { EnhancedJarvisCore as enhanceVoiceAnimation };

// Instructions: Replace the import and usage of JarvisCore in your App.js or index.js with EnhancedJarvisCore
// Example:
// import { enhanceVoiceAnimation as EnhancedJarvisCore } from "./components/hologramOrb";
// <Route path="/hologramOrb" element={<EnhancedJarvisCore />} />