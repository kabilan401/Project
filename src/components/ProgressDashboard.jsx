import React, { useState, useEffect } from "react";
import { BrainCircuit, Code, UserCheck, Calendar, ShieldAlert, BarChart3, TrendingUp, BookOpen, RotateCcw, Check } from "lucide-react";

export default function ProgressDashboard({ showToast }) {
  const [profileData, setProfileData] = useState(null);
  const [aptitudeStats, setAptitudeStats] = useState({ total: 0, correct: 0 });
  const [mockHistory, setMockHistory] = useState([]);

  // Daily Tasks State with daily reset and streak detection
  const [dailyTasks, setDailyTasks] = useState(() => {
    const defaultTasks = {
      lastUpdated: new Date().toISOString().split("T")[0],
      streak: 0,
      completed: {
        apt: false,
        coding: false,
        interview: false,
        jobs: false,
        profile: false
      }
    };
    const saved = localStorage.getItem("prep_daily_tasks");
    if (!saved) return defaultTasks;
    
    try {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split("T")[0];
      
      if (parsed.lastUpdated !== today) {
        const completedAny = Object.values(parsed.completed).some(Boolean);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        
        let newStreak = parsed.streak;
        if (!completedAny || (parsed.lastUpdated !== yesterdayStr && parsed.lastUpdated !== today)) {
          newStreak = 0; // Broke streak
        }
        
        const resetTasks = {
          lastUpdated: today,
          streak: newStreak,
          completed: {
            apt: false,
            coding: false,
            interview: false,
            jobs: false,
            profile: false
          }
        };
        localStorage.setItem("prep_daily_tasks", JSON.stringify(resetTasks));
        return resetTasks;
      }
      return parsed;
    } catch {
      return defaultTasks;
    }
  });

  const toggleDailyTask = (taskId) => {
    setDailyTasks(prev => {
      const updatedCompleted = {
        ...prev.completed,
        [taskId]: !prev.completed[taskId]
      };
      
      const previouslyCompletedAny = Object.values(prev.completed).some(Boolean);
      const nowCompletedAny = Object.values(updatedCompleted).some(Boolean);
      
      let newStreak = prev.streak;
      if (!previouslyCompletedAny && nowCompletedAny) {
        newStreak = prev.streak === 0 ? 1 : prev.streak;
      }
      
      const newDaily = {
        ...prev,
        streak: newStreak,
        completed: updatedCompleted
      };
      
      localStorage.setItem("prep_daily_tasks", JSON.stringify(newDaily));
      
      // Update student user object in localStorage
      const storedUser = localStorage.getItem("prep_student_user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.dailyTasks = newDaily;
        localStorage.setItem("prep_student_user", JSON.stringify(userObj));
        setProfileData(userObj); // Force sync
      }
      
      return newDaily;
    });
  };

  // Load stats from localStorage on mount
  useEffect(() => {
    // 1. Profile Data
    const storedUser = localStorage.getItem("prep_student_user");
    if (storedUser) {
      setProfileData(JSON.parse(storedUser));
    }

    // 2. Aptitude Stats
    const storedApt = localStorage.getItem("prep_aptitude_stats");
    if (storedApt) {
      setAptitudeStats(JSON.parse(storedApt));
    }

    // 3. Mock Test History
    const storedMock = localStorage.getItem("prep_mock_test_history");
    if (storedMock) {
      setMockHistory(JSON.parse(storedMock));
    }
  }, []);

  const handleClearProgress = () => {
    if (window.confirm("Are you sure you want to clear all your placement progress? This will reset your aptitude stats, coding solved list, and mock exam history.")) {
      // 1. Reset localStorage values
      localStorage.setItem("prep_aptitude_stats", JSON.stringify({ total: 0, correct: 0 }));
      localStorage.setItem("prep_coding_solved_list", JSON.stringify([]));
      localStorage.setItem("prep_coding_solved_count", "0");
      localStorage.setItem("prep_mock_test_history", JSON.stringify([]));

      // 2. Synchronize back to prep_student_directory immediately
      if (profileData) {
        const directory = JSON.parse(localStorage.getItem("prep_student_directory") || "[]");
        const index = directory.findIndex(s => s.email === profileData.email);
        if (index !== -1) {
          directory[index] = {
            ...directory[index],
            aptitudeStats: { total: 0, correct: 0 },
            codingSolvedList: [],
            mockHistory: []
          };
          localStorage.setItem("prep_student_directory", JSON.stringify(directory));
        }
      }

      // 3. Reset local component state to refresh UI
      setAptitudeStats({ total: 0, correct: 0 });
      setMockHistory([]);

      // 4. Show success toast
      if (showToast) {
        showToast("Placement progress successfully cleared.", "success");
      }
    }
  };

  // Readiness Calculations
  const calculateReadiness = () => {
    let profileScore = 0;
    let aptitudeScore = 0;
    let codingScore = 0;
    let mockScore = 0;

    // A. Profile Completeness (Max 25%)
    if (profileData) {
      if (profileData.bio && profileData.bio.length > 20) profileScore += 5;
      if (profileData.resume) profileScore += 10;
      if (profileData.skills && profileData.skills.length > 0) {
        profileScore += Math.min(10, profileData.skills.length * 3); // 3% per skill up to 10%
      }
    }

    // B. Aptitude Progress (Max 25%)
    // Based on questions solved correctly. 1 question = 2%, max 25% (around 12 questions)
    if (aptitudeStats && aptitudeStats.correct > 0) {
      aptitudeScore = Math.min(25, aptitudeStats.correct * 2);
    }

    // C. Coding Progress (Max 25%)
    // Let's assume they get 5% per custom skill/project added to show practice, plus we check local storage coding history
    const storedCoding = localStorage.getItem("prep_coding_solved_count") || 0;
    codingScore = Math.min(25, Number(storedCoding) * 5); // 5% per code solved, max 5 codes = 25%
    // Fallback: If no code solved but they have skills, give baseline points
    if (codingScore === 0 && profileData && profileData.skills && profileData.skills.length > 0) {
      codingScore = Math.min(15, profileData.skills.length * 3);
    }

    // D. Mock Exam (Max 25%)
    if (mockHistory.length > 0) {
      // Find highest score percentage
      const highPct = Math.max(...mockHistory.map(h => h.percent));
      mockScore = Math.round((highPct / 100) * 25);
    }

    const totalReadiness = profileScore + aptitudeScore + codingScore + mockScore;

    return {
      profile: profileScore,
      aptitude: aptitudeScore,
      coding: codingScore,
      mock: mockScore,
      total: Math.min(100, totalReadiness)
    };
  };

  const scores = calculateReadiness();

  // Readiness Level Description
  const getReadinessLevel = (score) => {
    if (score >= 75) return { label: "Excellent Readiness", color: "var(--accent-emerald)", desc: "You are fully prepared for placements! Continue revision and attempt dream company tests." };
    if (score >= 45) return { label: "Placement Ready", color: "var(--brand-accent)", desc: "Good foundation. Complete a few more coding challenges and mock exams to lock in top scores." };
    return { label: "Foundation Phase", color: "var(--accent-amber)", desc: "Build up your profile, add skills, and attempt aptitude sets to push your readiness score higher." };
  };

  const readiness = getReadinessLevel(scores.total);

  return (
    <div style={styles.container} className="animate-slide-up">
      
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.pageTitle}>Progress & Scores Dashboard</h2>
          <p style={styles.pageSubtitle}>Monitor your placement readiness, practice analytics, and exam history.</p>
        </div>
        <button 
          className="btn btn-secondary" 
          style={styles.clearBtn} 
          onClick={handleClearProgress}
        >
          <RotateCcw size={16} color="var(--accent-rose)" />
          <span style={{ color: "var(--accent-rose)" }}>Reset All Progress</span>
        </button>
      </div>

      {/* SCOREOVERVIEW GRID */}
      <div style={styles.overviewGrid} className="overview-grid">
        
        {/* RADIAL CHART RADIAL PROGRESS WHEEL */}
        <div className="glass-panel" style={styles.radialCard}>
          <h3 style={styles.cardTitle}><TrendingUp size={18} color="var(--brand-primary)" /> Placement Readiness</h3>
          
          <div style={styles.chartContainer}>
            <svg style={styles.svgCircle} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                style={styles.circleBg}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                style={{
                  ...styles.circleFill,
                  strokeDashoffset: 251.2 - (251.2 * scores.total) / 100,
                  stroke: readiness.color
                }}
              />
            </svg>
            <div style={styles.chartText}>
              <span style={styles.percentNumber}>{scores.total}%</span>
              <span style={styles.percentLabel}>Readiness Index</span>
            </div>
          </div>

          <div style={styles.readinessDescription}>
            <h4 style={{ ...styles.levelTitle, color: readiness.color }}>{readiness.label}</h4>
            <p style={styles.levelDesc}>{readiness.desc}</p>
          </div>
        </div>

        {/* METRICS BREAKDOWN CARD */}
        <div className="glass-panel" style={styles.breakdownCard}>
          <h3 style={styles.cardTitle}><BarChart3 size={18} color="var(--brand-primary)" /> Performance Breakdown</h3>
          <p style={styles.sectionSub}>Readiness metrics contribution across key domains.</p>

          <div style={styles.progressList}>
            {/* Profile */}
            <div style={styles.progressRow}>
              <div style={styles.progressLabels}>
                <span style={styles.progressLabel}><UserCheck size={14} /> Profile Completeness</span>
                <span>{scores.profile} / 25 pts</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${(scores.profile / 25) * 100}%`, backgroundColor: "var(--brand-primary)" }} />
              </div>
            </div>

            {/* Aptitude */}
            <div style={styles.progressRow}>
              <div style={styles.progressLabels}>
                <span style={styles.progressLabel}><BrainCircuit size={14} /> Aptitude Practice</span>
                <span>{scores.aptitude} / 25 pts</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${(scores.aptitude / 25) * 100}%`, backgroundColor: "var(--brand-accent)" }} />
              </div>
            </div>

            {/* Coding */}
            <div style={styles.progressRow}>
              <div style={styles.progressLabels}>
                <span style={styles.progressLabel}><Code size={14} /> Coding Arena</span>
                <span>{scores.coding} / 25 pts</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${(scores.coding / 25) * 100}%`, backgroundColor: "var(--accent-emerald)" }} />
              </div>
            </div>

            {/* Mock Exams */}
            <div style={styles.progressRow}>
              <div style={styles.progressLabels}>
                <span style={styles.progressLabel}><BookOpen size={14} /> Placement Mock Exams</span>
                <span>{scores.mock} / 25 pts</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${(scores.mock / 25) * 100}%`, backgroundColor: "var(--accent-rose)" }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DAILY TASKS CARD */}
      <div className="glass-panel" style={styles.dailyTasksCard}>
        <div style={styles.dailyHeader}>
          <h3 style={styles.cardTitle}>
            <UserCheck size={18} color="var(--brand-primary)" /> Daily Placement Tasks
          </h3>
          <div style={styles.streakBadge}>
            🔥 {dailyTasks.streak} Day Streak
          </div>
        </div>
        <p style={styles.sectionSub}>Complete daily goals to build consistent placement preparation habits.</p>
        
        {/* Progress bar */}
        {(() => {
          const completedCount = Object.values(dailyTasks.completed).filter(Boolean).length;
          const pct = Math.round((completedCount / 5) * 100);
          return (
            <div style={styles.dailyProgressBlock}>
              <div style={styles.progressLabels}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Daily Completion</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{completedCount} / 5 completed ({pct}%)</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${pct}%`, backgroundColor: "var(--brand-primary)" }} />
              </div>
            </div>
          );
        })()}

        <div style={styles.taskListGrid}>
          {[
            { id: "apt", label: "Practice 1 Aptitude Question", desc: "Sharpen logical, quantitative, and verbal ability" },
            { id: "coding", label: "Solve 1 Coding Challenge", desc: "Build algorithmic logic and syntax proficiency" },
            { id: "interview", label: "Review 1 Interview Topic", desc: "Refine responses to technical and HR questions" },
            { id: "jobs", label: "Check Placement Job Board", desc: "Inspect recent job postings and requirements" },
            { id: "profile", label: "Keep Profile and Resume Updated", desc: "Verify skills, cgpa, and certifications" }
          ].map(task => {
            const isCompleted = dailyTasks.completed[task.id];
            return (
              <div 
                key={task.id} 
                style={{
                  ...styles.taskItem,
                  borderColor: isCompleted ? "rgba(16, 185, 129, 0.25)" : "var(--border-color)",
                  background: isCompleted ? "rgba(16, 185, 129, 0.03)" : "rgba(255, 255, 255, 0.01)"
                }}
                onClick={() => toggleDailyTask(task.id)}
              >
                <div style={styles.checkboxWrapper}>
                  <div style={{
                    ...styles.checkbox,
                    borderColor: isCompleted ? "var(--accent-emerald)" : "var(--text-secondary)",
                    backgroundColor: isCompleted ? "var(--accent-emerald)" : "transparent"
                  }}>
                    {isCompleted && <Check size={12} color="#fff" />}
                  </div>
                </div>
                <div style={styles.taskText}>
                  <p style={{
                    ...styles.taskLabel,
                    textDecoration: isCompleted ? "line-through" : "none",
                    color: isCompleted ? "var(--text-secondary)" : "var(--text-primary)"
                  }}>{task.label}</p>
                  <p style={styles.taskDesc}>{task.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOCK EXAM HISTORY TABLE */}
      <div className="glass-panel" style={styles.historyCard}>
        <h3 style={styles.cardTitle}><Calendar size={18} color="var(--brand-primary)" /> Mock Test History</h3>
        <p style={styles.sectionSub}>Historical performance logs of proctored mock exams taken in this portal.</p>

        <div style={styles.tableScroller}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Date Completed</th>
                <th style={styles.th}>Score Achieved</th>
                <th style={styles.th}>Accuracy</th>
                <th style={styles.th}>Proctor Warnings</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((item, idx) => (
                <tr key={idx} style={styles.tableRow}>
                  <td style={styles.td}>{item.date}</td>
                  <td style={styles.td}>{item.score} / {item.total}</td>
                  <td style={styles.td}>{item.percent}%</td>
                  <td style={styles.td}>
                    <span style={{ 
                      color: item.warnings > 1 ? "var(--accent-rose)" : "var(--text-secondary)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontWeight: 600
                    }}>
                      {item.warnings > 0 && <ShieldAlert size={12} />}
                      {item.warnings} warnings
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      color: item.percent >= 60 ? "var(--accent-emerald)" : "var(--accent-rose)",
                      backgroundColor: item.percent >= 60 ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"
                    }}>
                      {item.percent >= 60 ? "PASS" : "FAIL"}
                    </span>
                  </td>
                </tr>
              ))}
              {mockHistory.length === 0 && (
                <tr>
                  <td colSpan="5" style={styles.tableEmpty}>
                    No mock tests taken yet. Launch the Placement Mock Test tab to attempt your first exam!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px 0"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "16px"
  },
  pageTitle: {
    fontSize: "1.6rem",
    background: "var(--brand-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    marginBottom: "4px"
  },
  pageSubtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem"
  },
  clearBtn: {
    borderColor: "rgba(244, 63, 94, 0.25)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--accent-rose)",
    cursor: "pointer"
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "28px",
    marginBottom: "28px"
  },
  radialCard: {
    padding: "28px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "20px"
  },
  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  chartContainer: {
    position: "relative",
    width: "180px",
    height: "180px",
    margin: "0 auto"
  },
  svgCircle: {
    transform: "rotate(-90deg)",
    width: "100%",
    height: "100%"
  },
  circleBg: {
    fill: "none",
    stroke: "rgba(255, 255, 255, 0.03)",
    strokeWidth: "8"
  },
  circleFill: {
    fill: "none",
    strokeWidth: "8",
    strokeLinecap: "round",
    strokeDasharray: "251.2",
    transition: "stroke-dashoffset 0.6s ease"
  },
  chartText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  percentNumber: {
    fontSize: "2.2rem",
    fontWeight: 800
  },
  percentLabel: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: "0.05em"
  },
  readinessDescription: {
    textAlign: "center",
    width: "100%",
    marginTop: "6px"
  },
  levelTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "4px"
  },
  levelDesc: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5"
  },
  breakdownCard: {
    padding: "28px",
    textAlign: "left"
  },
  sectionSub: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    marginBottom: "20px"
  },
  progressList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  progressRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    fontWeight: 600
  },
  progressLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px"
  },
  progressTrack: {
    width: "100%",
    height: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "5px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: "5px",
    transition: "width 0.6s ease"
  },
  historyCard: {
    padding: "28px",
    textAlign: "left"
  },
  tableScroller: {
    overflowX: "auto",
    width: "100%"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem"
  },
  tableHeaderRow: {
    borderBottom: "1px solid var(--border-color)"
  },
  th: {
    padding: "12px 16px",
    color: "var(--text-secondary)",
    fontWeight: 600,
    textAlign: "left",
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  tableRow: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
    transition: "background-color 0.2s ease"
  },
  td: {
    padding: "16px",
    color: "var(--text-primary)"
  },
  statusBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: "10px"
  },
  tableEmpty: {
    padding: "40px",
    textAlign: "center",
    color: "var(--text-secondary)",
    fontStyle: "italic"
  },
  dailyTasksCard: {
    padding: "28px",
    textAlign: "left",
    marginBottom: "28px"
  },
  dailyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px"
  },
  streakBadge: {
    fontSize: "0.85rem",
    fontWeight: 700,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    color: "var(--accent-amber)",
    padding: "4px 10px",
    borderRadius: "12px",
    border: "1px solid rgba(245, 158, 11, 0.25)"
  },
  dailyProgressBlock: {
    margin: "16px 0 24px 0",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  taskListGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px"
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s ease",
    userSelect: "none"
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease"
  },
  taskText: {
    textAlign: "left",
    flex: 1,
    minWidth: 0
  },
  taskLabel: {
    fontSize: "0.92rem",
    fontWeight: 600,
    margin: 0
  },
  taskDesc: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    margin: "2px 0 0 0"
  }
};
