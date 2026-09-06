import React, { useState, useEffect } from "react";
import { BrainCircuit, Check, X, Award, RotateCcw, ChevronRight } from "lucide-react";

export default function Aptitude({ showToast }) {
  const [selectedCategory, setSelectedCategory] = useState("Quantitative");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Progress tracking (stored locally in state)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("prep_aptitude_stats");
    return saved ? JSON.parse(saved) : { total: 0, correct: 0 };
  });

  // Track shown question IDs to provide variety and avoid repeats
  const [history, setHistory] = useState([]);

  // Load a question when category changes
  useEffect(() => {
    loadNewQuestion();
    setSelectedOption(null);
    setIsAnswered(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadNewQuestion = () => {
    // Filter questions by category from localStorage database
    const activeQuestions = JSON.parse(localStorage.getItem("prep_db_aptitude") || "[]");
    const filtered = activeQuestions.filter(q => q.category === selectedCategory);
    if (filtered.length === 0) return;

    // Try to find a question that hasn't been shown recently
    const pool = filtered.filter(q => !history.includes(q.id));
    
    let nextQ;
    if (pool.length > 0) {
      nextQ = pool[Math.floor(Math.random() * pool.length)];
      setHistory(prev => [...prev, nextQ.id]);
    } else {
      // If all questions are shown, reset history for this category and pull random
      nextQ = filtered[Math.floor(Math.random() * filtered.length)];
      setHistory([nextQ.id]);
    }

    setCurrentQuestion(nextQ);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleOptionSelect = (optionIdx) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsAnswered(true);

    const newStats = {
      total: stats.total + 1,
      correct: stats.correct + (correct ? 1 : 0)
    };
    setStats(newStats);
    localStorage.setItem("prep_aptitude_stats", JSON.stringify(newStats));

    if (correct) {
      showToast("Correct Answer! Good job.", "success");
    } else {
      showToast("Incorrect Answer. Study the explanation below.", "error");
    }
  };

  const handleResetStats = () => {
    const newStats = { total: 0, correct: 0 };
    setStats(newStats);
    localStorage.setItem("prep_aptitude_stats", JSON.stringify(newStats));
    setHistory([]);
    showToast("Aptitude practice stats reset.", "info");
  };

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div style={styles.container} className="animate-slide-up">
      {/* STATS PANEL */}
      <div className="glass-panel" style={styles.statsBar}>
        <div style={styles.statBox}>
          <BrainCircuit size={20} color="var(--brand-primary)" />
          <div>
            <p style={styles.statLabel}>Total Attempted</p>
            <p style={styles.statValue}>{stats.total}</p>
          </div>
        </div>
        <div style={styles.statBox}>
          <Check size={20} color="var(--accent-emerald)" />
          <div>
            <p style={styles.statLabel}>Correct Answers</p>
            <p style={styles.statValue}>{stats.correct}</p>
          </div>
        </div>
        <div style={styles.statBox}>
          <Award size={20} color="var(--brand-accent)" />
          <div>
            <p style={styles.statLabel}>Accuracy Rate</p>
            <p style={styles.statValue}>{accuracy}%</p>
          </div>
        </div>
        <button className="btn btn-secondary" style={styles.resetBtn} onClick={handleResetStats}>
          <RotateCcw size={14} /> Reset Stats
        </button>
      </div>

      <div style={styles.mainGrid}>
        {/* LEFT COLUMN: QUESTION PANEL */}
        <div className="glass-panel" style={styles.questionPanel}>
          {/* CATEGORY SWITCHER */}
          <div style={styles.categoryHeader}>
            {["Quantitative", "Logical", "Verbal"].map(cat => (
              <button 
                key={cat}
                style={{
                  ...styles.catBtn,
                  background: selectedCategory === cat ? "var(--brand-gradient)" : "rgba(255, 255, 255, 0.02)",
                  borderColor: selectedCategory === cat ? "transparent" : "var(--border-color)",
                  color: selectedCategory === cat ? "white" : "var(--text-secondary)"
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} Ability
              </button>
            ))}
          </div>

          {currentQuestion ? (
            <div style={styles.questionContent}>
              <h3 style={styles.questionText}>{currentQuestion.question}</h3>
              
              <div style={styles.optionsList}>
                {currentQuestion.options.map((opt, idx) => {
                  let optStyle = { ...styles.optionCard };
                  let icon = null;

                  if (selectedOption === idx) {
                    optStyle.borderColor = "var(--brand-primary)";
                    optStyle.background = "rgba(144, 97, 249, 0.08)";
                  }

                  if (isAnswered) {
                    if (idx === currentQuestion.correctAnswer) {
                      optStyle.borderColor = "var(--accent-emerald)";
                      optStyle.background = "rgba(16, 185, 129, 0.08)";
                      optStyle.color = "var(--accent-emerald)";
                      icon = <Check size={16} style={styles.optIcon} />;
                    } else if (selectedOption === idx) {
                      optStyle.borderColor = "var(--accent-rose)";
                      optStyle.background = "rgba(244, 63, 94, 0.08)";
                      optStyle.color = "var(--accent-rose)";
                      icon = <X size={16} style={styles.optIcon} />;
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      style={optStyle}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswered}
                    >
                      <div style={styles.optionContent}>
                        <span style={styles.optionLetter}>{String.fromCharCode(65 + idx)}.</span>
                        <span>{opt}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              <div style={styles.actionRow}>
                {!isAnswered ? (
                  <button 
                    className="btn btn-primary"
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={loadNewQuestion}
                  >
                    Next Question <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p style={styles.emptyText}>Loading question bank...</p>
          )}
        </div>

        {/* RIGHT COLUMN: SOLUTION & EXPLANATION */}
        <div className="glass-panel" style={styles.explanationPanel}>
          <h3 style={styles.panelTitle}>Explanation</h3>
          {isAnswered && currentQuestion ? (
            <div style={styles.explanationContent} className="animate-fade-in">
              <div style={styles.statusBox}>
                <span style={{ 
                  ...styles.statusBadge, 
                  backgroundColor: selectedOption === currentQuestion.correctAnswer ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
                  color: selectedOption === currentQuestion.correctAnswer ? "var(--accent-emerald)" : "var(--accent-rose)"
                }}>
                  {selectedOption === currentQuestion.correctAnswer ? "CORRECT" : "INCORRECT"}
                </span>
                <p style={styles.correctReveal}>
                  Correct option: <strong>{String.fromCharCode(65 + currentQuestion.correctAnswer)}</strong> ({currentQuestion.options[currentQuestion.correctAnswer]})
                </p>
              </div>

              <h4 style={styles.stepsTitle}>Step-by-step Solution:</h4>
              <p style={styles.stepsText}>{currentQuestion.explanation}</p>
            </div>
          ) : (
            <div style={styles.emptyExplanation}>
              <BrainCircuit size={48} color="var(--text-secondary)" style={{ opacity: 0.3, marginBottom: 16 }} />
              <p>Select an option and submit your answer to reveal the step-by-step mathematical explanation.</p>
            </div>
          )}
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
  statsBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderRadius: "16px",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px"
  },
  statBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textAlign: "left"
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: "0.05em"
  },
  statValue: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  resetBtn: {
    padding: "8px 14px",
    fontSize: "0.85rem"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "28px"
  },
  questionPanel: {
    padding: "28px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  categoryHeader: {
    display: "flex",
    gap: "10px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "16px"
  },
  catBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid transparent",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  questionContent: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  questionText: {
    fontSize: "1.15rem",
    lineHeight: "1.6",
    fontWeight: 600,
    color: "var(--text-primary)"
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
    border: "1px solid var(--border-color)",
    background: "rgba(255, 255, 255, 0.01)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease",
    color: "var(--text-primary)",
    fontFamily: "inherit",
    fontSize: "0.95rem"
  },
  optionContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  optionLetter: {
    fontWeight: 700,
    color: "var(--brand-primary)"
  },
  optIcon: {
    flexShrink: 0
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end"
  },
  explanationPanel: {
    padding: "28px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  panelTitle: {
    fontSize: "1.15rem",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "12px",
    color: "var(--brand-primary)"
  },
  explanationContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  statusBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "16px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "var(--glass-border)"
  },
  statusBadge: {
    alignSelf: "flex-start",
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: "10px"
  },
  correctReveal: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)"
  },
  stepsTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  stepsText: {
    fontSize: "0.92rem",
    lineHeight: "1.6",
    color: "var(--text-secondary)",
    whiteSpace: "pre-line"
  },
  emptyExplanation: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    padding: "20px",
    textAlign: "center",
    lineHeight: "1.6"
  },
  emptyText: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    padding: "40px 0",
    textAlign: "center"
  }
};
