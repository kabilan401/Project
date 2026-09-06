import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, User, BookOpen, GraduationCap, Eye, EyeOff, ShieldCheck, ArrowRight, ShieldAlert, Camera, Hand, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

export default function Auth({ onLoginSuccess, showToast }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [year, setYear] = useState("3rd Year");
  
  // Validation / UI States
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  // Hand Gesture Login States & Refs
  const [isHandLogin, setIsHandLogin] = useState(false);
  const [handLoginStatus, setHandLoginStatus] = useState("idle"); // idle, loading, scanning, detected, logging_in, error
  const [cameraError, setCameraError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const activeStreamRef = useRef(null);
  const activeCameraRef = useRef(null);
  const simulationIntervalRef = useRef(null);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  };

  const cleanupHandTracking = () => {
    if (activeCameraRef.current) {
      try {
        activeCameraRef.current.stop();
      } catch (e) {
        console.warn("Error stopping MediaPipe Camera:", e);
      }
      activeCameraRef.current = null;
    }
    
    if (activeStreamRef.current) {
      try {
        activeStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn("Error stopping stream tracks:", e);
      }
      activeStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const handleHandLoginSuccess = () => {
    cleanupHandTracking();
    setHandLoginStatus("logging_in");
    
    let registeredList = [];
    try {
      registeredList = JSON.parse(localStorage.getItem("prep_registered_students") || "[]");
    } catch (e) {
      registeredList = [];
    }
    
    // Filter to ensure we only select a student account
    let studentList = registeredList.filter(u => u.role === "student" || u.role === undefined || !u.role);
    let targetUser = studentList[0];
    
    if (!targetUser) {
      // Register a default gesture user
      targetUser = {
        name: "Gesture Student",
        email: "gesture.student@prepxpert.com",
        password: "password123",
        department: "Computer Science",
        year: "3rd Year",
        cgpa: 8.8,
        skills: ["React", "AI Integration", "Computer Vision"],
        certifications: [{
          id: "c1",
          title: "MediaPipe Certified Practitioner",
          org: "Google Developer Group",
          date: "2026-08-29",
          credentialId: "MP-98402"
        }],
        projects: [{
          id: "p1",
          title: "Gesture Authenticator",
          desc: "Real-time hand detection login system using MediaPipe and Canvas APIs.",
          tech: ["React", "MediaPipe", "WebGL"]
        }],
        role: "student"
      };
      localStorage.setItem("prep_registered_students", JSON.stringify([targetUser]));
      
      const directory = JSON.parse(localStorage.getItem("prep_student_directory") || "[]");
      const studentRecord = {
        email: targetUser.email,
        name: targetUser.name,
        department: targetUser.department,
        year: targetUser.year,
        cgpa: targetUser.cgpa,
        bio: "Hands-on developer testing bio-gesture authentication systems.",
        skills: targetUser.skills,
        certifications: targetUser.certifications,
        projects: targetUser.projects,
        resume: null,
        aptitudeStats: { total: 0, correct: 0 },
        codingSolvedList: [],
        mockHistory: []
      };
      localStorage.setItem("prep_student_directory", JSON.stringify([...directory, studentRecord]));
    } else {
      const directory = JSON.parse(localStorage.getItem("prep_student_directory") || "[]");
      const studentProfile = directory.find(s => s.email.toLowerCase() === targetUser.email.toLowerCase()) || {};
      targetUser = {
        ...targetUser,
        ...studentProfile,
        role: "student" // Explicitly force role to be student
      };
    }
    
    setTimeout(() => {
      localStorage.setItem("prep_student_user", JSON.stringify(targetUser));
      showToast(`Identity verified! Welcome, ${targetUser.name}.`, "success");
      onLoginSuccess(targetUser);
    }, 1500);
  };

  const startSimulation = () => {
    cleanupHandTracking();
    setHandLoginStatus("scanning");
    setCameraError(null);
    setScanProgress(0);
    
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then(stream => {
        activeStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn(e));
        }
      })
      .catch(err => {
        console.warn("Could not start camera for simulation:", err);
      });
      
    let progress = 0;
    simulationIntervalRef.current = setInterval(() => {
      progress += 5;
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (videoRef.current && videoRef.current.readyState >= 2) {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else {
          ctx.fillStyle = "rgba(10, 8, 22, 0.85)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.strokeStyle = "rgba(144, 97, 249, 0.08)";
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.strokeStyle = progress > 30 ? "rgba(16, 185, 129, 0.5)" : "rgba(144, 97, 249, 0.5)";
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(cx, cy, 90 + Math.sin(progress / 5) * 5, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx - 120, cy); ctx.lineTo(cx + 120, cy);
        ctx.moveTo(cx, cy - 120); ctx.lineTo(cx, cy + 120);
        ctx.stroke();
        
        ctx.fillStyle = progress > 30 ? "#10b981" : "#9061f9";
        ctx.font = "bold 16px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(progress > 30 ? "HAND SIGNATURE VERIFIED" : "SEEKING GESTURE SIGNAL...", cx, cy - 110);
      }
      
      if (progress >= 100) {
        setScanProgress(100);
        clearInterval(simulationIntervalRef.current);
        handleHandLoginSuccess();
      } else {
        setScanProgress(progress);
        if (progress > 30) {
          setHandLoginStatus("detected");
        }
      }
    }, 100);
  };

  const startHandTracking = async () => {
    cleanupHandTracking();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      activeStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!window.Hands) {
        throw new Error("MediaPipe Hands library failed to mount on window context.");
      }

      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      hands.onResults((results) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          
          if (window.drawConnectors && window.drawLandmarks) {
            ctx.save();
            const mirroredLandmarks = landmarks.map(lm => ({
              x: 1 - lm.x,
              y: lm.y,
              z: lm.z
            }));

            window.drawConnectors(ctx, mirroredLandmarks, window.HAND_CONNECTIONS, {
              color: '#9061f9',
              lineWidth: 3
            });
            window.drawLandmarks(ctx, mirroredLandmarks, {
              color: '#d946ef',
              lineWidth: 1,
              radius: 4
            });
            ctx.restore();
          }

          setScanProgress(prev => {
            if (prev >= 100) {
              handleHandLoginSuccess();
              return 100;
            }
            return prev + 6;
          });
          setHandLoginStatus("detected");
        } else {
          setScanProgress(prev => Math.max(0, prev - 4));
          setHandLoginStatus("scanning");
        }
      });

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      camera.start();
      activeCameraRef.current = camera;
      setHandLoginStatus("scanning");
    } catch (err) {
      console.error("Camera or MediaPipe initialization failed:", err);
      setCameraError(err.message || "Failed to access webcam or initialize hand tracker.");
      setHandLoginStatus("error");
    }
  };

  useEffect(() => {
    if (isHandLogin) {
      setHandLoginStatus("loading");
      setCameraError(null);
      setScanProgress(0);
      
      const loadMediaPipe = async () => {
        try {
          await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
          await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
          await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
          setIsMediaPipeLoaded(true);
          
          setTimeout(() => {
            startHandTracking();
          }, 300);
        } catch (err) {
          console.error("Failed to load MediaPipe scripts:", err);
          setCameraError("Unable to load hand tracking libraries. You can still run the Simulated Sign-In below.");
          setHandLoginStatus("error");
        }
      };
      
      loadMediaPipe();
    } else {
      cleanupHandTracking();
    }
    
    return () => {
      cleanupHandTracking();
    };
  }, [isHandLogin]);

  // Password Strength Checker
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: "", color: "transparent", percent: 0 };
    let strength = 0;
    if (pass.length >= 6) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;

    if (strength <= 1) return { label: "Weak", color: "var(--accent-rose)", percent: 25 };
    if (strength === 2) return { label: "Medium", color: "var(--accent-amber)", percent: 50 };
    if (strength === 3) return { label: "Good", color: "var(--brand-accent)", percent: 75 };
    return { label: "Strong", color: "var(--accent-emerald)", percent: 100 };
  };

  const strength = getPasswordStrength(password);

  const validateForm = () => {
    const tempErrors = {};
    if (isRegistering && !name.trim()) tempErrors.name = "Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isAdminMode) {
      // Predefined Admin Authentication
      if (email === "admin@prepxpert.com" && password === "admin123") {
        showToast("Welcome back, System Administrator!", "success");
        onLoginSuccess({
          name: "System Administrator",
          email: "admin@prepxpert.com",
          role: "admin"
        });
      } else {
        triggerShake();
        showToast("Invalid admin credentials.", "error");
      }
      return;
    }

    if (!validateForm()) {
      triggerShake();
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    if (isRegistering) {
      const registeredList = JSON.parse(localStorage.getItem("prep_registered_students") || "[]");
      if (registeredList.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        triggerShake();
        showToast("A student with this email is already registered.", "error");
        return;
      }

      const userData = {
        name,
        email,
        password,
        department,
        year,
        cgpa: 8.0,
        skills: ["Java", "SQL", "Web Development"], // Default skills
        certifications: [],
        projects: [],
        resume: null,
        role: "student"
      };

      localStorage.setItem("prep_registered_students", JSON.stringify([...registeredList, userData]));
      
      // Also register this student into the admin directory list
      const directory = JSON.parse(localStorage.getItem("prep_student_directory") || "[]");
      if (!directory.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        const studentRecord = {
          email,
          name,
          department,
          year,
          cgpa: 8.0,
          bio: "Motivated engineering student focused on full-stack software development and problem solving.",
          skills: ["Java", "SQL", "Web Development"],
          certifications: [],
          projects: [],
          resume: null,
          aptitudeStats: { total: 0, correct: 0 },
          codingSolvedList: [],
          mockHistory: []
        };
        localStorage.setItem("prep_student_directory", JSON.stringify([...directory, studentRecord]));
      }

      showToast("Registration successful! You can now log in.", "success");
      setIsRegistering(false);
      setPassword(""); // Clear password field
    } else {
      // Login process
      const registeredList = JSON.parse(localStorage.getItem("prep_registered_students") || "[]");
      const matchedUser = registeredList.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (!matchedUser) {
        triggerShake();
        showToast("Invalid email or password.", "error");
        return;
      }

      // Load latest dynamic profile details from admin student directory if they exist
      const directory = JSON.parse(localStorage.getItem("prep_student_directory") || "[]");
      const studentProfile = directory.find(s => s.email.toLowerCase() === email.toLowerCase()) || {};

      const fullUserSession = {
        ...matchedUser,
        ...studentProfile,
        role: "student"
      };

      localStorage.setItem("prep_student_user", JSON.stringify(fullUserSession));
      showToast(`Welcome back, ${fullUserSession.name}!`, "success");
      onLoginSuccess(fullUserSession);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.brandingSection}>
        <div style={styles.logoBadge}>
          <GraduationCap size={32} color="#ffffff" />
        </div>
        <h1 style={styles.brandTitle}>PrepXpert</h1>
        <p style={styles.brandSubtitle}>Accelerate your campus placement preparation with smart practice, mock tests, and AI evaluation.</p>
      </div>

      <div 
        className={`glass-panel ${shake ? "shake-element" : ""}`}
        style={styles.card}
      >
        {isHandLogin ? (
          <div style={styles.handLoginContainer}>
            <div style={styles.handLoginHeader}>
              <div style={{
                ...styles.radarWrapper,
                borderColor: handLoginStatus === "detected" ? "var(--accent-emerald)" : "var(--brand-primary)"
              }}>
                <Hand 
                  size={32} 
                  color={handLoginStatus === "detected" ? "var(--accent-emerald)" : "var(--brand-primary)"} 
                  style={{
                    animation: (handLoginStatus === "scanning" || handLoginStatus === "detected") ? "pulseRing 1.5s ease-in-out infinite" : "none"
                  }}
                />
                {(handLoginStatus === "scanning" || handLoginStatus === "detected") && <div className="radar-sweep" />}
              </div>
              <h3 style={styles.handLoginTitle}>Bio-Gesture Sign-In</h3>
              <p style={styles.handLoginSubtitle}>
                {handLoginStatus === "loading" && "Loading libraries and starting camera..."}
                {handLoginStatus === "scanning" && "Scanning... Hold up your hand to the camera"}
                {handLoginStatus === "detected" && "Hand signature detected! Verifying..."}
                {handLoginStatus === "logging_in" && "Identity verified! Loading profile..."}
                {handLoginStatus === "error" && "Sign-in failed. Try the Simulated Sign-In below."}
              </p>
            </div>

            <div style={styles.webcamContainer}>
              <video 
                ref={videoRef} 
                style={styles.videoFeed} 
                playsInline 
                muted
              />
              <canvas 
                ref={canvasRef} 
                width="640" 
                height="480" 
                style={styles.canvasOverlay}
              />

              {(handLoginStatus === "scanning" || handLoginStatus === "detected") && (
                <div className="scanner-line" style={{
                  animationDuration: handLoginStatus === "detected" ? "1.2s" : "2.5s"
                }} />
              )}

              {(handLoginStatus === "loading" || handLoginStatus === "error" || handLoginStatus === "logging_in") && (
                <div style={styles.backdropOverlay}>
                  {handLoginStatus === "loading" && (
                    <div style={styles.loadingSpinner}>
                      <div style={styles.spinner} />
                      <span style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        Loading Hand Tracker...
                      </span>
                    </div>
                  )}
                  {handLoginStatus === "logging_in" && (
                    <div style={styles.successAnimation}>
                      <ShieldCheck size={48} color="var(--accent-emerald)" />
                      <span style={{ marginTop: 12, fontWeight: 700, fontSize: "0.9rem", color: "var(--accent-emerald)", letterSpacing: "1px" }}>
                        ACCESS GRANTED
                      </span>
                    </div>
                  )}
                  {handLoginStatus === "error" && (
                    <div style={styles.errorContainer}>
                      <AlertCircle size={36} color="var(--accent-rose)" />
                      <p style={{ marginTop: 10, fontSize: "0.8rem", color: "var(--accent-rose)", textAlign: "center", padding: "0 10px", lineHeight: "1.4" }}>
                        {cameraError}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={styles.progressSection}>
              <div style={styles.progressLabels}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Biometric Match</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: scanProgress > 30 ? "var(--accent-emerald)" : "var(--brand-primary)" }}>
                  {scanProgress}%
                </span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{
                  ...styles.progressBarFill,
                  width: `${scanProgress}%`,
                  backgroundColor: handLoginStatus === "detected" ? "var(--accent-emerald)" : "var(--brand-primary)"
                }} />
              </div>
            </div>

            <div style={styles.actionsContainer}>
              {handLoginStatus !== "logging_in" && (
                <button 
                  type="button" 
                  className="btn" 
                  style={styles.demoScanBtn}
                  onClick={startSimulation}
                >
                  <RefreshCw size={14} style={{ marginRight: 6 }} />
                  Demo Scanner (Simulated Sign-In)
                </button>
              )}
              
              <button 
                type="button" 
                style={styles.backBtn}
                onClick={() => {
                  cleanupHandTracking();
                  setIsHandLogin(false);
                  setHandLoginStatus("idle");
                }}
              >
                <ArrowLeft size={16} style={{ marginRight: 6 }} />
                Back to Password Login
              </button>
            </div>
          </div>
        ) : (
          <>
            {isAdminMode ? (
              <div style={styles.adminHeader}>
                <ShieldAlert size={24} color="var(--brand-primary)" />
                <h3 style={styles.adminTitle}>Admin Portal Access</h3>
              </div>
            ) : (
              <div style={styles.tabHeader}>
                <button 
                  style={{
                    ...styles.tabButton,
                    borderBottomColor: !isRegistering ? "var(--brand-primary)" : "transparent",
                    color: !isRegistering ? "var(--text-primary)" : "var(--text-secondary)"
                  }}
                  onClick={() => { setIsRegistering(false); setErrors({}); }}
                >
                  Login
                </button>
                <button 
                  style={{
                    ...styles.tabButton,
                    borderBottomColor: isRegistering ? "var(--brand-primary)" : "transparent",
                    color: isRegistering ? "var(--text-primary)" : "var(--text-secondary)"
                  }}
                  onClick={() => { setIsRegistering(true); setErrors({}); }}
                >
                  Register
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {isRegistering && !isAdminMode && (
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-name">Full Name</label>
                  <div style={styles.inputContainer}>
                    <User size={18} style={styles.inputIcon} />
                    <input 
                      id="reg-name"
                      type="text" 
                      className="input-field" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                </div>
              )}

              <div className="input-group">
                <label className="input-label" htmlFor="auth-email">Email Address</label>
                <div style={styles.inputContainer}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input 
                    id="auth-email"
                    type="email" 
                    className="input-field" 
                    placeholder={isAdminMode ? "admin@prepxpert.com" : "john.doe@university.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="auth-password">Password</label>
                <div style={styles.inputContainer}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input 
                    id="auth-password"
                    type={showPassword ? "text" : "password"} 
                    className="input-field" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    style={styles.eyeButton} 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span style={styles.errorText}>{errors.password}</span>}

                {isRegistering && !isAdminMode && password && (
                  <div style={styles.strengthWrapper}>
                    <div style={styles.strengthLabels}>
                      <span style={styles.strengthText}>Strength: {strength.label}</span>
                      <span style={styles.strengthPercent}>{strength.percent}%</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div 
                        style={{
                          ...styles.progressBarFill,
                          width: `${strength.percent}%`,
                          backgroundColor: strength.color
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {isRegistering && !isAdminMode && (
                <>
                  <div className="input-group">
                    <label className="input-label" htmlFor="reg-dept">Department</label>
                    <div style={styles.inputContainer}>
                      <BookOpen size={18} style={styles.inputIcon} />
                      <select 
                        id="reg-dept"
                        className="input-field select-field"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value="Computer Science">Computer Science & Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science (AIDS)</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering (EEE)</option>
                        <option value="Electronics & Communication Engineering">Electronics & Communication Engineering (ECE)</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="reg-year">Year of Study</label>
                    <div style={styles.inputContainer}>
                      <GraduationCap size={18} style={styles.inputIcon} />
                      <select 
                        id="reg-year"
                        className="input-field select-field"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                {isAdminMode ? "Access Admin Shell" : isRegistering ? "Create Account" : "Access Portal"}
                <ArrowRight size={18} />
              </button>

              {!isRegistering && !isAdminMode && (
                <button 
                  type="button" 
                  style={styles.gestureLoginToggleBtn}
                  onClick={() => setIsHandLogin(true)}
                >
                  <Hand size={18} style={{ marginRight: 6 }} />
                  Sign-In with Hand Gesture
                </button>
              )}
            </form>

            <div style={styles.portalToggleSection}>
              {isAdminMode ? (
                <button style={styles.toggleModeLink} onClick={() => { setIsAdminMode(false); setErrors({}); setEmail(""); setPassword(""); }}>
                  Switch to Student Workspace
                </button>
              ) : (
                <button style={styles.toggleModeLink} onClick={() => { setIsAdminMode(true); setErrors({}); setEmail(""); setPassword(""); }}>
                  Access Placement Admin Portal
                </button>
              )}
            </div>

            <div style={styles.footerNote}>
              <ShieldCheck size={14} style={{ marginRight: 6 }} />
              <span>All credentials remain secure in local sandbox memory.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    width: "100%",
    minHeight: "calc(100vh - 80px)"
  },
  brandingSection: {
    textAlign: "center",
    maxWidth: "500px",
    marginBottom: "32px"
  },
  logoBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    background: "var(--brand-gradient)",
    boxShadow: "0 8px 24px rgba(144, 97, 249, 0.3)",
    marginBottom: "16px"
  },
  brandTitle: {
    fontSize: "2.5rem",
    fontWeight: 800,
    marginBottom: "8px",
    background: "var(--brand-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  brandSubtitle: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5"
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "36px"
  },
  tabHeader: {
    display: "flex",
    borderBottom: "1px solid var(--border-color)",
    marginBottom: "28px"
  },
  tabButton: {
    flex: 1,
    paddingBottom: "12px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  adminHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "28px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "12px"
  },
  adminTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    color: "var(--brand-primary)",
    pointerEvents: "none"
  },
  eyeButton: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  submitBtn: {
    marginTop: "16px",
    width: "100%",
    height: "46px"
  },
  errorText: {
    color: "var(--accent-rose)",
    fontSize: "0.85rem",
    fontWeight: 500,
    marginTop: "2px",
    textAlign: "left"
  },
  strengthWrapper: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  strengthLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.8rem",
    fontWeight: 500
  },
  strengthText: {
    color: "var(--text-secondary)"
  },
  strengthPercent: {
    color: "var(--text-primary)"
  },
  progressBarBg: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "3px",
    overflow: "hidden"
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.4s ease, background-color 0.4s ease"
  },
  portalToggleSection: {
    marginTop: "18px",
    textAlign: "center"
  },
  toggleModeLink: {
    background: "none",
    border: "none",
    color: "var(--brand-primary)",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",
    padding: "4px 8px"
  },
  footerNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "24px",
    fontSize: "0.8rem",
    color: "var(--text-secondary)"
  },
  gestureLoginToggleBtn: {
    marginTop: "12px",
    width: "100%",
    height: "46px",
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600
  },
  handLoginContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  handLoginHeader: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },
  radarWrapper: {
    position: "relative",
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    border: "2px solid var(--brand-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    transition: "border-color 0.3s ease"
  },
  handLoginTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  handLoginSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
    maxWidth: "320px",
    margin: "0 auto"
  },
  webcamContainer: {
    position: "relative",
    width: "100%",
    height: "240px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid var(--border-color)",
    backgroundColor: "#0a0816",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  videoFeed: {
    display: "none"
  },
  canvasOverlay: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  backdropOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10, 8, 22, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20
  },
  loadingSpinner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid rgba(144, 97, 249, 0.1)",
    borderTopColor: "var(--brand-primary)",
    borderRadius: "50%",
    animation: "radarSpin 1s linear infinite"
  },
  successAnimation: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "pulseRing 1.5s ease-in-out infinite"
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px"
  },
  progressSection: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  progressLabels: {
    display: "flex",
    justifyContent: "space-between"
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "8px"
  },
  demoScanBtn: {
    width: "100%",
    height: "42px",
    background: "rgba(144, 97, 249, 0.1)",
    border: "1px solid rgba(144, 97, 249, 0.2)",
    color: "var(--brand-accent)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  backBtn: {
    width: "100%",
    height: "42px",
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};

