import React, { useState, useEffect } from "react";
import {
  Users, HelpCircle, ShieldAlert, FileText, Search,
  Trash2, Plus, X, ShieldCheck, Mail, Download
} from "lucide-react";

export default function AdminDashboard({ showToast }) {
  // Tabs: 'students', 'intervention', 'questions', 'report', 'notifications'
  const [activeTab, setActiveTab] = useState("students");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Database Management states
  const [selectedPool, setSelectedPool] = useState("aptitude"); // 'aptitude', 'coding', 'companies', 'interview'
  const [poolData, setPoolData] = useState([]);

  // Database CRUD state modals
  const [showAddForm, setShowAddForm] = useState(false);

  // Student directory & dynamic databases states
  const [students, setStudents] = useState([]);

  // Placement notifications states
  const [notifications, setNotifications] = useState([]);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [newNotif, setNewNotif] = useState({
    company: "",
    role: "",
    package: "",
    cgpa: "6.0",
    branches: [],
    years: [],
    date: "",
    link: "",
    description: ""
  });

  // Load database items on mount/tab change
  useEffect(() => {
    loadDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPool, activeTab]);

  const loadDatabase = () => {
    // 1. Load Students
    const storedStudents = localStorage.getItem("prep_student_directory");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }

    // 2. Load Selected Questions Pool
    let key = "prep_db_aptitude";
    if (selectedPool === "coding") key = "prep_db_coding";
    else if (selectedPool === "companies") key = "prep_db_companies";
    else if (selectedPool === "interview") key = "prep_db_interview";

    const data = localStorage.getItem(key);
    setPoolData(data ? JSON.parse(data) : []);

    // 3. Load Notifications
    const storedNotifs = localStorage.getItem("prep_notifications");
    if (storedNotifs) {
      setNotifications(JSON.parse(storedNotifs));
    }
  };

  // Helper to calculate student Placement Readiness Index (PRI)
  const getReadinessScore = (student) => {
    let profileScore = 0;
    let aptitudeScore = 0;
    let codingScore = 0;
    let mockScore = 0;

    // A. Profile Completeness (25%)
    if (student.bio && student.bio.length > 20) profileScore += 5;
    if (student.resume) profileScore += 10;
    if (student.skills && student.skills.length > 0) {
      profileScore += Math.min(10, student.skills.length * 3);
    }

    // B. Aptitude Progress (25%)
    if (student.aptitudeStats && student.aptitudeStats.correct > 0) {
      aptitudeScore = Math.min(25, student.aptitudeStats.correct * 2);
    }

    // C. Coding Progress (25%)
    const codingCount = student.codingSolvedList ? student.codingSolvedList.length : 0;
    codingScore = Math.min(25, codingCount * 5);
    if (codingScore === 0 && student.skills && student.skills.length > 0) {
      codingScore = Math.min(15, student.skills.length * 3);
    }

    // D. Mock Test (25%)
    if (student.mockHistory && student.mockHistory.length > 0) {
      const highPct = Math.max(...student.mockHistory.map(h => h.percent));
      mockScore = Math.round((highPct / 100) * 25);
    }

    return profileScore + aptitudeScore + codingScore + mockScore;
  };

  // 1. Delete Item from CRUD database
  const handleDeleteItem = (itemId) => {
    if (!window.confirm("Are you sure you want to delete this database item? This action is irreversible.")) return;

    let key = "prep_db_aptitude";
    if (selectedPool === "coding") key = "prep_db_coding";
    else if (selectedPool === "companies") key = "prep_db_companies";
    else if (selectedPool === "interview") key = "prep_db_interview";

    const updated = poolData.filter(item => item.id !== itemId);
    localStorage.setItem(key, JSON.stringify(updated));
    setPoolData(updated);
    showToast("Item deleted from database.", "info");
  };

  const handleCreateNotification = (e) => {
    e.preventDefault();
    if (!newNotif.company || !newNotif.role || !newNotif.package || !newNotif.date || !newNotif.description) {
      showToast("Please fill in all required job details.", "error");
      return;
    }
    if (newNotif.branches.length === 0) {
      showToast("Please select at least one eligible branch.", "error");
      return;
    }
    if (newNotif.years.length === 0) {
      showToast("Please select at least one eligible year.", "error");
      return;
    }

    const cutoffCgpa = parseFloat(newNotif.cgpa);
    if (isNaN(cutoffCgpa) || cutoffCgpa < 0 || cutoffCgpa > 10) {
      showToast("Cutoff CGPA must be a number between 0.0 and 10.0.", "error");
      return;
    }

    const createdNotif = {
      id: "n_" + Date.now(),
      company: newNotif.company,
      role: newNotif.role,
      package: newNotif.package,
      eligibility: {
        cgpa: cutoffCgpa,
        branches: newNotif.branches,
        years: newNotif.years
      },
      date: newNotif.date,
      link: newNotif.link,
      description: newNotif.description
    };

    const updated = [...notifications, createdNotif];
    localStorage.setItem("prep_notifications", JSON.stringify(updated));
    setNotifications(updated);
    setShowNotificationForm(false);
    setNewNotif({
      company: "",
      role: "",
      package: "",
      cgpa: "6.0",
      branches: [],
      years: [],
      date: "",
      link: "",
      description: ""
    });
    showToast(`Posted drive announcement for ${createdNotif.company}!`, "success");
  };

  const handleDeleteNotification = (notifId) => {
    if (!window.confirm("Are you sure you want to delete this placement drive announcement?")) return;
    const updated = notifications.filter(n => n.id !== notifId);
    localStorage.setItem("prep_notifications", JSON.stringify(updated));
    setNotifications(updated);
    showToast("Placement drive announcement deleted.", "info");
  };

  // 2. Add New Question Forms handlers
  const [newApt, setNewApt] = useState({ question: "", cat: "Quantitative", optA: "", optB: "", optC: "", optD: "", correct: 0, explanation: "" });
  const [newCod, setNewCod] = useState({ title: "", diff: "Easy", desc: "", constraints: "", sampleInput: "", sampleOutput: "" });
  const [newComp, setNewComp] = useState({ name: "", diff: "Easy-Medium", overview: "", cutoff: "", rounds: "", focus: "" });
  const [newInt, setNewInt] = useState({ cat: "Technical", question: "", answer: "", keywords: "" });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    let key = "prep_db_aptitude";
    let newItem = { id: Date.now().toString() };

    if (selectedPool === "aptitude") {
      if (!newApt.question || !newApt.optA || !newApt.optB) {
        showToast("Please enter the question and options.", "error");
        return;
      }
      newItem = {
        ...newItem,
        category: newApt.cat,
        question: newApt.question,
        options: [newApt.optA, newApt.optB, newApt.optC, newApt.optD].filter(Boolean),
        correctAnswer: Number(newApt.correct),
        explanation: newApt.explanation
      };
      setNewApt({ question: "", cat: "Quantitative", optA: "", optB: "", optC: "", optD: "", correct: 0, explanation: "" });

    } else if (selectedPool === "coding") {
      key = "prep_db_coding";
      if (!newCod.title || !newCod.desc) {
        showToast("Please enter challenge title and problem description.", "error");
        return;
      }
      newItem = {
        ...newItem,
        title: newCod.title,
        difficulty: newCod.diff,
        description: newCod.desc,
        constraints: newCod.constraints || "None",
        inputFormat: "Standard inputs",
        outputFormat: "Standard output log",
        sampleInput: newCod.sampleInput,
        sampleOutput: newCod.sampleOutput,
        languages: {
          python: `def solve():\n    # Write your code here\n    pass`,
          java: `public class Solution {\n    public static void main(String[] args) {\n        // Write code here\n    }\n}`,
          c: `#include <stdio.h>\nint main() {\n    return 0;\n}`
        },
        testCases: [
          { input: newCod.sampleInput, expectedOutput: newCod.sampleOutput }
        ]
      };
      setNewCod({ title: "", diff: "Easy", desc: "", constraints: "", sampleInput: "", sampleOutput: "" });

    } else if (selectedPool === "companies") {
      key = "prep_db_companies";
      if (!newComp.name || !newComp.overview) {
        showToast("Please enter company name and description.", "error");
        return;
      }
      newItem = {
        ...newItem,
        name: newComp.name,
        difficulty: newComp.diff,
        overview: newComp.overview,
        cutoff: newComp.cutoff || "60%",
        rounds: newComp.rounds.split(",").map(r => r.trim()).filter(Boolean),
        focusAreas: newComp.focus.split(",").map(f => f.trim()).filter(Boolean),
        interviewQuestions: []
      };
      setNewComp({ name: "", diff: "Easy-Medium", overview: "", cutoff: "", rounds: "", focus: "" });

    } else if (selectedPool === "interview") {
      key = "prep_db_interview";
      if (!newInt.question || !newInt.answer) {
        showToast("Please enter interview question and model answer.", "error");
        return;
      }
      newItem = {
        ...newItem,
        category: newInt.cat,
        question: newInt.question,
        modelAnswer: newInt.answer,
        keywords: newInt.keywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean)
      };
      setNewInt({ cat: "Technical", question: "", answer: "", keywords: "" });
    }

    const updated = [...poolData, newItem];
    localStorage.setItem(key, JSON.stringify(updated));
    setPoolData(updated);
    setShowAddForm(false);
    showToast("Database item added successfully.", "success");
  };

  // 3. Low Performance Intervention Advisory Email
  const [sendingEmail, setSendingEmail] = useState(null); // stores email address being sent to

  const handleSendAdvisory = (email, name) => {
    setSendingEmail(email);
    showToast(`Drafting placement warning alert for ${name}...`, "info");

    setTimeout(() => {
      setSendingEmail(null);
      showToast(`Advisory alert dispatched to ${email}!`, "success");
    }, 1800);
  };

  // Statistics for Placement Report
  const getAggregates = () => {
    if (students.length === 0) return { total: 0, avgPri: 0, passRate: 0, needsHelp: 0 };

    let totalScore = 0;
    let passingCount = 0;
    let helpCount = 0;

    students.forEach(s => {
      const pri = getReadinessScore(s);
      totalScore += pri;
      if (pri >= 60) passingCount += 1;
      if (pri < 60) helpCount += 1;
    });

    return {
      total: students.length,
      avgPri: Math.round(totalScore / students.length),
      passRate: Math.round((passingCount / students.length) * 100),
      needsHelp: helpCount
    };
  };

  const stats = getAggregates();

  // Filter students based on search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Filter students needing improvement (PRI < 60%)
  const needingImprovement = students.filter(s => getReadinessScore(s) < 60);

  // Printable Report Layout trigger
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div style={styles.container} className="animate-slide-up">

      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Users size={28} color="var(--brand-primary)" />
          <div>
            <h2 style={styles.adminTitle}>Admin Workspace</h2>
            <p style={styles.adminSubtitle}>Manage practice modules, inspect student metrics, and export recruitment rosters.</p>
          </div>
        </div>
        <div className="badge">
          <ShieldCheck size={14} style={{ marginRight: 4 }} /> Database Sandbox Node
        </div>
      </div>

      {/* ADMIN ROUTING TABS */}
      <div className="glass-panel" style={styles.tabBar}>
        {[
          { id: "students", label: "Student Directory", icon: <Users size={16} /> },
          { id: "intervention", label: "Intervention Desk", icon: <ShieldAlert size={16} /> },
          { id: "questions", label: "Manage Database", icon: <HelpCircle size={16} /> },
          { id: "report", label: "Placement Analytics", icon: <FileText size={16} /> },
          { id: "notifications", label: "Placement Jobs", icon: <Mail size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tabBtn,
              background: activeTab === tab.id ? "var(--brand-gradient)" : "transparent",
              color: activeTab === tab.id ? "#ffffff" : "var(--text-secondary)",
              borderColor: activeTab === tab.id ? "transparent" : "var(--border-color)"
            }}
            onClick={() => { setActiveTab(tab.id); setSelectedStudent(null); }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT VIEWS */}

      {/* 1. STUDENT DIRECTORY */}
      {activeTab === "students" && (
        <div style={styles.tabContent}>
          <div style={styles.searchBarRow}>
            <div style={styles.searchContainer}>
              <Search size={18} style={styles.searchIcon} />
              <input
                type="text"
                className="input-field"
                placeholder="Search student by name or department..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.directoryLayout}>
            {/* Student Directory Table */}
            <div className="glass-panel" style={{ ...styles.tableCard, flex: selectedStudent ? 1.5 : 1 }}>
              <div style={styles.tableScroller}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Year</th>
                      <th style={styles.th}>Readiness Score</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const pri = getReadinessScore(student);
                      return (
                        <tr key={student.email} style={styles.tableRow}>
                          <td style={styles.td}>
                            <strong>{student.name}</strong>
                            <p style={styles.studentEmailText}>{student.email}</p>
                          </td>
                          <td style={styles.td}>{student.department}</td>
                          <td style={styles.td}>{student.year}</td>
                          <td style={styles.td}>
                            <span style={{
                              color: pri >= 75 ? "var(--accent-emerald)" : pri >= 60 ? "var(--brand-accent)" : "var(--accent-rose)",
                              fontWeight: 700
                            }}>{pri}%</span>
                          </td>
                          <td style={styles.td}>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={styles.actionBtnSmall}
                              onClick={() => setSelectedStudent(student)}
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="5" style={styles.tableEmpty}>
                          No students matching search filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Student Drill-Down Profile Card */}
            {selectedStudent && (
              <div className="glass-panel animate-fade-in" style={styles.drillDownCard}>
                <div style={styles.drillHeader}>
                  <h3 style={styles.drillTitle}>Student Progress Profile</h3>
                  <button style={styles.closeDrillBtn} onClick={() => setSelectedStudent(null)}>
                    <X size={16} />
                  </button>
                </div>

                <div style={styles.scroller}>
                  <div style={styles.drillMeta}>
                    <div style={styles.avatarLarge}>{selectedStudent.name.charAt(0).toUpperCase()}</div>
                    <h4 style={styles.drillName}>{selectedStudent.name}</h4>
                    <p style={styles.drillMetaText}>
                      {selectedStudent.year} • {selectedStudent.department} • CGPA: {selectedStudent.cgpa !== undefined ? selectedStudent.cgpa.toFixed(2) : "8.00"}
                    </p>
                    <p style={styles.drillScoreText}>
                      Placement Readiness Score: <strong style={{ color: "var(--brand-primary)" }}>{getReadinessScore(selectedStudent)}%</strong>
                    </p>
                  </div>

                  <div style={styles.drillSection}>
                    <h4 style={styles.drillSubTitle}>Biography</h4>
                    <p style={styles.drillBioText}>"{selectedStudent.bio}"</p>
                  </div>

                  <div style={styles.drillSection}>
                    <h4 style={styles.drillSubTitle}>Skills Chips</h4>
                    <div style={styles.chipsRow}>
                      {selectedStudent.skills.map((skill, i) => (
                        <span key={i} className="badge" style={styles.drillSkillBadge}>{skill}</span>
                      ))}
                      {selectedStudent.skills.length === 0 && <span style={styles.emptyLabel}>No skills registered</span>}
                    </div>
                  </div>

                  <div style={styles.drillSection}>
                    <h4 style={styles.drillSubTitle}>Projects</h4>
                    {selectedStudent.projects.map((proj, i) => (
                      <div className="glass-card" key={i} style={styles.drillProjectCard}>
                        <h5 style={styles.drillProjTitle}>{proj.title}</h5>
                        <p style={styles.drillProjDesc}>{proj.desc}</p>
                      </div>
                    ))}
                    {selectedStudent.projects.length === 0 && <p style={styles.emptyLabel}>No projects documented</p>}
                  </div>

                  <div style={styles.drillSection}>
                    <h4 style={styles.drillSubTitle}>Daily Placement Tasks Progress</h4>
                    {selectedStudent.dailyTasks ? (
                      <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-amber)" }}>🔥 Streak: {selectedStudent.dailyTasks.streak} Days</span>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            {Object.values(selectedStudent.dailyTasks.completed || {}).filter(Boolean).length} / 5 Completed
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                          {[
                            { id: "apt", label: "Aptitude Practice" },
                            { id: "coding", label: "Coding Arena" },
                            { id: "interview", label: "Interview Topic" },
                            { id: "jobs", label: "Job Board Checks" },
                            { id: "profile", label: "Profile Maintenance" }
                          ].map(t => {
                            const isCompleted = selectedStudent.dailyTasks.completed && selectedStudent.dailyTasks.completed[t.id];
                            return (
                              <div key={t.id} style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "8px", 
                                fontSize: "0.8rem", 
                                color: isCompleted ? "var(--accent-emerald)" : "var(--text-secondary)"
                              }}>
                                <span style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: isCompleted ? "var(--accent-emerald)" : "rgba(255, 255, 255, 0.15)"
                                }} />
                                <span style={{ textDecoration: isCompleted ? "line-through" : "none" }}>{t.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p style={styles.emptyLabel}>No daily task activity recorded.</p>
                    )}
                  </div>

                  <div style={styles.drillSection}>
                    <h4 style={styles.drillSubTitle}>Mock Exam Attempts History</h4>
                    <div style={styles.historyList}>
                      {selectedStudent.mockHistory && selectedStudent.mockHistory.map((h, i) => (
                        <div key={i} style={styles.historyItemRow}>
                          <div style={styles.historyMeta}>
                            <span>{h.date}</span>
                            <small style={{ color: "var(--text-secondary)" }}>{h.warnings} warnings</small>
                          </div>
                          <span style={{
                            color: h.percent >= 60 ? "var(--accent-emerald)" : "var(--accent-rose)",
                            fontWeight: 700
                          }}>{h.percent}%</span>
                        </div>
                      ))}
                      {(!selectedStudent.mockHistory || selectedStudent.mockHistory.length === 0) && (
                        <p style={styles.emptyLabel}>No mock exams attempted yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. INTERVENTION DESK */}
      {activeTab === "intervention" && (
        <div className="glass-panel" style={styles.tabContentCard}>
          <h3 style={styles.panelTitle}><ShieldAlert size={18} color="var(--accent-rose)" /> Placement Assistance Alerts</h3>
          <p style={styles.sectionSub}>The following students have a Readiness Score below the 60% placement threshold. Immediate advisories are recommended.</p>

          <div style={styles.tableScroller}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Current Score</th>
                  <th style={styles.th}>Status Alert</th>
                  <th style={styles.th}>Intervention Actions</th>
                </tr>
              </thead>
              <tbody>
                {needingImprovement.map(student => {
                  const pri = getReadinessScore(student);
                  const isSending = sendingEmail === student.email;

                  return (
                    <tr key={student.email} style={styles.tableRow}>
                      <td style={styles.td}>
                        <strong>{student.name}</strong>
                        <p style={styles.studentEmailText}>{student.email}</p>
                      </td>
                      <td style={styles.td}>{student.department}</td>
                      <td style={styles.td}>
                        <strong style={{ color: "var(--accent-rose)" }}>{pri}%</strong>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          color: "var(--accent-rose)",
                          backgroundColor: "rgba(244, 63, 94, 0.15)"
                        }}>
                          Critically Low Readiness
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          className="btn btn-danger btn-sm"
                          style={styles.actionBtnSmall}
                          onClick={() => handleSendAdvisory(student.email, student.name)}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <>Sending...</>
                          ) : (
                            <>
                              <Mail size={14} style={{ marginRight: 6 }} /> Email Placement Warning
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {needingImprovement.length === 0 && (
                  <tr>
                    <td colSpan="5" style={styles.tableEmpty}>
                      Excellent! No students currently fall below the 60% readiness threshold.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MANAGE DATABASE */}
      {activeTab === "questions" && (
        <div style={styles.tabContent}>
          {/* POOLS SELECT SWITCHER */}
          <div className="glass-panel" style={styles.poolSwitcher}>
            <div style={styles.headerLeft}>
              {[
                { id: "aptitude", label: "Aptitude Pool" },
                { id: "coding", label: "Coding Pool" },
                { id: "companies", label: "Recruiter Profiles" },
                { id: "interview", label: "Interview Q&A" }
              ].map(pool => (
                <button
                  key={pool.id}
                  style={{
                    ...styles.poolTabBtn,
                    background: selectedPool === pool.id ? "var(--bg-accent)" : "transparent",
                    color: selectedPool === pool.id ? "var(--brand-primary)" : "var(--text-secondary)",
                    borderColor: selectedPool === pool.id ? "var(--brand-primary)" : "transparent"
                  }}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  {pool.label}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              <Plus size={16} /> Add New Entry
            </button>
          </div>

          {/* ADD ENTRY FORM ELEMENT (MODAL EXPANDABLE CARD) */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="glass-panel animate-fade-in" style={styles.addFormCard}>
              <div style={styles.drillHeader}>
                <h3 style={styles.formTitle}>Add New {selectedPool.charAt(0).toUpperCase() + selectedPool.slice(1)} Entry</h3>
                <button type="button" style={styles.closeDrillBtn} onClick={() => setShowAddForm(false)}>
                  <X size={16} />
                </button>
              </div>

              {/* DYNAMIC FORMS BASED ON SELECTED POOL */}
              {selectedPool === "aptitude" && (
                <div style={styles.formGrid}>
                  <div className="input-group">
                    <label className="input-label">Category</label>
                    <select className="input-field select-field" value={newApt.cat} onChange={e => setNewApt({ ...newApt, cat: e.target.value })}>
                      <option value="Quantitative">Quantitative Ability</option>
                      <option value="Logical">Logical Reasoning</option>
                      <option value="Verbal">Verbal Ability</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Question Text</label>
                    <textarea rows="3" className="input-field" placeholder="A train running at speed..." value={newApt.question} onChange={e => setNewApt({ ...newApt, question: e.target.value })} style={styles.textarea} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Option A</label>
                    <input type="text" className="input-field" placeholder="Option A" value={newApt.optA} onChange={e => setNewApt({ ...newApt, optA: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Option B</label>
                    <input type="text" className="input-field" placeholder="Option B" value={newApt.optB} onChange={e => setNewApt({ ...newApt, optB: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Option C</label>
                    <input type="text" className="input-field" placeholder="Option C" value={newApt.optC} onChange={e => setNewApt({ ...newApt, optC: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Option D</label>
                    <input type="text" className="input-field" placeholder="Option D" value={newApt.optD} onChange={e => setNewApt({ ...newApt, optD: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Correct Option</label>
                    <select className="input-field select-field" value={newApt.correct} onChange={e => setNewApt({ ...newApt, correct: e.target.value })}>
                      <option value="0">A</option>
                      <option value="1">B</option>
                      <option value="2">C</option>
                      <option value="3">D</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Mathematical Explanation</label>
                    <textarea rows="3" className="input-field" placeholder="Step-by-step walkthrough..." value={newApt.explanation} onChange={e => setNewApt({ ...newApt, explanation: e.target.value })} style={styles.textarea} />
                  </div>
                </div>
              )}

              {selectedPool === "coding" && (
                <div style={styles.formGrid}>
                  <div className="input-group">
                    <label className="input-label">Problem Title</label>
                    <input type="text" className="input-field" placeholder="e.g. Reverse List" value={newCod.title} onChange={e => setNewCod({ ...newCod, title: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Difficulty</label>
                    <select className="input-field select-field" value={newCod.diff} onChange={e => setNewCod({ ...newCod, diff: e.target.value })}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Problem Statement</label>
                    <textarea rows="4" className="input-field" placeholder="Write a program to..." value={newCod.desc} onChange={e => setNewCod({ ...newCod, desc: e.target.value })} style={styles.textarea} />
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Constraints</label>
                    <input type="text" className="input-field" placeholder="e.g. N <= 10^5" value={newCod.constraints} onChange={e => setNewCod({ ...newCod, constraints: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Sample Input</label>
                    <input type="text" className="input-field" placeholder="Input variables" value={newCod.sampleInput} onChange={e => setNewCod({ ...newCod, sampleInput: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Sample Expected Output</label>
                    <input type="text" className="input-field" placeholder="Output expected" value={newCod.sampleOutput} onChange={e => setNewCod({ ...newCod, sampleOutput: e.target.value })} />
                  </div>
                </div>
              )}

              {selectedPool === "companies" && (
                <div style={styles.formGrid}>
                  <div className="input-group">
                    <label className="input-label">Company Name</label>
                    <input type="text" className="input-field" placeholder="e.g. Microsoft" value={newComp.name} onChange={e => setNewComp({ ...newComp, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Recruiter Grade</label>
                    <select className="input-field select-field" value={newComp.diff} onChange={e => setNewComp({ ...newComp, diff: e.target.value })}>
                      <option value="Easy-Medium">Easy-Medium</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Overview Description</label>
                    <textarea rows="3" className="input-field" placeholder="Recruitment pattern overview..." value={newComp.overview} onChange={e => setNewComp({ ...newComp, overview: e.target.value })} style={styles.textarea} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Cutoff Score</label>
                    <input type="text" className="input-field" placeholder="e.g. 70% in coding OA" value={newComp.cutoff} onChange={e => setNewComp({ ...newComp, cutoff: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Recruitment Stages (comma separated)</label>
                    <input type="text" className="input-field" placeholder="e.g. Round 1: Coding, Round 2: HR" value={newComp.rounds} onChange={e => setNewComp({ ...newComp, rounds: e.target.value })} />
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Focus Areas (comma separated)</label>
                    <input type="text" className="input-field" placeholder="e.g. Data Structures, SQL, OS" value={newComp.focus} onChange={e => setNewComp({ ...newComp, focus: e.target.value })} />
                  </div>
                </div>
              )}

              {selectedPool === "interview" && (
                <div style={styles.formGrid}>
                  <div className="input-group">
                    <label className="input-label">Interview Category</label>
                    <select className="input-field select-field" value={newInt.cat} onChange={e => setNewInt({ ...newInt, cat: e.target.value })}>
                      <option value="Technical">Technical</option>
                      <option value="HR">HR / Behavioral</option>
                      <option value="System Design">System Design</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Question</label>
                    <input type="text" className="input-field" placeholder="Question text..." value={newInt.question} onChange={e => setNewInt({ ...newInt, question: e.target.value })} />
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Model Solution Answer</label>
                    <textarea rows="5" className="input-field" placeholder="Key points..." value={newInt.answer} onChange={e => setNewInt({ ...newInt, answer: e.target.value })} style={styles.textarea} />
                  </div>
                  <div className="input-group" style={{ gridColumn: "span 2" }}>
                    <label className="input-label">Core Match Keywords (comma separated)</label>
                    <input type="text" className="input-field" placeholder="e.g. lock, threads, memory" value={newInt.keywords} onChange={e => setNewInt({ ...newInt, keywords: e.target.value })} />
                  </div>
                </div>
              )}

              <div style={styles.formFooter}>
                <button type="submit" className="btn btn-primary">Save New Entry</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* POOL DATABASE ROSTER */}
          <div className="glass-panel" style={styles.poolRosterCard}>
            <div style={styles.tableScroller}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.th, width: "80%" }}>Entry Details</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {poolData.map((item, idx) => (
                    <tr key={item.id || idx} style={styles.tableRow}>
                      <td style={styles.td}>
                        {selectedPool === "aptitude" && (
                          <div>
                            <span className="badge" style={{ marginBottom: 6 }}>{item.category} Ability</span>
                            <h4 style={styles.poolEntryText}>{item.question}</h4>
                            <p style={styles.poolSubText}>Options: {item.options ? item.options.join(", ") : ""}</p>
                          </div>
                        )}
                        {selectedPool === "coding" && (
                          <div>
                            <span className="badge" style={{ marginBottom: 6 }}>{item.difficulty} Challenge</span>
                            <h4 style={styles.poolEntryText}>{item.title}</h4>
                            <p style={styles.poolSubText}>{item.description ? item.description.substring(0, 100) : ""}...</p>
                          </div>
                        )}
                        {selectedPool === "companies" && (
                          <div>
                            <span className="badge" style={{ marginBottom: 6 }}>Cutoff: {item.cutoff}</span>
                            <h4 style={styles.poolEntryText}>{item.name}</h4>
                            <p style={styles.poolSubText}>{item.overview ? item.overview.substring(0, 100) : ""}...</p>
                          </div>
                        )}
                        {selectedPool === "interview" && (
                          <div>
                            <span className="badge" style={{ marginBottom: 6 }}>{item.category} Preparation</span>
                            <h4 style={styles.poolEntryText}>{item.question}</h4>
                            <p style={styles.poolSubText}>Keywords: {item.keywords ? item.keywords.join(", ") : ""}</p>
                          </div>
                        )}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: "rgba(244,63,94,0.15)", color: "var(--accent-rose)" }}
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={14} style={{ marginRight: 4 }} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {poolData.length === 0 && (
                    <tr>
                      <td colSpan="2" style={styles.tableEmpty}>
                        Database pool is empty. Click 'Add New Entry' to seed questions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. PLACEMENT ANALYTICS & PRINTABLE REPORT */}
      {activeTab === "report" && (
        <div style={styles.tabContent}>
          {/* STATS OVERVIEW CARDS */}
          <div style={styles.statsOverviewCardsGrid}>
            <div className="glass-panel" style={styles.summaryBox}>
              <p style={styles.summaryLabel}>Total Students</p>
              <h2 style={styles.summaryHuge}>{stats.total}</h2>
            </div>
            <div className="glass-panel" style={styles.summaryBox}>
              <p style={styles.summaryLabel}>Average Readiness Index</p>
              <h2 style={{ ...styles.summaryHuge, color: "var(--brand-primary)" }}>{stats.avgPri}%</h2>
            </div>
            <div className="glass-panel" style={styles.summaryBox}>
              <p style={styles.summaryLabel}>Job Ready (PRI &gt;= 60%)</p>
              <h2 style={{ ...styles.summaryHuge, color: "var(--accent-emerald)" }}>{stats.passRate}%</h2>
            </div>
            <div className="glass-panel" style={styles.summaryBox}>
              <p style={styles.summaryLabel}>Needs Intervention</p>
              <h2 style={{ ...styles.summaryHuge, color: "var(--accent-rose)" }}>{stats.needsHelp}</h2>
            </div>
          </div>

          {/* REPORT VIEWER & EXPORT */}
          <div className="glass-panel" style={styles.reportPreviewCard}>
            <div style={styles.reportHeaderRow}>
              <h3 style={styles.panelTitle}>Placement Readiness Roster Summary</h3>
              <button className="btn btn-primary" onClick={handlePrintReport}>
                <Download size={16} /> Print / Export PDF Report
              </button>
            </div>

            {/* PRINT-FRIENDLY CONTAINER SHEET */}
            <div id="printable-placement-report" style={styles.printSheet}>
              {/* Header inside the printable sheet */}
              <div style={styles.printHeader}>
                <h2 style={styles.printReportTitle}>PREPXPERT CAMPUS PLACEMENT READINESS REPORT</h2>
                <p style={styles.printReportMeta}>Generated on: {new Date().toLocaleDateString()} • University Administration</p>
              </div>

              <div style={styles.printDivider} />

              <h3 style={styles.printSubTitle}>Roster Summary Metrics</h3>
              <div style={styles.printStatsGrid}>
                <div style={styles.printStatBox}>
                  <span style={styles.printStatLabel}>Total Student Candidates:</span>
                  <strong style={styles.printStatVal}>{stats.total}</strong>
                </div>
                <div style={styles.printStatBox}>
                  <span style={styles.printStatLabel}>Average Readiness Index:</span>
                  <strong style={styles.printStatVal}>{stats.avgPri}%</strong>
                </div>
                <div style={styles.printStatBox}>
                  <span style={styles.printStatLabel}>Placement Eligible (PRI &gt;= 60%):</span>
                  <strong style={styles.printStatVal}>{stats.passRate}%</strong>
                </div>
                <div style={styles.printStatBox}>
                  <span style={styles.printStatLabel}>Attention Required (PRI &lt; 60%):</span>
                  <strong style={{ ...styles.printStatVal, color: "#e11d48" }}>{stats.needsHelp}</strong>
                </div>
              </div>

              <h3 style={styles.printSubTitle}>Student Candidates Standings</h3>
              <table style={styles.printTable}>
                <thead>
                  <tr style={styles.printTableHeaderRow}>
                    <th style={styles.printTh}>Candidate Name</th>
                    <th style={styles.printTh}>Department</th>
                    <th style={styles.printTh}>Skills Verified</th>
                    <th style={styles.printTh}>Mock Test High</th>
                    <th style={styles.printTh}>Readiness Index</th>
                    <th style={styles.printTh}>Status Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const pri = getReadinessScore(s);
                    const highTest = s.mockHistory && s.mockHistory.length > 0
                      ? Math.max(...s.mockHistory.map(h => h.percent)) + "%"
                      : "No tests";

                    return (
                      <tr key={s.email} style={styles.printTableRow}>
                        <td style={styles.printTd}><strong>{s.name}</strong></td>
                        <td style={styles.printTd}>{s.department}</td>
                        <td style={styles.printTd}>{s.skills.join(", ")}</td>
                        <td style={styles.printTd}>{highTest}</td>
                        <td style={styles.printTd}><strong>{pri}%</strong></td>
                        <td style={styles.printTd}>
                          <span style={{
                            color: pri >= 75 ? "#059669" : pri >= 60 ? "#7c3aed" : "#e11d48",
                            fontWeight: 700
                          }}>
                            {pri >= 75 ? "Direct Eligible" : pri >= 60 ? "Eligible" : "Needs Review"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Signatures Row */}
              <div style={styles.printSignatureRow}>
                <div style={styles.signatureBox}>
                  <div style={styles.sigLine} />
                  <span>Prepared by: Placement Coordinator</span>
                </div>
                <div style={styles.signatureBox}>
                  <div style={styles.sigLine} />
                  <span>Approved by: Dean of Placements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PLACEMENT JOB ANNOUNCEMENTS CRUD PANEL */}
      {activeTab === "notifications" && (
        <div style={styles.tabContent}>
          <div style={styles.headerRowSpace}>
            <div>
              <h3 style={styles.panelTitle}><Mail size={18} color="var(--brand-primary)" /> Placement Drive Postings</h3>
              <p style={{ ...styles.sectionSub, marginTop: 4 }}>Manage and publish campus recruitment drives and cutoff requirements.</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowNotificationForm(!showNotificationForm)}
            >
              {showNotificationForm ? "Hide Announcement Form" : "Post Placement Announcement"}
            </button>
          </div>

          {/* Announcement creation form */}
          {showNotificationForm && (
            <form onSubmit={handleCreateNotification} className="glass-panel" style={styles.addFormCard}>
              <h4 style={styles.formSectionTitle}>Create Job Drive Announcement</h4>
              
              <div style={styles.formGrid}>
                <div className="input-group">
                  <label className="input-label">Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Google India"
                    className="input-field"
                    value={newNotif.company}
                    onChange={e => setNewNotif({ ...newNotif, company: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Job Role / Designation *</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer Intern"
                    className="input-field"
                    value={newNotif.role}
                    onChange={e => setNewNotif({ ...newNotif, role: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Salary Package / CTC *</label>
                  <input
                    type="text"
                    placeholder="e.g. 18.5 LPA"
                    className="input-field"
                    value={newNotif.package}
                    onChange={e => setNewNotif({ ...newNotif, package: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">CGPA Cutoff (0.0 - 10.0) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g. 7.5"
                    className="input-field"
                    value={newNotif.cgpa}
                    onChange={e => setNewNotif({ ...newNotif, cgpa: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Drive Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newNotif.date}
                    onChange={e => setNewNotif({ ...newNotif, date: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Apply Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="input-field"
                    value={newNotif.link}
                    onChange={e => setNewNotif({ ...newNotif, link: e.target.value })}
                  />
                </div>
              </div>

              {/* BRANCH SELECTION CHECKBOXES */}
              <div className="input-group" style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                <label className="input-label">Eligible Branches *</label>
                <div style={styles.checkboxGroup}>
                  {[
                    "Computer Science",
                    "Information Technology",
                    "Artificial Intelligence & Data Science",
                    "Civil Engineering",
                    "Mechanical Engineering",
                    "Electrical & Electronics Engineering",
                    "Electronics & Communication Engineering"
                  ].map(branch => (
                    <label key={branch} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={newNotif.branches.includes(branch)}
                        onChange={e => {
                          const branches = e.target.checked
                            ? [...newNotif.branches, branch]
                            : newNotif.branches.filter(b => b !== branch);
                          setNewNotif({ ...newNotif, branches });
                        }}
                      />
                      <span>{branch}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* YEAR SELECTION CHECKBOXES */}
              <div className="input-group" style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                <label className="input-label">Eligible Batches / Years *</label>
                <div style={styles.checkboxGroup}>
                  {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(year => (
                    <label key={year} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={newNotif.years.includes(year)}
                        onChange={e => {
                          const years = e.target.checked
                            ? [...newNotif.years, year]
                            : newNotif.years.filter(y => y !== year);
                          setNewNotif({ ...newNotif, years });
                        }}
                      />
                      <span>{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">Job Description & Skills Requirement *</label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Enter full job specifications, skills required, interview details..."
                  value={newNotif.description}
                  onChange={e => setNewNotif({ ...newNotif, description: e.target.value })}
                  required
                />
              </div>

              <div style={styles.formFooter}>
                <button type="submit" className="btn btn-primary">Publish Announcement</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowNotificationForm(false);
                    setNewNotif({
                      company: "",
                      role: "",
                      package: "",
                      cgpa: "6.0",
                      branches: [],
                      years: [],
                      date: "",
                      link: "",
                      description: ""
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ACTIVE DRIVES TABLE */}
          <div className="glass-panel" style={styles.tableCard}>
            <div style={styles.tableScroller}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Job Profile & Company</th>
                    <th style={styles.th}>Package</th>
                    <th style={styles.th}>Cutoff CGPA</th>
                    <th style={styles.th}>Eligible Targets</th>
                    <th style={styles.th}>Drive Date</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif, idx) => (
                    <tr key={notif.id || idx} style={styles.tableRow}>
                      <td style={styles.td}>
                        <strong>{notif.role}</strong>
                        <p style={{ color: "var(--brand-accent)", fontSize: "0.82rem", marginTop: 2 }}>{notif.company}</p>
                      </td>
                      <td style={styles.td}>
                        <span className="badge" style={{ fontSize: "0.8rem", padding: "4px 8px" }}>{notif.package}</span>
                      </td>
                      <td style={styles.td}>
                        <strong style={{ color: "var(--accent-amber)" }}>{notif.eligibility?.cgpa} CGPA</strong>
                      </td>
                      <td style={{ ...styles.td, maxWidth: 280, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        <p><strong>Branches:</strong> {notif.eligibility?.branches?.join(", ")}</p>
                        <p style={{ marginTop: 2 }}><strong>Years:</strong> {notif.eligibility?.years?.join(", ")}</p>
                      </td>
                      <td style={styles.td}>{notif.date}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: "rgba(244,63,94,0.15)", color: "var(--accent-rose)" }}
                          onClick={() => handleDeleteNotification(notif.id)}
                        >
                          <Trash2 size={14} style={{ marginRight: 4 }} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {notifications.length === 0 && (
                    <tr>
                      <td colSpan="6" style={styles.tableEmpty}>
                        No placement announcements published. Use the panel above to post new job drives.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderRadius: "16px",
    background: "var(--bg-secondary)",
    border: "var(--glass-border)",
    backdropFilter: "var(--glass-blur)",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
    textAlign: "left"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },
  adminSubtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.88rem"
  },
  tabBar: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    borderRadius: "14px",
    marginBottom: "28px",
    flexWrap: "wrap"
  },
  tabBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease"
  },
  tabContent: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  tabContentCard: {
    padding: "28px",
    textAlign: "left"
  },
  panelTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--text-primary)"
  },
  searchBarRow: {
    display: "flex",
    justifyContent: "flex-start"
  },
  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "450px"
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    color: "var(--text-secondary)",
    pointerEvents: "none"
  },
  searchInput: {
    paddingLeft: "42px"
  },
  directoryLayout: {
    display: "flex",
    gap: "28px",
    alignItems: "flex-start"
  },
  tableCard: {
    padding: "24px",
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
    borderBottom: "1px solid rgba(255, 255, 255, 0.02)"
  },
  td: {
    padding: "16px",
    color: "var(--text-primary)"
  },
  studentEmailText: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    marginTop: "2px"
  },
  actionBtnSmall: {
    padding: "6px 12px",
    fontSize: "0.8rem"
  },
  tableEmpty: {
    padding: "40px",
    textAlign: "center",
    color: "var(--text-secondary)",
    fontStyle: "italic"
  },
  drillDownCard: {
    width: "360px",
    padding: "24px",
    textAlign: "left",
    maxHeight: "680px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0
  },
  drillHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "12px",
    marginBottom: "16px"
  },
  drillTitle: {
    fontSize: "1.05rem",
    fontWeight: 700
  },
  closeDrillBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "4px"
  },
  scroller: {
    overflowY: "auto",
    flexGrow: 1,
    paddingRight: "4px"
  },
  drillMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    textAlign: "center",
    marginBottom: "20px"
  },
  avatarLarge: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "var(--brand-gradient)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    fontWeight: 700
  },
  drillName: {
    fontSize: "1.15rem",
    fontWeight: 700
  },
  drillMetaText: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)"
  },
  drillScoreText: {
    fontSize: "0.85rem"
  },
  drillSection: {
    marginBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
    paddingBottom: "16px"
  },
  drillSubTitle: {
    fontSize: "0.88rem",
    color: "var(--brand-primary)",
    fontWeight: 700,
    marginBottom: "8px"
  },
  drillBioText: {
    fontSize: "0.85rem",
    lineHeight: "1.5",
    color: "var(--text-secondary)"
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px"
  },
  drillSkillBadge: {
    fontSize: "0.78rem",
    padding: "4px 8px"
  },
  emptyLabel: {
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    fontStyle: "italic"
  },
  drillProjectCard: {
    padding: "10px 14px",
    marginBottom: "8px",
    textAlign: "left"
  },
  drillProjTitle: {
    fontSize: "0.85rem",
    fontWeight: 600
  },
  drillProjDesc: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    marginTop: "4px"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  historyItemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.82rem",
    padding: "6px 10px",
    background: "rgba(255,255,255,0.01)",
    borderRadius: "6px",
    border: "var(--glass-border)"
  },
  historyMeta: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  statusBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: "10px"
  },
  sectionSub: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    marginBottom: "16px"
  },
  poolSwitcher: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    borderRadius: "12px",
    flexWrap: "wrap",
    gap: "16px"
  },
  poolTabBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  addFormCard: {
    padding: "24px",
    textAlign: "left"
  },
  formTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--brand-accent)"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px"
  },
  textarea: {
    resize: "none"
  },
  formFooter: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end"
  },
  poolRosterCard: {
    padding: "20px 24px",
    textAlign: "left"
  },
  poolEntryText: {
    fontSize: "0.95rem",
    fontWeight: 600,
    lineHeight: "1.4"
  },
  poolSubText: {
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    marginTop: "4px"
  },
  statsOverviewCardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "28px"
  },
  summaryBox: {
    padding: "20px",
    textAlign: "center"
  },
  summaryLabel: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    fontWeight: 600,
    letterSpacing: "0.05em",
    marginBottom: "8px"
  },
  summaryHuge: {
    fontSize: "2.4rem",
    fontWeight: 800
  },
  reportPreviewCard: {
    padding: "28px",
    textAlign: "left"
  },
  reportHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "14px",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px"
  },
  printSheet: {
    background: "#ffffff",
    color: "#1e1b29",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
  },
  printHeader: {
    textAlign: "center",
    marginBottom: "20px"
  },
  printReportTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#110e1b",
    letterSpacing: "0.02em"
  },
  printReportMeta: {
    fontSize: "0.82rem",
    color: "#5b5668",
    marginTop: "4px"
  },
  printDivider: {
    height: "2px",
    backgroundColor: "#110e1b",
    marginBottom: "24px"
  },
  printSubTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#110e1b",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    textAlign: "left"
  },
  printStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px"
  },
  printStatBox: {
    border: "1px solid #dcdbe0",
    padding: "12px",
    textAlign: "center",
    borderRadius: "6px"
  },
  printStatLabel: {
    display: "block",
    fontSize: "0.75rem",
    color: "#5b5668",
    marginBottom: "6px"
  },
  printStatVal: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#110e1b"
  },
  printTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.82rem",
    marginBottom: "32px"
  },
  printTableHeaderRow: {
    borderBottom: "2px solid #110e1b"
  },
  printTh: {
    padding: "10px",
    fontWeight: 700,
    color: "#110e1b",
    textAlign: "left"
  },
  printTableRow: {
    borderBottom: "1px solid #e7e6ea"
  },
  printTd: {
    padding: "12px 10px",
    color: "#383446"
  },
  printSignatureRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
    paddingTop: "20px"
  },
  signatureBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "220px",
    fontSize: "0.78rem",
    color: "#5b5668"
  },
  sigLine: {
    width: "100%",
    height: "1px",
    backgroundColor: "#7e788c",
    marginBottom: "6px"
  },
  headerRowSpace: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  checkboxGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.01)",
    border: "var(--glass-border)",
    borderRadius: "10px",
    marginTop: "4px"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    cursor: "pointer",
    color: "var(--text-secondary)"
  },
  formSectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "16px",
    color: "var(--brand-accent)"
  }
};
