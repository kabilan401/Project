import React, { useState, useEffect, useRef } from "react";
import { AlertOctagon, Timer, Play, ChevronRight, ChevronLeft, RefreshCw, ShieldAlert, Award, RotateCcw } from "lucide-react";
import { evaluateChallenge } from "../utils/codeEvaluator";

export default function MockTest({ showToast }) {
  // Test Phase: 'idle', 'running', 'completed'
  const [testState, setTestState] = useState("idle");
  const [timer, setTimer] = useState(900); // 15 mins in seconds
  const [testResults, setTestResults] = useState(null);
  
  // Test Questions
  const [testQuestions, setTestQuestions] = useState({ aptitude: [], coding: [] });
  const [activeTab, setActiveTab] = useState("aptitude"); // 'aptitude' or 'coding'
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Student Answers
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { qId: optionIdx }
  const [codingCodes, setCodingCodes] = useState({}); // { qId: codeText }
  const [codingLanguages, setCodingLanguages] = useState({}); // { qId: lang }

  // Proctor / Warnings State
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [violationMsg, setViolationMsg] = useState("");
  
  const timerRef = useRef(null);
  const warningCountRef = useRef(0);

  // Initialize randomized test questions
  const initializeTest = () => {
    const activeApt = JSON.parse(localStorage.getItem("prep_db_aptitude") || "[]");
    const activeCode = JSON.parse(localStorage.getItem("prep_db_coding") || "[]");

    if (activeApt.length === 0 || activeCode.length === 0) {
      showToast("Cannot start test: question databases are empty. Contact Admin.", "error");
      return;
    }

    // Pick 5 random Aptitude questions (up to 5)
    const shuffledApt = [...activeApt].sort(() => 0.5 - Math.random());
    const selectedApt = shuffledApt.slice(0, Math.min(5, shuffledApt.length));

    // Pick 2 random Coding questions (up to 2)
    const shuffledCode = [...activeCode].sort(() => 0.5 - Math.random());
    const selectedCode = shuffledCode.slice(0, Math.min(2, shuffledCode.length));

    setTestQuestions({ aptitude: selectedApt, coding: selectedCode });
    
    // Set default stubs for selected coding questions
    const defaultCodes = {};
    const defaultLangs = {};
    selectedCode.forEach(q => {
      defaultLangs[q.id] = "python";
      defaultCodes[q.id] = q.languages.python;
    });
    setCodingCodes(defaultCodes);
    setCodingLanguages(defaultLangs);

    // Reset stats
    setSelectedAnswers({});
    setTestResults(null);
    setWarnings(0);
    warningCountRef.current = 0;
    setShowWarningModal(false);
    setTimer(900); // Reset timer
    setActiveTab("aptitude");
    setActiveQuestionIdx(0);
    setTestState("running");
    showToast("Placement Test started! Timer initialized.", "info");
  };

  // Timer countdown hook
  useEffect(() => {
    if (testState === "running") {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitTest(true); // Auto-submit when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testState]);

  // Proctor/Tab-switch detection hook
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (testState === "running" && document.hidden) {
        triggerViolation("Tab Switching / Minimizing Browser");
      }
    };

    const handleWindowBlur = () => {
      if (testState === "running") {
        triggerViolation("Leaving Exam Screen Focus");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testState]);

  const triggerViolation = (reason) => {
    if (showWarningModal) return; // Prevent double alerts if both events fire
    
    const nextCount = warningCountRef.current + 1;
    setWarnings(nextCount);
    warningCountRef.current = nextCount;

    setViolationMsg(reason);
    setShowWarningModal(true);

    if (nextCount > 3) {
      clearInterval(timerRef.current);
      setShowWarningModal(false);
      submitTest(false, true); // Auto-terminate test
    } else {
      showToast(`Proctor Alert! Warning #${nextCount} registered.`, "error");
    }
  };

  const closeWarning = () => {
    setShowWarningModal(false);
  };

  const submitTest = async (timeOut = false, terminated = false) => {
    clearInterval(timerRef.current);

    // Calculate score for logging history
    let correctApt = 0;
    testQuestions.aptitude.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctApt += 1;
      }
    });

    let correctCode = 0;
    for (const q of testQuestions.coding) {
      const code = codingCodes[q.id] || "";
      const lang = codingLanguages[q.id] || "python";
      try {
        const evaluation = await evaluateChallenge(q.id, lang, code, q.testCases);
        if (evaluation.passed) {
          correctCode += 1;
        }
      } catch (err) {
        console.error("Evaluation error during test submission:", err);
      }
    }

    const totalScore = correctApt + correctCode;
    const totalQuestions = testQuestions.aptitude.length + testQuestions.coding.length;
    const finalPercent = Math.round((totalScore / totalQuestions) * 100);

    const calculated = {
      correctApt,
      correctCode,
      totalScore,
      totalQuestions,
      finalPercent
    };

    setTestResults(calculated);
    setTestState("completed");

    // Save history entry
    const newEntry = {
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: totalScore,
      total: totalQuestions,
      percent: finalPercent,
      warnings: warningCountRef.current
    };

    const history = JSON.parse(localStorage.getItem("prep_mock_test_history") || "[]");
    localStorage.setItem("prep_mock_test_history", JSON.stringify([...history, newEntry]));

    if (timeOut) {
      showToast("Time's up! Your test has been submitted automatically.", "info");
    } else if (terminated) {
      showToast("Test terminated and submitted due to multiple proctor violations.", "error");
    } else {
      showToast("Test submitted successfully.", "success");
    }
  };

  // Helper formatting for timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const results = testState === "completed" ? testResults : null;

  return (
    <div style={styles.container} className="animate-slide-up">
      
      {/* WARNING POPUP IF USER SWITCHED TAB */}
      {showWarningModal && (
        <div className="proctor-alert-overlay">
          <div className="proctor-alert-card glass-panel" style={styles.warningCard}>
            <ShieldAlert size={48} color="var(--accent-rose)" style={{ marginBottom: 16 }} />
            <h3 style={{ color: "var(--accent-rose)", fontSize: "1.4rem", marginBottom: 12 }}>Proctoring Violation!</h3>
            <p style={styles.warningText}>
              The system detected: <strong>{violationMsg}</strong>.<br />
              Leaving the testing environment is strictly prohibited.
            </p>
            <div style={styles.warningAlertBox}>
              <strong>Warnings: {warnings} / 3</strong>
              <p style={{ fontSize: "0.8rem", marginTop: 4 }}>
                If you receive more than 3 warnings, your exam will be terminated immediately.
              </p>
            </div>
            <button className="btn btn-danger" onClick={closeWarning} style={{ marginTop: 20 }}>
              Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* IDLE VIEW (INSTRUCTIONS) */}
      {testState === "idle" && (
        <div className="glass-panel animate-fade-in" style={styles.rulesCard}>
          <div style={styles.rulesHeader}>
            <AlertOctagon size={36} color="var(--brand-primary)" />
            <h2>Mock Campus Placement Test</h2>
          </div>
          <p style={styles.rulesSub}>Simulate a proctored recruitment test from top tech recruiters (Infosys, TCS, Amazon).</p>

          <div style={styles.rulesList}>
            <h4 style={styles.rulesListTitle}>Exam Rules & Structure:</h4>
            <ul>
              <li><strong>Duration:</strong> 15 minutes (900 seconds) digital countdown.</li>
              <li><strong>Syllabus:</strong> 5 Aptitude questions + 2 Coding questions.</li>
              <li><strong>Proctoring Protection:</strong> Tab switching, page minimizing, or leaving browser focus triggers system warnings.</li>
              <li><strong>Termination:</strong> Accumulating 4 focus violations will result in automatic submission.</li>
              <li><strong>Submission:</strong> You can submit early. All current selections will be evaluated.</li>
            </ul>
          </div>

          <button className="btn btn-primary" onClick={initializeTest} style={styles.startBtn}>
            <Play size={18} /> Start timed placement exam
          </button>
        </div>
      )}

      {/* ACTIVE TESTING ENVIRONMENT */}
      {testState === "running" && (
        <div style={styles.examWrapper}>
          {/* EXAM STATUS PANEL */}
          <div className="glass-panel" style={styles.examStatsBar}>
            <div style={styles.timerBlock}>
              <Timer size={20} color={timer < 120 ? "var(--accent-rose)" : "var(--brand-primary)"} />
              <span style={{ 
                ...styles.timerValue, 
                color: timer < 120 ? "var(--accent-rose)" : "var(--text-primary)" 
              }} className={timer < 120 ? "pulse-danger" : ""}>
                {formatTime(timer)}
              </span>
            </div>

            <div style={styles.warningsBlock}>
              <ShieldAlert size={18} color={warnings > 1 ? "var(--accent-rose)" : "var(--brand-primary)"} />
              <span style={styles.warningsLabel}>Warnings: {warnings}/3</span>
            </div>

            <button className="btn btn-danger" onClick={() => { if(window.confirm("Submit exam now?")) submitTest(); }} style={styles.submitBtn}>
              Submit Exam
            </button>
          </div>

          {/* EXAM BODY */}
          <div style={styles.examGrid}>
            
            {/* LEFT INDEX COLUMN: CHOOSE QUESTIONS */}
            <div className="glass-panel" style={styles.questionIndexColumn}>
              <h4 style={styles.sidebarSectionTitle}>Aptitude Questions</h4>
              <div style={styles.gridNav}>
                {testQuestions.aptitude.map((q, idx) => (
                  <button
                    key={q.id}
                    style={{
                      ...styles.navGridBtn,
                      background: activeTab === "aptitude" && activeQuestionIdx === idx 
                        ? "var(--brand-gradient)" 
                        : selectedAnswers[q.id] !== undefined ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                      borderColor: activeTab === "aptitude" && activeQuestionIdx === idx 
                        ? "transparent" 
                        : selectedAnswers[q.id] !== undefined ? "var(--accent-emerald)" : "var(--border-color)",
                      color: activeTab === "aptitude" && activeQuestionIdx === idx ? "white" : "var(--text-primary)"
                    }}
                    onClick={() => { setActiveTab("aptitude"); setActiveQuestionIdx(idx); }}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>

              <h4 style={{ ...styles.sidebarSectionTitle, marginTop: 24 }}>Coding Questions</h4>
              <div style={styles.gridNav}>
                {testQuestions.coding.map((q, idx) => {
                  const hasCode = codingCodes[q.id] && !codingCodes[q.id].includes("Write your code here");
                  return (
                    <button
                      key={q.id}
                      style={{
                        ...styles.navGridBtn,
                        background: activeTab === "coding" && activeQuestionIdx === idx 
                          ? "var(--brand-gradient)" 
                          : hasCode ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                        borderColor: activeTab === "coding" && activeQuestionIdx === idx 
                          ? "transparent" 
                          : hasCode ? "var(--accent-emerald)" : "var(--border-color)",
                        color: activeTab === "coding" && activeQuestionIdx === idx ? "white" : "var(--text-primary)"
                      }}
                      onClick={() => { setActiveTab("coding"); setActiveQuestionIdx(idx); }}
                    >
                      C{idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT MAIN PANEL: QUESTION DESCRIPTION & WORKSPACE */}
            <div className="glass-panel" style={styles.examMainPanel}>
              
              {/* APTITUDE WORKSPACE */}
              {activeTab === "aptitude" && testQuestions.aptitude[activeQuestionIdx] && (
                <div style={styles.questionForm}>
                  <div style={styles.questionMetaHeader}>
                    <span className="badge">Question {activeQuestionIdx + 1} of 5</span>
                    <span className="badge">Aptitude</span>
                  </div>

                  <h3 style={styles.examQuestionText}>
                    {testQuestions.aptitude[activeQuestionIdx].question}
                  </h3>

                  <div style={styles.optionsList}>
                    {testQuestions.aptitude[activeQuestionIdx].options.map((opt, oIdx) => {
                      const qId = testQuestions.aptitude[activeQuestionIdx].id;
                      const isChosen = selectedAnswers[qId] === oIdx;

                      return (
                        <button
                          key={oIdx}
                          style={{
                            ...styles.optionCard,
                            borderColor: isChosen ? "var(--brand-primary)" : "var(--border-color)",
                            background: isChosen ? "rgba(144, 97, 249, 0.08)" : "rgba(255, 255, 255, 0.01)"
                          }}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [qId]: oIdx }))}
                        >
                          <span style={styles.optionLetter}>{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={styles.navRow}>
                    <button
                      className="btn btn-secondary"
                      disabled={activeQuestionIdx === 0}
                      onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    {activeQuestionIdx < 4 ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => { setActiveTab("coding"); setActiveQuestionIdx(0); }}
                      >
                        Start Coding section <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CODING WORKSPACE */}
              {activeTab === "coding" && testQuestions.coding[activeQuestionIdx] && (
                <div style={styles.codingGrid}>
                  <div style={styles.codingProblemText}>
                    <div style={styles.questionMetaHeader}>
                      <span className="badge">Coding Challenge {activeQuestionIdx + 1} of 2</span>
                      <span className="badge">{testQuestions.coding[activeQuestionIdx].difficulty}</span>
                    </div>
                    <h3 style={styles.examQuestionText}>{testQuestions.coding[activeQuestionIdx].title}</h3>
                    <div style={styles.scroller}>
                      <p style={styles.descText}>{testQuestions.coding[activeQuestionIdx].description}</p>
                      <strong>Constraints:</strong>
                      <pre style={styles.constraintsBlock}>{testQuestions.coding[activeQuestionIdx].constraints}</pre>
                      <strong>Sample Input:</strong>
                      <pre style={styles.sampleIO}>{testQuestions.coding[activeQuestionIdx].sampleInput}</pre>
                      <strong>Sample Output:</strong>
                      <pre style={styles.sampleIO}>{testQuestions.coding[activeQuestionIdx].sampleOutput}</pre>
                    </div>
                  </div>

                  <div style={styles.codingCodeWorkspace}>
                    <div style={styles.toolbarRow}>
                      <select
                        className="input-field"
                        style={styles.inlineSelect}
                        value={codingLanguages[testQuestions.coding[activeQuestionIdx].id] || "python"}
                        onChange={(e) => {
                          const val = e.target.value;
                          const qId = testQuestions.coding[activeQuestionIdx].id;
                          setCodingLanguages(prev => ({ ...prev, [qId]: val }));
                          setCodingCodes(prev => ({ ...prev, [qId]: testQuestions.coding[activeQuestionIdx].languages[val] }));
                        }}
                      >
                        <option value="python">Python 3</option>
                        <option value="java">Java (JDK 17)</option>
                        <option value="c">C (GCC 11)</option>
                      </select>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={styles.resetBtnSmall}
                        onClick={() => {
                          const qId = testQuestions.coding[activeQuestionIdx].id;
                          const lang = codingLanguages[qId] || "python";
                          setCodingCodes(prev => ({ ...prev, [qId]: testQuestions.coding[activeQuestionIdx].languages[lang] }));
                        }}
                      >
                        <RotateCcw size={12} /> Reset
                      </button>
                    </div>

                    <textarea
                      className="input-field"
                      style={styles.workspaceTextarea}
                      value={codingCodes[testQuestions.coding[activeQuestionIdx].id] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const qId = testQuestions.coding[activeQuestionIdx].id;
                        setCodingCodes(prev => ({ ...prev, [qId]: val }));
                      }}
                      spellCheck="false"
                    />

                    <div style={styles.navRow}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          if (activeQuestionIdx === 0) {
                            setActiveTab("aptitude");
                            setActiveQuestionIdx(4);
                          } else {
                            setActiveQuestionIdx(0);
                          }
                        }}
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                      {activeQuestionIdx === 0 && (
                        <button
                          className="btn btn-primary"
                          onClick={() => setActiveQuestionIdx(1)}
                        >
                          Next Challenge <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* COMPLETED/SCORE SUMMARY VIEW */}
      {testState === "completed" && results && (
        <div className="glass-panel animate-slide-up" style={styles.resultsCard}>
          <div style={styles.resultsHeader}>
            <Award size={48} color="var(--brand-primary)" />
            <h2>Placement Test Performance Report</h2>
            <p style={styles.resultsMeta}>Timed evaluation completed.</p>
          </div>

          {/* MAIN SCOREBOARD CARD */}
          <div style={styles.resultsScoreboardGrid}>
            <div className="glass-card" style={styles.scoreSummaryBox}>
              <p style={styles.scoreSummaryLabel}>Final Score</p>
              <h2 style={styles.scoreHuge}>{results.totalScore} / {results.totalQuestions}</h2>
              <span style={styles.scoreText}>Questions Correct</span>
            </div>
            
            <div className="glass-card" style={styles.scorePercentageBox}>
              <p style={styles.scoreSummaryLabel}>Accuracy Percentage</p>
              <h2 style={{ ...styles.scoreHuge, color: results.finalPercent >= 60 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                {results.finalPercent}%
              </h2>
              <span style={styles.scoreText}>
                {results.finalPercent >= 60 ? "PASS (Eligible for placements)" : "FAIL (Score minimum 60% required)"}
              </span>
            </div>
          </div>

          <div style={styles.statsSummaryGrid}>
            <div style={styles.smallStatRow}>
              <span>Aptitude Score:</span>
              <strong>{results.correctApt} / 5 Correct</strong>
            </div>
            <div style={styles.smallStatRow}>
              <span>Coding Score:</span>
              <strong>{results.correctCode} / 2 Correct</strong>
            </div>
            <div style={styles.smallStatRow}>
              <span>Security Warnings:</span>
              <strong style={{ color: warnings > 1 ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                {warnings} focus warnings
              </strong>
            </div>
          </div>

          <div style={styles.answerKeySection}>
            <h3 style={styles.answerKeyTitle}>Aptitude Solution Walkthrough</h3>
            <div style={styles.solutionList}>
              {testQuestions.aptitude.map((q, idx) => {
                const answerCorrect = selectedAnswers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} style={styles.solutionItem}>
                    <div style={styles.solutionHeader}>
                      <span style={styles.solNum}>Question #{idx + 1}</span>
                      <span style={{
                        ...styles.solBadge,
                        color: answerCorrect ? "var(--accent-emerald)" : "var(--accent-rose)",
                        backgroundColor: answerCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"
                      }}>
                        {answerCorrect ? "Correct" : "Incorrect / Unanswered"}
                      </span>
                    </div>
                    <p style={styles.solQText}>{q.question}</p>
                    <p style={styles.solChosen}>
                      Your Choice: <code>{selectedAnswers[q.id] !== undefined ? q.options[selectedAnswers[q.id]] : "Unanswered"}</code>
                    </p>
                    <p style={styles.solCorrect}>
                      Correct Choice: <code>{q.options[q.correctAnswer]}</code>
                    </p>
                    <div style={styles.solExplanationBox}>
                      <strong>Explanation:</strong>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="btn btn-primary" onClick={initializeTest} style={styles.retakeBtn}>
            <RefreshCw size={16} /> Retake placement test
          </button>
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
  warningCard: {
    backgroundColor: "#160b13",
    borderColor: "var(--accent-rose)"
  },
  warningText: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "16px"
  },
  warningAlertBox: {
    background: "rgba(244, 63, 94, 0.1)",
    border: "1px solid rgba(244, 63, 94, 0.2)",
    padding: "12px",
    borderRadius: "10px",
    color: "var(--accent-rose)",
    fontSize: "0.95rem",
    fontWeight: 600
  },
  rulesCard: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "36px",
    textAlign: "left"
  },
  rulesHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "10px"
  },
  rulesSub: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    lineHeight: "1.5",
    marginBottom: "24px"
  },
  rulesList: {
    background: "rgba(255, 255, 255, 0.01)",
    border: "var(--glass-border)",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "28px"
  },
  rulesListTitle: {
    fontSize: "1rem",
    color: "var(--brand-primary)",
    marginBottom: "12px"
  },
  startBtn: {
    width: "100%",
    height: "46px",
    fontWeight: 700
  },
  examWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  examStatsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderRadius: "12px",
    flexWrap: "wrap",
    gap: "16px"
  },
  timerBlock: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  timerValue: {
    fontSize: "1.3rem",
    fontFamily: "var(--font-mono)",
    fontWeight: 700
  },
  warningsBlock: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  warningsLabel: {
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "var(--text-secondary)"
  },
  submitBtn: {
    padding: "8px 20px",
    fontSize: "0.9rem"
  },
  examGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 4fr",
    gap: "20px"
  },
  questionIndexColumn: {
    padding: "20px",
    textAlign: "left"
  },
  sidebarSectionTitle: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.05em",
    marginBottom: "12px"
  },
  gridNav: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px"
  },
  navGridBtn: {
    height: "36px",
    borderRadius: "6px",
    border: "1px solid",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 700,
    transition: "all 0.2s ease"
  },
  examMainPanel: {
    padding: "28px",
    minHeight: "500px",
    textAlign: "left"
  },
  questionForm: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  questionMetaHeader: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  examQuestionText: {
    fontSize: "1.15rem",
    lineHeight: "1.6",
    fontWeight: 600
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  optionCard: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "10px",
    border: "1px solid",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
    color: "var(--text-primary)",
    fontFamily: "inherit",
    fontSize: "0.95rem",
    textAlign: "left"
  },
  optionLetter: {
    fontWeight: 700,
    color: "var(--brand-primary)",
    marginRight: "12px"
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  codingGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    height: "550px"
  },
  codingProblemText: {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    overflow: "hidden"
  },
  scroller: {
    overflowY: "auto",
    flexGrow: 1,
    paddingRight: "6px",
    fontSize: "0.85rem",
    lineHeight: "1.5"
  },
  descText: {
    color: "var(--text-secondary)",
    marginBottom: "12px"
  },
  constraintsBlock: {
    background: "rgba(255, 255, 255, 0.02)",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontFamily: "var(--font-mono)",
    marginBottom: "12px",
    whiteSpace: "pre-wrap"
  },
  sampleIO: {
    background: "rgba(0, 0, 0, 0.15)",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontFamily: "var(--font-mono)",
    marginBottom: "12px"
  },
  codingCodeWorkspace: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  toolbarRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  inlineSelect: {
    width: "110px",
    padding: "4px 8px",
    fontSize: "0.8rem",
    backgroundPosition: "right 6px center"
  },
  resetBtnSmall: {
    padding: "4px 10px",
    fontSize: "0.75rem"
  },
  workspaceTextarea: {
    flex: 1,
    background: "#080612",
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    padding: "12px",
    resize: "none",
    border: "var(--glass-border)",
    lineHeight: "1.5",
    outline: "none"
  },
  resultsCard: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "36px",
    textAlign: "left"
  },
  resultsHeader: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px"
  },
  resultsMeta: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem"
  },
  resultsScoreboardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "28px"
  },
  scoreSummaryBox: {
    padding: "24px",
    textAlign: "center"
  },
  scorePercentageBox: {
    padding: "24px",
    textAlign: "center"
  },
  scoreSummaryLabel: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    fontWeight: 600,
    letterSpacing: "0.05em",
    marginBottom: "12px"
  },
  scoreHuge: {
    fontSize: "2.8rem",
    fontWeight: 800,
    marginBottom: "4px"
  },
  scoreText: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)"
  },
  statsSummaryGrid: {
    background: "rgba(255, 255, 255, 0.01)",
    border: "var(--glass-border)",
    borderRadius: "10px",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "32px"
  },
  smallStatRow: {
    fontSize: "0.9rem",
    display: "flex",
    gap: "6px"
  },
  answerKeySection: {
    borderTop: "1px solid var(--border-color)",
    paddingTop: "28px",
    marginBottom: "32px"
  },
  answerKeyTitle: {
    fontSize: "1.1rem",
    marginBottom: "20px"
  },
  solutionList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  solutionItem: {
    background: "rgba(255, 255, 255, 0.01)",
    border: "var(--glass-border)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left"
  },
  solutionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  solNum: {
    fontWeight: 700,
    fontSize: "0.95rem"
  },
  solBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "10px"
  },
  solQText: {
    fontSize: "0.95rem",
    lineHeight: "1.5",
    color: "var(--text-primary)",
    marginBottom: "12px"
  },
  solChosen: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    marginBottom: "4px"
  },
  solCorrect: {
    fontSize: "0.85rem",
    color: "var(--accent-emerald)",
    marginBottom: "14px"
  },
  solExplanationBox: {
    borderTop: "1px solid var(--border-color)",
    paddingTop: "10px",
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5"
  },
  retakeBtn: {
    width: "100%",
    height: "46px"
  }
};
