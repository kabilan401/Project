import React, { useState } from "react";
import { Briefcase, ArrowLeft, Target, Award, ListTodo, HelpCircle, Eye, RefreshCw } from "lucide-react";

export default function CompanyPrep({ showToast }) {
  const [companies] = useState(() => {
    return JSON.parse(localStorage.getItem("prep_db_companies") || "[]");
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // Flip card state for company questions
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSelectCompany = (comp) => {
    setSelectedCompany(comp);
    setActiveQuestionIdx(0);
    setIsFlipped(false);
  };

  const handleNextQuestion = () => {
    if (!selectedCompany || !selectedCompany.interviewQuestions || selectedCompany.interviewQuestions.length === 0) return;
    const len = selectedCompany.interviewQuestions.length;
    setActiveQuestionIdx(prev => (prev + 1) % len);
    setIsFlipped(false);
  };

  return (
    <div style={styles.container} className="animate-slide-up">
      
      {/* COMPANY GRID LIST */}
      {!selectedCompany ? (
        <div style={styles.gridContainer}>
          <div style={styles.introBlock}>
            <Briefcase size={28} color="var(--brand-primary)" />
            <h2 style={styles.sectionTitle}>Company-Wise Placement Drive Roadmap</h2>
            <p style={styles.sectionSub}>Target preparation strategies, exam formats, and interview logs for major technical recruiters.</p>
          </div>

          <div style={styles.companyGrid}>
            {companies.map(comp => (
              <div 
                key={comp.id} 
                className="glass-panel glass-card" 
                style={styles.companyCard}
                onClick={() => handleSelectCompany(comp)}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.compName}>{comp.name}</h3>
                  <span style={styles.diffBadge(comp.difficulty)} className="badge">
                    {comp.difficulty}
                  </span>
                </div>
                
                <p style={styles.compOverview}>{comp.overview}</p>
                
                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}>
                    <Target size={14} color="var(--brand-primary)" />
                    <span>Cutoff score: <strong>{comp.cutoff}</strong></span>
                  </div>
                  <div style={styles.detailRow}>
                    <Award size={14} color="var(--brand-primary)" />
                    <span>Rounds: <strong>{comp.rounds.length} stages</strong></span>
                  </div>
                </div>

                <button className="btn btn-primary" style={styles.viewRoadmapBtn}>
                  Prepare for {comp.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* DETAILED ROADMAP FOR SELECTED COMPANY */
        <div style={styles.detailContainer} className="animate-fade-in">
          {/* Back button */}
          <button className="btn btn-secondary" onClick={() => setSelectedCompany(null)} style={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Recruiters
          </button>

          {/* Company Banner */}
          <div className="glass-panel" style={styles.banner}>
            <div style={styles.bannerHeader}>
              <h2 style={styles.bannerTitle}>{selectedCompany.name}</h2>
              <span style={styles.diffBadge(selectedCompany.difficulty)} className="badge">
                {selectedCompany.difficulty}
              </span>
            </div>
            <p style={styles.bannerDesc}>{selectedCompany.overview}</p>
          </div>

          <div style={styles.mainGrid}>
            {/* LEFT COLUMN: ROUNDS & SYLLABUS */}
            <div style={styles.leftCol}>
              {/* Stepper recruitment timeline */}
              <div className="glass-panel" style={styles.panelCard}>
                <h3 style={styles.panelTitle}><ListTodo size={18} color="var(--brand-primary)" /> Recruitment Timeline</h3>
                
                <div style={styles.stepperContainer}>
                  {selectedCompany.rounds.map((round, idx) => (
                    <div key={idx} style={styles.stepRow}>
                      <div style={styles.stepBullet}>
                        <span>{idx + 1}</span>
                      </div>
                      <div style={styles.stepContent}>
                        <p style={styles.stepText}>{round}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus syllabus checklist */}
              <div className="glass-panel" style={styles.panelCard}>
                <h3 style={styles.panelTitle}><Target size={18} color="var(--brand-primary)" /> Core Focus Areas</h3>
                <p style={styles.cardSub}>Practice questions covering these domains to crack the initial screening.</p>
                <div style={styles.focusGrid}>
                  {selectedCompany.focusAreas.map((focus, idx) => (
                    <div 
                      key={idx} 
                      className="glass-card" 
                      style={styles.focusItemCard}
                      onClick={() => showToast(`Practice topic: ${focus}. Navigate to Practice section!`, "info")}
                    >
                      <Target size={14} color="var(--brand-primary)" />
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: RECENT INTERVIEW QUESTIONS FLIP DECK */}
            <div style={styles.rightCol}>
              <div className="glass-panel" style={styles.interviewCardWorkspace}>
                <h3 style={styles.panelTitle}><HelpCircle size={18} color="var(--brand-primary)" /> Top Recruiter Questions</h3>
                <p style={styles.cardSub}>Actual questions asked in recent placement drives for {selectedCompany.name}.</p>

                {/* 3D Flip Card */}
                {selectedCompany.interviewQuestions && selectedCompany.interviewQuestions.length > 0 ? (
                  <div style={{ marginTop: 20 }}>
                    <div 
                      className="interview-card-container"
                      onClick={() => setIsFlipped(!isFlipped)}
                      style={styles.flipCardSize}
                    >
                      <div className={`interview-card-inner ${isFlipped ? "is-flipped" : "not-flipped"}`}>
                        
                        {/* FRONT FACE: QUESTION */}
                        <div className="card-face card-face-front" style={styles.faceOverride}>
                          <div style={styles.faceHeader}>
                            <span className="badge">Technical Interview</span>
                            <HelpCircle size={18} color="var(--brand-primary)" />
                          </div>
                          
                          <div style={styles.faceBody}>
                            <h4 style={styles.qText}>
                              "{selectedCompany.interviewQuestions[activeQuestionIdx].question}"
                            </h4>
                          </div>

                          <div style={styles.faceFooter}>
                            <Eye size={14} style={{ marginRight: 6 }} />
                            <span>Click card to reveal model answer</span>
                          </div>
                        </div>

                        {/* BACK FACE: SOLUTION */}
                        <div className="card-face card-face-back" style={styles.faceOverride}>
                          <div style={styles.faceHeader}>
                            <span className="badge" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--accent-emerald)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                              Sample Solution
                            </span>
                            <Award size={18} color="var(--accent-emerald)" />
                          </div>

                          <div style={styles.ansBody}>
                            <p style={styles.ansText}>{selectedCompany.interviewQuestions[activeQuestionIdx].answer}</p>
                          </div>

                          <div style={styles.faceFooter}>
                            <span>Click card to return to question</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div style={styles.cardNavigationRow}>
                      <button className="btn btn-secondary" onClick={handleNextQuestion}>
                        <RefreshCw size={14} /> Next Company Question
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={styles.emptyText}>No questions recorded for this company.</p>
                )}
              </div>
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
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
  introBlock: {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: 700
  },
  sectionSub: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5"
  },
  companyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px"
  },
  companyCard: {
    padding: "24px",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minHeight: "260px"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px"
  },
  compName: {
    fontSize: "1.1rem",
    fontWeight: 700
  },
  diffBadge: (diff) => {
    let bg = "rgba(144, 97, 249, 0.15)";
    let col = "var(--brand-accent)";
    if (diff === "Hard") {
      bg = "rgba(244, 63, 94, 0.15)";
      col = "var(--accent-rose)";
    } else if (diff === "Expert") {
      bg = "rgba(109, 40, 217, 0.2)";
      col = "#c084fc";
    } else if (diff === "Easy-Medium") {
      bg = "rgba(16, 185, 129, 0.15)";
      col = "var(--accent-emerald)";
    }
    return {
      backgroundColor: bg,
      color: col,
      fontSize: "0.75rem",
      fontWeight: 700
    };
  },
  compOverview: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
    flexGrow: 1
  },
  cardDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "12px",
    fontSize: "0.82rem",
    color: "var(--text-secondary)"
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  viewRoadmapBtn: {
    width: "100%",
    height: "40px",
    fontSize: "0.85rem",
    marginTop: "6px"
  },
  detailContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  backBtn: {
    alignSelf: "flex-start",
    padding: "8px 16px",
    fontSize: "0.85rem"
  },
  banner: {
    padding: "24px 28px",
    textAlign: "left"
  },
  bannerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  bannerTitle: {
    fontSize: "1.6rem",
    fontWeight: 800
  },
  bannerDesc: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "28px"
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
  rightCol: {
    display: "flex",
    flexDirection: "column"
  },
  panelCard: {
    padding: "24px",
    textAlign: "left"
  },
  panelTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "12px",
    marginBottom: "16px"
  },
  cardSub: {
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    marginBottom: "14px"
  },
  stepperContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    paddingLeft: "12px"
  },
  stepRow: {
    display: "flex",
    gap: "16px",
    position: "relative",
    paddingBottom: "24px",
    minHeight: "70px"
  },
  stepBullet: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "var(--brand-gradient)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.85rem",
    zIndex: 2,
    flexShrink: 0
  },
  stepContent: {
    textAlign: "left",
    paddingTop: "3px"
  },
  stepText: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--text-primary)"
  },
  focusGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },
  focusItemCard: {
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.02)"
  },
  interviewCardWorkspace: {
    padding: "24px",
    textAlign: "left",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  flipCardSize: {
    height: "320px",
    maxWidth: "100%"
  },
  faceOverride: {
    padding: "24px"
  },
  faceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  faceBody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    padding: "12px 0"
  },
  qText: {
    fontSize: "1.2rem",
    fontWeight: 600,
    lineHeight: "1.5",
    textAlign: "center"
  },
  ansBody: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "10px 0",
    textAlign: "left"
  },
  ansText: {
    fontSize: "0.88rem",
    lineHeight: "1.6",
    whiteSpace: "pre-line"
  },
  faceFooter: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "10px"
  },
  cardNavigationRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px"
  },
  emptyText: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    padding: "40px 0"
  }
};
