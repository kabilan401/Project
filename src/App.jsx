import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Aptitude from "./components/Aptitude";
import CodingPractice from "./components/CodingPractice";
import MockTest from "./components/MockTest";
import InterviewPrep from "./components/InterviewPrep";
import ProgressDashboard from "./components/ProgressDashboard";
import CompanyPrep from "./components/CompanyPrep";
import NotificationsList from "./components/NotificationsList";
import AdminDashboard from "./components/AdminDashboard";
import AIEnglishAssistant from "./components/AIEnglishAssistant";
import { initializeDatabase } from "./data/questionsData";
import { 
  GraduationCap, User, BrainCircuit, Code, ClipboardList, MessageSquareCode, 
  Sun, Moon, LogOut, ShieldAlert, TrendingUp, Briefcase, Bell, Languages
} from "lucide-react";
import "./App.css";

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("color-scheme") || "dark";
  });

  // Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("prep_student_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState("progress");

  // Toasts Alert State
  const [toasts, setToasts] = useState([]);

  // Sync theme changes with document elements
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("color-scheme", theme);
  }, [theme]);

  // Initialize localStorage dynamic databases
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Synchronize active student performance stats back to shared database directory
  useEffect(() => {
    if (user && user.role === "student") {
      const directory = JSON.parse(localStorage.getItem("prep_student_directory") || "[]");
      const aptStats = JSON.parse(localStorage.getItem("prep_aptitude_stats") || '{"total":0,"correct":0}');
      const codingSolved = JSON.parse(localStorage.getItem("prep_coding_solved_list") || "[]");
      const mockHistory = JSON.parse(localStorage.getItem("prep_mock_test_history") || "[]");
      const dailyTasksObj = JSON.parse(localStorage.getItem("prep_daily_tasks") || '{"streak":0,"completed":{}}');

      const updatedStudent = {
        email: user.email,
        name: user.name,
        department: user.department,
        year: user.year,
        cgpa: user.cgpa !== undefined ? user.cgpa : 8.0,
        bio: user.bio || "Motivated engineering student focused on full-stack software development and problem solving.",
        skills: user.skills || [],
        certifications: user.certifications || [],
        projects: user.projects || [],
        resume: user.resume || null,
        aptitudeStats: aptStats,
        codingSolvedList: codingSolved,
        mockHistory: mockHistory,
        dailyTasks: dailyTasksObj
      };

      const index = directory.findIndex(s => s.email === user.email);
      if (index !== -1) {
        directory[index] = updatedStudent;
      } else {
        directory.push(updatedStudent);
      }
      localStorage.setItem("prep_student_directory", JSON.stringify(directory));
    }
  }, [user, activeTab]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto clear after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab(userData.role === "admin" ? "admin-dashboard" : "progress");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the placement portal?")) {
      setUser(null);
      localStorage.removeItem("prep_student_user");
      showToast("Logged out of session.", "info");
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("prep_student_user", JSON.stringify(updatedUser));

    // Keep registered credentials sync with updated metadata
    const registeredList = JSON.parse(localStorage.getItem("prep_registered_students") || "[]");
    const idx = registeredList.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());
    if (idx !== -1) {
      registeredList[idx] = {
        ...registeredList[idx],
        ...updatedUser
      };
      localStorage.setItem("prep_registered_students", JSON.stringify(registeredList));
    }
  };

  // Helper render for selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return <ProgressDashboard showToast={showToast} />;
      case "profile":
        return <Profile user={user} onUserUpdate={handleUserUpdate} showToast={showToast} />;
      case "aptitude":
        return <Aptitude showToast={showToast} />;
      case "coding":
        return <CodingPractice showToast={showToast} />;
      case "mock-test":
        return <MockTest showToast={showToast} />;
      case "interview":
        return <InterviewPrep showToast={showToast} />;
      case "english-assistant":
        return <AIEnglishAssistant showToast={showToast} />;
      case "company-prep":
        return <CompanyPrep showToast={showToast} />;
      case "notifications":
        return <NotificationsList showToast={showToast} user={user} />;
      default:
        return <ProgressDashboard />;
    }
  };

  return (
    <div style={styles.appWrapper}>
      {/* Dynamic Toast Alerts Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "error" && <ShieldAlert size={16} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Guest Mode: Show Auth Panel */}
      {!user ? (
        <div style={styles.guestContainer}>
          <Auth onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        </div>
      ) : user.role === "admin" ? (
        /* Admin Mode: Dashboard without student sidebar */
        <div style={styles.dashboardContainer}>
          <div style={{ flex: 1, padding: "20px 40px" }}>
            <div style={styles.adminHeaderNav}>
              <h2 style={{ background: "var(--brand-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800, fontSize: "1.6rem" }}>
                PrepXpert Admin Console
              </h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn btn-secondary" onClick={toggleTheme} title="Toggle Theme" style={{ padding: "8px 12px" }}>
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleLogout} 
                  style={{ borderColor: "rgba(244, 63, 94, 0.25)", color: "var(--accent-rose)", padding: "8px 16px" }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
            <AdminDashboard showToast={showToast} />
          </div>
        </div>
      ) : (
        /* Logged In Mode: Sidebar + Main Layout */
        <div style={styles.dashboardContainer}>
          
          {/* GLASS SIDEBAR */}
          <aside className="glass-panel" style={styles.sidebar}>
            <div style={styles.sidebarBrand}>
              <GraduationCap size={28} color="var(--brand-primary)" />
              <h2 style={styles.brandText}>PrepXpert</h2>
            </div>

            {/* Profile Overview segment in Sidebar */}
            <div style={styles.userCard}>
              <div style={styles.userAvatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <p style={styles.userName}>{user.name}</p>
                <p style={styles.userDept}>{user.department}</p>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav style={styles.navMenu}>
              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "progress" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "progress" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("progress")}
              >
                <TrendingUp size={18} /> Progress & Scores
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "profile" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "profile" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("profile")}
              >
                <User size={18} /> Profile Workspace
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "aptitude" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "aptitude" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("aptitude")}
              >
                <BrainCircuit size={18} /> Aptitude Arena
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "coding" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "coding" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("coding")}
              >
                <Code size={18} /> Coding Arena
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "mock-test" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "mock-test" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("mock-test")}
              >
                <ClipboardList size={18} /> Placement Mock Test
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "interview" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "interview" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("interview")}
              >
                <MessageSquareCode size={18} /> Interview Prep Q&A
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "english-assistant" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "english-assistant" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("english-assistant")}
              >
                <Languages size={18} /> AI English Assistant
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "company-prep" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "company-prep" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("company-prep")}
              >
                <Briefcase size={18} /> Company Prep Stepper
              </button>

              <button 
                style={{
                  ...styles.navItem,
                  background: activeTab === "notifications" ? "var(--brand-gradient)" : "transparent",
                  color: activeTab === "notifications" ? "#ffffff" : "var(--text-secondary)"
                }}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell size={18} /> Placement Jobs
              </button>
            </nav>

            {/* Sidebar bottom settings / logout */}
            <div style={styles.sidebarFooter}>
              <button 
                className="btn btn-secondary" 
                style={styles.actionBtn}
                onClick={toggleTheme}
                title="Toggle Light/Dark Theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
              </button>

              <button 
                className="btn btn-secondary"
                style={{ ...styles.actionBtn, borderColor: "rgba(244, 63, 94, 0.25)" }}
                onClick={handleLogout}
              >
                <LogOut size={16} color="var(--accent-rose)" />
                <span style={{ color: "var(--accent-rose)" }}>Log Out</span>
              </button>
            </div>
          </aside>

          {/* MAIN PAGE VIEW */}
          <main style={styles.mainContent}>
            {renderTabContent()}
          </main>

        </div>
      )}
    </div>
  );
}

const styles = {
  appWrapper: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  guestContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%"
  },
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    width: "100%"
  },
  sidebar: {
    width: "280px",
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    position: "fixed",
    top: "20px",
    bottom: "20px",
    left: "20px",
    zIndex: 900
  },
  sidebarBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
    textAlign: "left"
  },
  brandText: {
    fontSize: "1.3rem",
    fontWeight: 800,
    background: "var(--brand-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "var(--glass-border)",
    marginBottom: "28px",
    textAlign: "left"
  },
  userAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "var(--brand-gradient)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1.1rem"
  },
  userInfo: {
    overflow: "hidden"
  },
  userName: {
    fontSize: "0.92rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  userDept: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  navMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexGrow: 1,
    overflowY: "auto"
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    fontSize: "0.92rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    textAlign: "left"
  },
  sidebarFooter: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "24px"
  },
  actionBtn: {
    width: "100%",
    justifyContent: "flex-start",
    padding: "10px 14px",
    fontSize: "0.88rem"
  },
  mainContent: {
    marginLeft: "320px", /* 280px sidebar width + 40px spacer */
    padding: "20px 40px 40px 0",
    flexGrow: 1,
    width: "calc(100% - 320px)"
  },
  adminHeaderNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "16px",
    marginBottom: "20px"
  }
};
