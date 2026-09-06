import React, { useState, useEffect } from "react";
import { MessageSquareCode, Award, Send, RefreshCw, HelpCircle, Eye } from "lucide-react";

export default function InterviewPrep({ showToast }) {
  const [selectedCategory, setSelectedCategory] = useState("Technical");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  
  // Feedback states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState(null);

  // History tracking to ensure variety and prevent repeats
  const [history, setHistory] = useState([]);

  // Load question when category changes
  useEffect(() => {
    loadNewQuestion();
    setIsFlipped(false);
    setUserAnswer("");
    setEvaluationFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadNewQuestion = () => {
    // Filter questions by category from localStorage database
    const activeQuestions = JSON.parse(localStorage.getItem("prep_db_interview") || "[]");
    const filtered = activeQuestions.filter(q => q.category === selectedCategory);
    if (filtered.length === 0) {
      setCurrentQuestion(null);
      return;
    }

    // Try to find a question that hasn't been shown recently
    const pool = filtered.filter(q => !history.includes(q.id));
    
    let nextQ;
    if (pool.length > 0) {
      nextQ = pool[Math.floor(Math.random() * pool.length)];
      setHistory(prev => [...prev, nextQ.id]);
    } else {
      // Reset history if all questions shown
      nextQ = filtered[Math.floor(Math.random() * filtered.length)];
      setHistory([nextQ.id]);
    }

    setCurrentQuestion(nextQ);
    setIsFlipped(false);
    setUserAnswer("");
    setEvaluationFeedback(null);
  };

  const handleEvaluate = (e) => {
    e.preventDefault();
    if (!currentQuestion) {
      showToast("No active question to evaluate.", "error");
      return;
    }
    if (!userAnswer.trim()) {
      showToast("Please type your response before evaluating.", "error");
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const answerLower = userAnswer.toLowerCase();
      const keywords = currentQuestion.keywords || [];
      const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
      
      // Calculate matching keywords using strict word boundaries to avoid false positives (e.g. template -> temp)
      const matched = keywords.filter(kw => {
        const cleanKw = kw.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
        return regex.test(answerLower);
      });
      const missing = keywords.filter(kw => {
        const cleanKw = kw.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
        return !regex.test(answerLower);
      });
      
      let matchScore = Math.round((matched.length / Math.max(1, keywords.length)) * 100);
      
      // Adjust score with baseline boost only for detailed conversational responses
      let tip = "";
      if (wordCount >= 15) {
        matchScore = Math.min(100, matchScore + 15);
      } else if (wordCount < 5) {
        matchScore = Math.min(15, matchScore); // Severe cap for single-word / list-only submissions
      } else {
        matchScore = Math.min(45, matchScore); // Capped for too brief inputs
      }

      // Generate constructive feedback tips based on length and match score
      if (wordCount < 5) {
        tip = "Your response is extremely short. Please write full sentences explaining the concepts instead of just listing keywords.";
      } else if (wordCount < 15) {
        tip = "This is a start, but too brief. In an interview, expand your response to explain details, context, and terminology.";
      } else if (matchScore >= 80) {
        tip = "Outstanding response! You demonstrated a comprehensive understanding of the topic, covered core definitions, and structured the answer professionally.";
      } else if (matchScore >= 50) {
        tip = "Good response, but there is room for improvement. Try to expand on details and use more professional terminology to sound more convincing.";
      } else {
        tip = "Your response lacks key conceptual keywords. See the model answer and consider adding missing concepts to your answer.";
      }

      setEvaluationFeedback({
        score: matchScore,
        matched,
        missing: missing.slice(0, 3), // suggest up to 3 missing concepts
        tip
      });

      setIsEvaluating(false);
      showToast("AI Evaluation complete! Check score below.", "success");
    }, 1200);
  };

  return (
    <div style={styles.container} className="animate-slide-up">
      
      {/* CATEGORY SWITCHER HEADER */}
      <div className="glass-panel" style={styles.categoryBar}>
        <div style={styles.headerLeft}>
          <MessageSquareCode size={24} color="var(--brand-primary)" />
          <div>
            <h3 style={styles.titleText}>Mock Interview Arena</h3>
            <p style={styles.subText}>Select a category, formulate your response, and test your readiness.</p>
          </div>
        </div>

        <div style={styles.tabsRow}>
          {["Technical", "HR", "System Design"].map(cat => (
            <button
              key={cat}
              style={{
                ...styles.catTabBtn,
                background: selectedCategory === cat ? "var(--brand-gradient)" : "rgba(255, 255, 255, 0.02)",
                borderColor: selectedCategory === cat ? "transparent" : "var(--border-color)",
                color: selectedCategory === cat ? "white" : "var(--text-secondary)"
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.mainGrid}>
        
        {/* LEFT COLUMN: 3D FLIP CARD */}
        <div style={styles.cardCol}>
          {currentQuestion ? (
            <div 
              className="interview-card-container" 
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`interview-card-inner ${isFlipped ? "is-flipped" : "not-flipped"}`}>
                
                {/* CARD FRONT: THE QUESTION */}
                <div className="card-face card-face-front">
                  <div style={styles.cardHeader}>
                    <span className="badge">Category: {currentQuestion.category}</span>
                    <HelpCircle size={18} color="var(--brand-primary)" />
                  </div>
                  
                  <div style={styles.cardBody}>
                    <h3 style={styles.questionText}>"{currentQuestion.question}"</h3>
                  </div>

                  <div style={styles.cardFooter}>
                    <Eye size={14} style={{ marginRight: 6 }} />
                    <span>Click card to reveal model answer</span>
                  </div>
                </div>

                {/* CARD BACK: MODEL ANSWER */}
                <div className="card-face card-face-back">
                  <div style={styles.cardHeader}>
                    <span className="badge" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--accent-emerald)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                      Model Answer
                    </span>
                    <Award size={18} color="var(--accent-emerald)" />
                  </div>

                  <div style={styles.answerBody}>
                    <p style={styles.modelAnswerText}>{currentQuestion.modelAnswer}</p>
                  </div>

                  <div style={styles.cardFooter}>
                    <span>Click card to return to question</span>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <p style={styles.emptyText}>No interview questions available. Log in as Admin to populate questions.</p>
          )}

          <div style={styles.actionRow}>
            <button className="btn btn-secondary" onClick={loadNewQuestion} style={styles.nextBtn}>
              <RefreshCw size={14} /> Next Random Question
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ANSWER TEXT BOX & EVALUATION FEEDBACK */}
        <div className="glass-panel" style={styles.evaluationPanel}>
          <h3 style={styles.panelTitle}>Practice Your Answer</h3>
          <p style={styles.panelSub}>Type out what you would say in a live interview to get instant keyword feedback.</p>

          <form onSubmit={handleEvaluate} style={styles.form}>
            <textarea
              className="input-field"
              rows="6"
              placeholder={currentQuestion ? "e.g. In my view, the main difference between a process and a thread is..." : "Select a category with questions to start practicing."}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={styles.answerTextarea}
              disabled={!currentQuestion || isEvaluating}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!currentQuestion || isEvaluating}
              style={styles.submitBtn}
            >
              <Send size={16} /> {isEvaluating ? "Analyzing..." : "Evaluate Answer"}
            </button>
          </form>

          {/* EVALUATION REPORT CONTAINER */}
          {evaluationFeedback && (
            <div style={styles.feedbackContainer} className="animate-fade-in">
              <div style={styles.feedbackStatsRow}>
                <div style={styles.scoreCircleBlock}>
                  <div style={styles.scoreCircle}>
                    <span style={styles.scoreVal}>{evaluationFeedback.score}%</span>
                  </div>
                  <span style={styles.scoreLabel}>Keyword Match</span>
                </div>
                <div style={styles.statsDetails}>
                  <h4 style={styles.feedbackTitle}>Evaluation Result:</h4>
                  <p style={styles.feedbackTip}>{evaluationFeedback.tip}</p>
                </div>
              </div>

              {evaluationFeedback.matched.length > 0 && (
                <div style={styles.keywordsBlock}>
                  <p style={styles.keywordLabel}>Matched Concepts:</p>
                  <div style={styles.keywordsGrid}>
                    {evaluationFeedback.matched.map((kw, idx) => (
                      <span key={idx} style={styles.keywordBadgeMatched}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {evaluationFeedback.missing.length > 0 && (
                <div style={styles.keywordsBlock}>
                  <p style={styles.keywordLabel}>Consider discussing these key terms:</p>
                  <div style={styles.keywordsGrid}>
                    {evaluationFeedback.missing.map((kw, idx) => (
                      <span key={idx} style={styles.keywordBadgeMissing}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}
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
  categoryBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderRadius: "16px",
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
  titleText: {
    fontSize: "1.2rem",
    fontWeight: 700
  },
  subText: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)"
  },
  tabsRow: {
    display: "flex",
    gap: "8px"
  },
  catTabBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "28px"
  },
  cardCol: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardBody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    padding: "20px 0"
  },
  answerBody: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "16px 0",
    margin: "10px 0"
  },
  questionText: {
    fontSize: "1.4rem",
    fontWeight: 600,
    lineHeight: "1.5",
    fontStyle: "italic",
    textAlign: "center"
  },
  modelAnswerText: {
    fontSize: "0.92rem",
    lineHeight: "1.6",
    textAlign: "left",
    whiteSpace: "pre-line",
    color: "var(--text-primary)"
  },
  cardFooter: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "12px"
  },
  actionRow: {
    display: "flex",
    justifyContent: "center"
  },
  nextBtn: {
    padding: "10px 24px",
    fontWeight: 600
  },
  evaluationPanel: {
    padding: "28px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  panelTitle: {
    fontSize: "1.15rem",
    color: "var(--brand-primary)",
    fontWeight: 700
  },
  panelSub: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "6px"
  },
  answerTextarea: {
    resize: "none",
    fontSize: "0.92rem",
    lineHeight: "1.5"
  },
  submitBtn: {
    height: "44px"
  },
  feedbackContainer: {
    borderTop: "1px solid var(--border-color)",
    paddingTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  feedbackStatsRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  scoreCircleBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    flexShrink: 0
  },
  scoreCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    border: "4px solid var(--brand-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(144, 97, 249, 0.05)"
  },
  scoreVal: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "var(--text-primary)"
  },
  scoreLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase"
  },
  statsDetails: {
    textAlign: "left"
  },
  feedbackTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    marginBottom: "4px"
  },
  feedbackTip: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5"
  },
  keywordsBlock: {
    textAlign: "left"
  },
  keywordLabel: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    fontWeight: 600,
    marginBottom: "6px"
  },
  keywordsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px"
  },
  keywordBadgeMatched: {
    fontSize: "0.75rem",
    padding: "3px 8px",
    borderRadius: "10px",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    color: "var(--accent-emerald)"
  },
  keywordBadgeMissing: {
    fontSize: "0.75rem",
    padding: "3px 8px",
    borderRadius: "10px",
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    border: "1px solid rgba(244, 63, 94, 0.25)",
    color: "var(--accent-rose)"
  },
  emptyText: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    padding: "20px 0"
  }
};
