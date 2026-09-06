import React, { useState, useEffect } from "react";
import { Terminal, Play, Code, RotateCcw } from "lucide-react";
import { evaluateChallenge } from "../utils/codeEvaluator";

export default function CodingPractice({ showToast }) {
  const [challenges] = useState(() => {
    return JSON.parse(localStorage.getItem("prep_db_coding") || "[]");
  });
  const [selectedProblem, setSelectedProblem] = useState(() => {
    const list = JSON.parse(localStorage.getItem("prep_db_coding") || "[]");
    return list[0] || null;
  });
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");

  // Terminal / Execution state
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Sync code stub when problem or language changes
  useEffect(() => {
    if (selectedProblem && selectedProblem.languages && selectedProblem.languages[selectedLanguage]) {
      setCode(selectedProblem.languages[selectedLanguage]);
    }
    setConsoleLogs([]);
    setTestCaseResults([]);
    setHasRun(false);
  }, [selectedProblem, selectedLanguage]);

  const handleResetCode = () => {
    if (window.confirm("Are you sure you want to reset your code to the default stub?")) {
      setCode(selectedProblem.languages[selectedLanguage]);
      showToast("Code reset to template.", "info");
    }
  };

  // Intelligent client-side validation logic
  const runCodeSimulation = async () => {
    setIsRunning(true);
    setConsoleLogs(["Compiling code...", "Linking libraries...", "Executing test cases..."]);
    setTestCaseResults([]);
    setHasRun(true);

    try {
      const evaluation = await evaluateChallenge(selectedProblem.id, selectedLanguage, code, selectedProblem.testCases);
      setIsRunning(false);
      setTestCaseResults(evaluation.results);

      if (evaluation.passed) {
        setConsoleLogs([
          "Compilation Successful.",
          "Executing program...",
          `Running against ${selectedProblem.testCases.length} test cases...`,
          "Status: ALL TEST CASES PASSED! 🎉",
          "Execution time: 42ms"
        ]);
        showToast("Great! All test cases passed.", "success");

        // Track solved coding questions
        const solvedList = JSON.parse(localStorage.getItem("prep_coding_solved_list") || "[]");
        if (!solvedList.includes(selectedProblem.id)) {
          const updatedList = [...solvedList, selectedProblem.id];
          localStorage.setItem("prep_coding_solved_list", JSON.stringify(updatedList));
          localStorage.setItem("prep_coding_solved_count", updatedList.length.toString());
        }
      } else {
        if (evaluation.error) {
          setConsoleLogs([
            "Compilation failed.",
            "Error details:",
            evaluation.error,
            "Warning: Please modify the default return stubs to implement correct logic."
          ]);
        } else {
          setConsoleLogs([
            "Compilation Successful.",
            "Executing program...",
            "Status: Tests finished with failures.",
            "Warning: Please modify the default return stubs to implement correct logic."
          ]);
        }
        showToast("Some test cases failed. Please review your logic.", "error");
      }
    } catch (err) {
      setIsRunning(false);
      setConsoleLogs([
        "Execution failed.",
        `Error: ${err.message}`
      ]);
      showToast("Evaluation failed due to an error.", "error");
    }
  };

  if (!selectedProblem) {
    return (
      <div style={styles.container} className="animate-slide-up">
        <div className="glass-panel" style={{ padding: "48px 24px", textAlign: "center", maxWidth: "600px", margin: "40px auto" }}>
          <Code size={48} color="var(--brand-primary)" style={{ marginBottom: 16, display: "inline-block" }} />
          <h3 style={{ fontSize: "1.4rem", fontWeight: 700 }}>No Coding Challenges Available</h3>
          <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>The coding question pool is currently empty. Log in as Admin to populate the database.</p>
        </div>
      </div>
    );
  }

  // Helper to count lines in the code block
  const linesArray = code.split("\n");

  return (
    <div style={styles.container} className="animate-slide-up">
      <div style={styles.workspaceGrid}>

        {/* LEFT COMPONENT: PROBLEM DESCRIPTION */}
        <div className="glass-panel" style={styles.problemDesc}>
          <div style={styles.problemHeader}>
            <span className="badge" style={styles.diffBadge(selectedProblem.difficulty)}>
              {selectedProblem.difficulty}
            </span>
            <h3 style={styles.problemTitle}>{selectedProblem.title}</h3>
          </div>

          <div style={styles.scroller}>
            <div style={styles.sectionBlock}>
              <h4 style={styles.subTitle}>Problem Statement</h4>
              <p style={styles.paragraph}>{selectedProblem.description}</p>
            </div>

            <div style={styles.sectionBlock}>
              <h4 style={styles.subTitle}>Constraints</h4>
              <pre style={styles.codeBlock}>{selectedProblem.constraints}</pre>
            </div>

            <div style={styles.sectionBlock}>
              <h4 style={styles.subTitle}>Input Format</h4>
              <p style={styles.paragraph}>{selectedProblem.inputFormat}</p>
            </div>

            <div style={styles.sectionBlock}>
              <h4 style={styles.subTitle}>Output Format</h4>
              <p style={styles.paragraph}>{selectedProblem.outputFormat}</p>
            </div>

            <div style={styles.sectionBlock}>
              <h4 style={styles.subTitle}>Sample Example</h4>
              <div style={styles.sampleBox}>
                <strong>Sample Input:</strong>
                <pre style={styles.sampleCode}>{selectedProblem.sampleInput}</pre>
                <strong>Sample Output:</strong>
                <pre style={styles.sampleCode}>{selectedProblem.sampleOutput}</pre>
              </div>
            </div>

            <div style={styles.problemPickerSection}>
              <h4 style={styles.subTitle}>Select Problem</h4>
              <div style={styles.problemList}>
                {challenges.map(prob => (
                  <button
                    key={prob.id}
                    style={{
                      ...styles.probBtn,
                      borderColor: selectedProblem.id === prob.id ? "var(--brand-primary)" : "var(--border-color)",
                      background: selectedProblem.id === prob.id ? "rgba(144, 97, 249, 0.08)" : "transparent"
                    }}
                    onClick={() => setSelectedProblem(prob)}
                  >
                    <Code size={14} style={{ marginRight: 6 }} />
                    {prob.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: CODE EDITOR & OUTPUT TERMINAL */}
        <div style={styles.editorCol}>

          {/* EDITOR CARD */}
          <div className="glass-panel" style={styles.editorCard}>
            <div style={styles.editorToolbar}>
              <div style={styles.toolbarLeft}>
                <Code size={16} color="var(--brand-primary)" />
                <span style={styles.toolbarText}>workspace.src</span>
              </div>
              <div style={styles.toolbarRight}>
                <select
                  className="input-field"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={styles.langSelect}
                >
                  <option value="python">Python 3</option>
                  <option value="java">Java (JDK 17)</option>
                  <option value="c">C (GCC 11)</option>
                </select>
                <button className="btn btn-secondary" style={styles.toolBtn} onClick={handleResetCode}>
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Simulated Code Editor Area */}
            <div style={styles.editorWorkspace}>
              <div style={styles.lineNumbers}>
                {linesArray.map((_, i) => (
                  <span key={i} style={styles.lineNumber}>{i + 1}</span>
                ))}
              </div>
              <textarea
                className="input-field"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={styles.editorTextarea}
                spellCheck="false"
              />
            </div>

            <div style={styles.editorFooter}>
              <button
                className="btn btn-primary"
                style={styles.runBtn}
                onClick={runCodeSimulation}
                disabled={isRunning}
              >
                <Play size={16} /> {isRunning ? "Compiling..." : "Run Test Cases"}
              </button>
            </div>
          </div>

          {/* CONSOLE & TEST CASES CARD */}
          <div className="glass-panel" style={styles.terminalCard}>
            <div style={styles.terminalHeader}>
              <Terminal size={16} color="var(--brand-primary)" />
              <span style={styles.terminalTitle}>Compiler Console & Output</span>
            </div>

            <div style={styles.terminalContent}>
              {/* Console Logs */}
              <div style={styles.consoleLogs}>
                {consoleLogs.map((log, idx) => (
                  <p key={idx} style={styles.logLine(log)}>{log}</p>
                ))}
                {consoleLogs.length === 0 && (
                  <p style={styles.terminalPlaceholder}>Run your program to compile and inspect test cases.</p>
                )}
              </div>

              {/* Test Case Cards */}
              {hasRun && (
                <div style={styles.testCasesGrid}>
                  <h4 style={styles.testCasesTitle}>Test Case Results:</h4>
                  {testCaseResults.map(tc => (
                    <div
                      key={tc.id}
                      style={{
                        ...styles.testCaseCard,
                        borderColor: tc.passed ? "var(--accent-emerald)" : "var(--accent-rose)",
                        background: tc.passed ? "rgba(16, 185, 129, 0.02)" : "rgba(244, 63, 94, 0.02)"
                      }}
                    >
                      <div style={styles.tcHeader}>
                        <span style={styles.tcNum}>Test Case #{tc.id}</span>
                        <span style={{
                          ...styles.tcBadge,
                          color: tc.passed ? "var(--accent-emerald)" : "var(--accent-rose)",
                          backgroundColor: tc.passed ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"
                        }}>
                          {tc.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                      <div style={styles.tcIO}>
                        <p><strong>Input:</strong> <code>{tc.input}</code></p>
                        <p><strong>Expected:</strong> <code>{tc.expected}</code></p>
                        <p><strong>Got:</strong> <code>{tc.actual}</code></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
  workspaceGrid: {
    display: "grid",
    gridTemplateColumns: "0.8fr 1.2fr",
    gap: "28px"
  },
  problemDesc: {
    padding: "24px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    maxHeight: "800px",
    overflow: "hidden"
  },
  problemHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "16px",
    marginBottom: "16px",
    flexWrap: "wrap"
  },
  diffBadge: (diff) => ({
    backgroundColor: diff === "Easy" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
    color: diff === "Easy" ? "var(--accent-emerald)" : "var(--accent-amber)",
    fontSize: "0.75rem",
    fontWeight: 700
  }),
  problemTitle: {
    fontSize: "1.2rem",
    fontWeight: 700
  },
  scroller: {
    overflowY: "auto",
    flexGrow: 1,
    paddingRight: "6px"
  },
  sectionBlock: {
    marginBottom: "20px"
  },
  subTitle: {
    fontSize: "0.95rem",
    color: "var(--brand-primary)",
    marginBottom: "8px",
    fontWeight: 700
  },
  paragraph: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    color: "var(--text-secondary)"
  },
  codeBlock: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "var(--glass-border)",
    padding: "10px 14px",
    borderRadius: "8px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    whiteSpace: "pre-wrap"
  },
  sampleBox: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "var(--glass-border)",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "0.85rem"
  },
  sampleCode: {
    background: "rgba(0, 0, 0, 0.2)",
    padding: "8px 12px",
    borderRadius: "6px",
    fontFamily: "var(--font-mono)",
    color: "var(--text-primary)",
    margin: "4px 0 12px 0"
  },
  problemPickerSection: {
    marginTop: "24px",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "20px"
  },
  problemList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  probBtn: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "transparent",
    color: "var(--text-primary)",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
    textAlign: "left"
  },
  editorCol: {
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
  editorCard: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  editorToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid var(--border-color)",
    background: "rgba(255, 255, 255, 0.01)"
  },
  toolbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  toolbarText: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    fontFamily: "var(--font-mono)"
  },
  toolbarRight: {
    display: "flex",
    gap: "10px"
  },
  langSelect: {
    padding: "6px 12px",
    fontSize: "0.85rem",
    width: "130px",
    backgroundPosition: "right 8px center"
  },
  toolBtn: {
    padding: "6px 12px",
    fontSize: "0.8rem"
  },
  editorWorkspace: {
    display: "flex",
    background: "#080612",
    minHeight: "350px",
    position: "relative"
  },
  lineNumbers: {
    display: "flex",
    flexDirection: "column",
    padding: "14px 10px",
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
    userSelect: "none",
    textAlign: "right",
    background: "#06040d"
  },
  lineNumber: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.2)",
    lineHeight: "1.6",
    height: "22.4px" /* Matches lines height of textarea */
  },
  editorTextarea: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    color: "#f1ecf9",
    padding: "14px 16px",
    lineHeight: "1.6",
    outline: "none",
    resize: "none",
    whiteSpace: "pre",
    overflow: "auto",
    height: "350px"
  },
  editorFooter: {
    padding: "12px 20px",
    borderTop: "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "flex-end",
    background: "rgba(255, 255, 255, 0.01)"
  },
  runBtn: {
    padding: "8px 18px",
    fontSize: "0.9rem"
  },
  terminalCard: {
    padding: "20px 24px",
    textAlign: "left"
  },
  terminalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "10px",
    marginBottom: "14px"
  },
  terminalTitle: {
    fontSize: "0.9rem",
    fontWeight: 600
  },
  terminalContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  consoleLogs: {
    background: "#06040d",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    minHeight: "100px",
    maxHeight: "200px",
    overflowY: "auto"
  },
  logLine: (log) => {
    let color = "var(--text-secondary)";
    if (log.includes("ALL TEST CASES PASSED")) color = "var(--accent-emerald)";
    else if (log.includes("failures") || log.includes("Failed")) color = "var(--accent-rose)";
    else if (log.includes("Warning")) color = "var(--accent-amber)";
    else if (log.includes("Successful")) color = "var(--brand-accent)";
    return {
      color,
      marginBottom: "4px",
      lineHeight: "1.4"
    };
  },
  terminalPlaceholder: {
    color: "rgba(255, 255, 255, 0.15)",
    fontStyle: "italic"
  },
  testCasesTitle: {
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    fontWeight: 700,
    marginBottom: "4px"
  },
  testCasesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  testCaseCard: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  tcHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  tcNum: {
    fontSize: "0.85rem",
    fontWeight: 700
  },
  tcBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "10px"
  },
  tcIO: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    textAlign: "left"
  },
  emptyText: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    padding: "20px 0"
  }
};
