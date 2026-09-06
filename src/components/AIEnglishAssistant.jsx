import React, { useState, useEffect, useRef } from "react";
import { Languages, Send, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, FileText, Clipboard, MessageSquare, ArrowRight, User, Mic, MicOff, Volume2, VolumeX, Radio, Video, VideoOff, PhoneOff } from "lucide-react";

// Robust clientside NLP / Grammar Rule Checker
const analyzeEnglish = (text) => {
  if (!text.trim()) return null;

  const errors = [];
  let correctedText = text;
  
  // Rule 1: Subject-Verb Agreement
  const subjectVerbRules = [
    { 
      regex: /\b(i|you|we|they)\s+(has|goes|likes|wants|runs|does)\b/i, 
      correct: (match, p1, p2) => {
        const correctVerb = p2.toLowerCase() === "has" ? "have" : p2.toLowerCase() === "does" ? "do" : p2.replace(/es$/i, "").replace(/s$/i, "");
        return { 
          mistake: `"${p1} ${p2}"`, 
          fix: `"${p1} ${correctVerb}"`, 
          explanation: `The pronouns 'I', 'you', 'we', and 'they' are plural in agreement and require plural verbs (e.g., 'have', 'go') without the '-s' suffix.` 
        };
      }
    },
    { 
      regex: /\b(he|she|it|everyone|someone|everybody|each)\s+(have|go|like|want|run|do)\b/i, 
      correct: (match, p1, p2) => {
        const correctVerb = p2.toLowerCase() === "have" ? "has" : (p2.toLowerCase() === "go" ? "goes" : (p2.toLowerCase() === "do" ? "does" : p2 + "s"));
        return { 
          mistake: `"${p1} ${p2}"`, 
          fix: `"${p1} ${correctVerb}"`, 
          explanation: `Singular pronouns ('he', 'she', 'it') and indefinite pronouns ('everyone', 'each') require singular verbs (e.g., 'has', 'goes') ending in '-s'.` 
        };
      }
    },
    { 
      regex: /\b(each\s+of\s+the\s+\w+s)\s+have\b/i, 
      correct: (match, p1) => {
        return { 
          mistake: `"${p1} have"`, 
          fix: `"${p1} has"`, 
          explanation: `'Each' is singular. The construction 'Each of the [plural noun]' still requires a singular verb ('has').` 
        };
      }
    }
  ];

  // Rule 2: Past tense indicators
  const tenseRules = [
    { 
      regex: /\bdid\s+(\w+ed|\w+t)\b/i, 
      correct: (match, p1) => {
        // e.g. did completed -> did complete
        let baseForm = p1;
        if (p1.endsWith("ed")) baseForm = p1.slice(0, -2);
        if (baseForm.endsWith("l")) baseForm += "e"; // e.g. filled -> fill
        return { 
          mistake: `"did ${p1}"`, 
          fix: `"${p1}" or "did ${baseForm}"`, 
          explanation: `Avoid using a past tense verb directly after the auxiliary verb 'did'. Use the base form instead.` 
        };
      }
    },
    { 
      regex: /\b(yesterday|last\s+(year|month|week|day)|ago)\s+(\w+)\b/i, 
      correct: (match, p1, p2, p3) => {
        const presentToPast = {
          go: "went", take: "took", make: "made", see: "saw", get: "got",
          write: "wrote", speak: "spoke", think: "thought", run: "ran",
          has: "had", have: "had", is: "was", are: "were"
        };
        if (presentToPast[p3.toLowerCase()]) {
          const correctPast = presentToPast[p3.toLowerCase()];
          return { 
            mistake: `"${p1} ${p3}"`, 
            fix: `"${p1} ${correctPast}"`, 
            explanation: `Past time indicators (yesterday, last, ago) require verbs in the simple past tense.` 
          };
        }
        return null;
      }
    }
  ];

  // Rule 3: Redundant prepositions & common idioms
  const prepositionRules = [
    { 
      regex: /\bdiscuss\s+about\b/i, 
      correct: () => ({ 
        mistake: '"discuss about"', 
        fix: '"discuss"', 
        explanation: `The verb 'discuss' means 'to talk about', making the preposition 'about' redundant.` 
      }), 
      replaceWith: "discuss" 
    },
    { 
      regex: /\bcop\s+up\s+with\b/i, 
      correct: () => ({ 
        mistake: '"cop up with"', 
        fix: '"cope with"', 
        explanation: `The correct idiomatic phrase is 'cope with'. 'Cop up with' is incorrect.` 
      }), 
      replaceWith: "cope with" 
    },
    { 
      regex: /\breturn\s+back\b/i, 
      correct: () => ({ 
        mistake: '"return back"', 
        fix: '"return"', 
        explanation: `'Return' means 'to go back', making the word 'back' redundant.` 
      }), 
      replaceWith: "return" 
    },
    { 
      regex: /\bgraduation\s+on\s+yesterday\b/i, 
      correct: () => ({ 
        mistake: '"on yesterday"', 
        fix: '"yesterday"', 
        explanation: `Do not use prepositions ('on', 'at') before time adverbs like 'yesterday', 'today', or 'tomorrow'.` 
      }), 
      replaceWith: "yesterday" 
    },
    { 
      regex: /\bmarried\s+with\b/i, 
      correct: () => ({ 
        mistake: '"married with"', 
        fix: '"married to"', 
        explanation: `The correct preposition following 'married' is 'to' when indicating spouse relationship.` 
      }), 
      replaceWith: "married to" 
    }
  ];

  // Rule 4: Word choice / Confused words
  const homophoneRules = [
    { 
      regex: /\btheir\s+(is|are|was|were)\b/i, 
      correct: (match, p1) => ({ 
        mistake: `"${match}"`, 
        fix: `"there ${p1}"`, 
        explanation: `'Their' is possessive. Use 'there' to indicate existence or location.` 
      }) 
    },
    { 
      regex: /\b(there|they're)\s+(book|car|house|project|skills|resume|graduation)\b/i, 
      correct: (match, p1, p2) => ({ 
        mistake: `"${match}"`, 
        fix: `"their ${p2}"`, 
        explanation: `Use the possessive pronoun 'their' to indicate ownership/association of '${p2}'.` 
      }) 
    },
    { 
      regex: /\b(its|it\'s)\s+a\s+(\w+)\b/i, 
      correct: (match, p1, p2) => {
        // match might be 'its a' or 'it's a'
        if (p1.toLowerCase() === "its") {
          return {
            mistake: `"its a ${p2}"`,
            fix: `"it's a ${p2}"`,
            explanation: `'Its' is possessive. Use the contraction 'it's' (it is) before the noun/adjective.`
          };
        }
        return null;
      }
    }
  ];

  // Run checks
  const processRules = (rules) => {
    for (const rule of rules) {
      let match;
      const localRegex = new RegExp(rule.regex.source, 'gi');
      while ((match = localRegex.exec(text)) !== null) {
        const res = rule.correct(match[0], match[1], match[2], match[3]);
        if (res) {
          errors.push(res);
          const cleanFix = res.fix.replace(/"/g, "");
          correctedText = correctedText.replace(new RegExp(match[0], 'i'), cleanFix);
        }
      }
    }
  };

  processRules(subjectVerbRules);
  processRules(tenseRules);
  
  // Run prepositions
  for (const rule of prepositionRules) {
    let match;
    const localRegex = new RegExp(rule.regex.source, 'gi');
    if (localRegex.test(text)) {
      const res = rule.correct();
      errors.push(res);
      correctedText = correctedText.replace(localRegex, rule.replaceWith);
    }
  }

  processRules(homophoneRules);

  // Capitalize sentence start
  if (text.trim() && text.trim()[0] !== text.trim()[0].toUpperCase()) {
    errors.push({
      mistake: `First letter "${text.trim()[0]}" is lowercase`,
      fix: `Capitalize to "${text.trim()[0].toUpperCase()}"`,
      explanation: "A sentence should always begin with a capital letter."
    });
    correctedText = correctedText.trim()[0].toUpperCase() + correctedText.trim().slice(1);
  }

  // End punctuation check
  const lastChar = text.trim().slice(-1);
  if (text.trim() && !['.', '!', '?'].includes(lastChar)) {
    errors.push({
      mistake: "Missing sentence terminal punctuation",
      fix: `Add a period (.): "${text.trim()}."`,
      explanation: "A declarative sentence should always end with a terminal mark like a period."
    });
    correctedText = correctedText.trim() + ".";
  }

  // Vocabulary enhancements
  const vocabularyEnhancements = [
    { word: "help", suggestion: "assist / facilitate", explanation: "Use 'assist' or 'facilitate' in professional contexts." },
    { word: "make", suggestion: "develop / construct / author", explanation: "Use 'develop' or 'create' to describe building projects." },
    { word: "got", suggestion: "obtained / acquired / secured", explanation: "Use 'obtained' or 'acquired' for credentials or placement." },
    { word: "use", suggestion: "utilize / leverage", explanation: "Use 'utilize' or 'leverage' to show competence in tools." },
    { word: "good", suggestion: "proficient / exceptional / adept", explanation: "Use 'proficient' or 'exceptional' to describe your skills." },
    { word: "job", suggestion: "professional role / career", explanation: "Use 'professional role' to elevate your terminology." }
  ];

  const vocabSuggestions = [];
  for (const item of vocabularyEnhancements) {
    const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
    if (regex.test(text)) {
      vocabSuggestions.push({
        original: item.word,
        suggested: item.suggestion,
        explanation: item.explanation
      });
    }
  }

  return {
    originalText: text,
    correctedText,
    errors,
    vocabSuggestions,
    hasMistakes: errors.length > 0
  };
};

// Preset examples for quick user testing
const PRESETS = [
  "I has completed my graduation on yesterday.",
  "We discuss about our final year projects.",
  "He have a good skills in react and got certificates.",
  "Its a great opportunity to show my talents."
];

// Interactive English Tutor Chat Questions
const TUTOR_QUESTIONS = [
  "Hi! I am Priya, your placement coach. Let's start with a unique challenge: If you had to explain your favorite programming language to a 10-year-old child using a real-world metaphor, how would you describe it?",
  "Fascinating. Let's talk about tech innovation. If you had unlimited funding to build any AI application to solve a major everyday problem in your student life, what would you build and why?",
  "Great concept. Imagine you are working on a team project and a key member abruptly leaves two days before the deployment deadline. What immediate, actionable steps would you take to save the project?",
  "Excellent problem-solving. With generative AI writing code so quickly now, what is the most important human skill a software engineer needs to possess to stay highly valuable?",
  "Insightful view. Final question: Tell me about a time you failed at a technical task or project. What went wrong, and how did that failure actually make you a better developer?"
];

export default function AIEnglishAssistant({ showToast }) {
  const [activeSubTab, setActiveSubTab] = useState("corrector"); // corrector, tutor, video
  
  // Corrector states
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Voice Mode States
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  // Video Interview states
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isInterviewCamOn, setIsInterviewCamOn] = useState(false);
  const [isInterviewListening, setIsInterviewListening] = useState(false);
  const [interviewQuestionIndex, setInterviewQuestionIndex] = useState(0);
  const [interviewTranscript, setInterviewTranscript] = useState([]);
  const [currentSpeechTranscript, setCurrentSpeechTranscript] = useState("");
  const [isInterviewEvaluating, setIsInterviewEvaluating] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  // Tutor Chat States
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: TUTOR_QUESTIONS[0],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userChatInput, setUserChatInput] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [selectedFeedbackMessage, setSelectedFeedbackMessage] = useState(null);
  const [tutorQuestionIndex, setTutorQuestionIndex] = useState(0);

  const userVideoRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Text-To-Speech (AI Reply Speech)
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop active reading
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => 
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Aria")) && 
      (v.lang.startsWith("en-") || v.lang === "en")
    ) || voices.find(v => v.lang.startsWith("en"));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.onstart = () => setIsBotSpeaking(true);
    utterance.onend = () => setIsBotSpeaking(false);
    utterance.onerror = () => setIsBotSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };


  // Warm-up voices and lifecycle cancellation
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      // Stop webcam stream on unmount/route switch
      if (userVideoRef.current && userVideoRef.current.srcObject) {
        const stream = userVideoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start webcam for virtual interview call
  const startInterviewCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.play();
      }
      setIsInterviewCamOn(true);
      showToast("Webcam connected successfully.", "success");
    } catch (e) {
      console.warn("Camera denied:", e);
      setIsInterviewCamOn(false);
      showToast("Webcam access denied. Displaying virtual simulation backdrop.", "info");
    }
  };

  // Stop webcam stream
  const stopInterviewCamera = () => {
    if (userVideoRef.current && userVideoRef.current.srcObject) {
      const stream = userVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      userVideoRef.current.srcObject = null;
    }
    setIsInterviewCamOn(false);
  };

  // Start the actual virtual conference interview session
  const startInterview = async () => {
    setIsInterviewActive(true);
    setInterviewQuestionIndex(0);
    setInterviewTranscript([]);
    setCurrentSpeechTranscript("");
    setInterviewFeedback(null);
    
    // Start camera stream
    await startInterviewCamera();
    
    // Speak first question after a brief intro
    const welcomeText = `Welcome to your PrepXpert Virtual HR Interview. I am Priya, your placement coach. Let's begin. First question: ${TUTOR_QUESTIONS[0]}`;
    speakText(welcomeText);
  };

  // End interview and cleanup
  const endInterview = () => {
    stopInterviewCamera();
    setIsInterviewActive(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsBotSpeaking(false);
    showToast("Virtual HR interview completed.", "info");
  };

  // Speech Recognition specifically for the Video Interview
  const startInterviewSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech Recognition not supported in this browser. Please type your responses.", "error");
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsBotSpeaking(false);
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsInterviewListening(true);
      showToast("System listening... Start speaking your answer.", "info");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentSpeechTranscript(transcript);
      showToast("Speech captured! Click Submit to evaluate your phrasing.", "success");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsInterviewListening(false);
      showToast(`Mic error: ${event.error}`, "error");
    };

    recognition.onend = () => {
      setIsInterviewListening(false);
    };

    recognition.start();
  };

  // Evaluate the answer, advance to next question
  const submitInterviewAnswer = () => {
    if (!currentSpeechTranscript.trim()) {
      showToast("Please type or use the microphone to speak your response first.", "error");
      return;
    }

    setIsInterviewEvaluating(true);
    const text = currentSpeechTranscript.trim();

    // Analyze grammar
    const feedback = analyzeEnglish(text);

    // Save to interview log transcript
    const stepQuestion = TUTOR_QUESTIONS[interviewQuestionIndex];
    const newLog = {
      question: stepQuestion,
      answer: text,
      feedback
    };

    setInterviewTranscript(prev => [...prev, newLog]);
    setInterviewFeedback(feedback);
    setIsInterviewEvaluating(false);

    // Stop current speaking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Determine next step
    const nextIdx = interviewQuestionIndex + 1;
    if (nextIdx < TUTOR_QUESTIONS.length) {
      setInterviewQuestionIndex(nextIdx);
      setCurrentSpeechTranscript("");
      
      // Auto speak the next question
      setTimeout(() => {
        const nextText = `Got it. Here is the next question: ${TUTOR_QUESTIONS[nextIdx]}`;
        speakText(nextText);
      }, 1000);
    } else {
      // Completed all questions
      setTimeout(() => {
        const outroText = "Thank you for completing this virtual HR video interview session. You can review your grammar report below.";
        speakText(outroText);
        showToast("AI HR Interview complete! Check your aggregate feedback report.", "success");
      }, 1000);
    }
  };

  // Repeat current question
  const playInterviewQuestion = () => {
    const qText = TUTOR_QUESTIONS[interviewQuestionIndex];
    speakText(qText);
  };

  // Tutor Chat handlers
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userText = userChatInput.trim();
    setUserChatInput("");

    // Analyze grammar
    const feedback = analyzeEnglish(userText);

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      grammarAnalysis: feedback,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Bot reply after delay
    setIsBotSpeaking(true);
    setTimeout(() => {
      const nextIdx = tutorQuestionIndex + 1;
      let replyText = "";
      
      let grammarRemarks = "";
      if (feedback && feedback.hasMistakes) {
        grammarRemarks = `I noticed some grammar issues. Click the 'Feedback Available' badge under your response to check details. `;
      } else {
        grammarRemarks = `Great! Your response is grammatically correct. `;
      }

      if (nextIdx < TUTOR_QUESTIONS.length) {
        setTutorQuestionIndex(nextIdx);
        replyText = `${grammarRemarks}Next question: ${TUTOR_QUESTIONS[nextIdx]}`;
      } else {
        replyText = `${grammarRemarks}Well done! You have completed all interactive tutoring questions. Feel free to review our chat and the feedback tags above.`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);
      if (isVoiceEnabled) {
        speakText(replyText);
      } else {
        setIsBotSpeaking(false);
      }
    }, 1000);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech Recognition not supported in this browser. Please type your responses.", "error");
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsBotSpeaking(false);
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      showToast("Listening...", "info");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserChatInput(transcript);
      showToast("Speech captured!", "success");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      showToast(`Mic error: ${event.error}`, "error");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };


  // Run Sentence Corrector Analysis
  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      showToast("Please enter a sentence to analyze.", "error");
      return;
    }
    const result = analyzeEnglish(inputText);
    setAnalysisResult(result);
    if (result.hasMistakes) {
      showToast("Analysis complete. Found suggestions to polish your sentence!", "info");
    } else {
      showToast("Great job! Your sentence is grammatically correct.", "success");
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Corrected sentence copied to clipboard!", "success");
  };


  return (
    <div style={styles.container} className="animate-slide-up">
      
      {/* HEADER SECTION */}
      <div className="glass-panel" style={styles.header}>
        <div style={styles.headerTitleContainer}>
          <Languages size={26} color="var(--brand-primary)" />
          <div>
            <h3 style={styles.headerTitle}>AI English Skills Optimizer</h3>
            <p style={styles.headerSubtitle}>Improve your sentence formation, grammar, and vocabulary for placement interviews.</p>
          </div>
        </div>

        <div style={styles.subTabsContainer}>
          <button 
            style={{
              ...styles.subTabButton,
              background: activeSubTab === "corrector" ? "var(--brand-gradient)" : "rgba(255,255,255,0.02)",
              color: activeSubTab === "corrector" ? "white" : "var(--text-secondary)"
            }}
            onClick={() => setActiveSubTab("corrector")}
          >
            <Sparkles size={16} />
            Sentence Corrector
          </button>
          <button 
            style={{
              ...styles.subTabButton,
              background: activeSubTab === "tutor" ? "var(--brand-gradient)" : "rgba(255,255,255,0.02)",
              color: activeSubTab === "tutor" ? "white" : "var(--text-secondary)"
            }}
            onClick={() => setActiveSubTab("tutor")}
          >
            <MessageSquare size={16} />
            AI English Tutor
          </button>
          <button 
            style={{
              ...styles.subTabButton,
              background: activeSubTab === "video" ? "var(--brand-gradient)" : "rgba(255,255,255,0.02)",
              color: activeSubTab === "video" ? "white" : "var(--text-secondary)"
            }}
            onClick={() => setActiveSubTab("video")}
          >
            <Video size={16} />
            AI Video Conference
          </button>
        </div>
      </div>

      {/* CORE INTERFACE */}
      {activeSubTab === "corrector" && (
        <div style={styles.mainGrid}>
          
          {/* INPUT FORM BLOCK */}
          <div className="glass-panel" style={styles.card}>
            <h4 style={styles.cardTitle}>Analyze Sentence</h4>
            <form onSubmit={handleAnalyze} style={styles.form}>
              <div className="input-group">
                <label className="input-label" htmlFor="english-input">Type your sentence or paragraph here:</label>
                <textarea
                  id="english-input"
                  style={styles.textarea}
                  className="input-field"
                  placeholder="e.g. I has finished my graduation on yesterday..."
                  rows="4"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {/* Preset buttons */}
              <div style={styles.presetsWrapper}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Quick Test Presets:</span>
                <div style={styles.presetsList}>
                  {PRESETS.map((p, idx) => (
                    <button 
                      key={idx} 
                      type="button" 
                      style={styles.presetBadge}
                      onClick={() => setInputText(p)}
                    >
                      Preset {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.actionsRow}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Analyze & Polish
                  <Sparkles size={16} />
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setInputText(""); setAnalysisResult(null); }}
                  title="Clear inputs"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* RESULTS BLOCK */}
          <div className="glass-panel" style={styles.card}>
            <h4 style={styles.cardTitle}>Polish & Corrections</h4>
            {analysisResult ? (
              <div style={styles.resultsContainer}>
                
                {/* CORRECTED VIEW */}
                <div className="glass-card" style={styles.correctedBox}>
                  <div style={styles.correctedHeader}>
                    <span style={styles.badgeSuccess}>POLISHED SENTENCE</span>
                    <button 
                      style={styles.copyBtn} 
                      onClick={() => handleCopyText(analysisResult.correctedText)}
                      title="Copy Polished Sentence"
                    >
                      <Clipboard size={16} />
                    </button>
                  </div>
                  <p style={styles.correctedText}>{analysisResult.correctedText}</p>
                </div>

                {/* DETECTED GRAMMAR ERRORS */}
                <div style={styles.errorSection}>
                  <h5 style={styles.sectionHeading}>
                    <AlertTriangle size={16} color="var(--accent-rose)" />
                    Grammar & Formation Remarks ({analysisResult.errors.length})
                  </h5>
                  <div style={styles.errorsList}>
                    {analysisResult.errors.map((err, idx) => (
                      <div className="glass-card" style={styles.errorItem} key={idx}>
                        <div style={styles.errorHeader}>
                          <span style={styles.mistakeText}>Incorrect: {err.mistake}</span>
                          <ArrowRight size={14} color="var(--text-secondary)" />
                          <span style={styles.fixText}>Correct: {err.fix}</span>
                        </div>
                        <p style={styles.errorExplanation}>{err.explanation}</p>
                      </div>
                    ))}
                    {analysisResult.errors.length === 0 && (
                      <div style={styles.successPlaceholder}>
                        <CheckCircle2 size={32} color="var(--accent-emerald)" />
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No grammar issues detected! Excellent.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* VOCABULARY SUGGESTIONS */}
                {analysisResult.vocabSuggestions.length > 0 && (
                  <div style={styles.vocabSection}>
                    <h5 style={styles.sectionHeading}>
                      <Sparkles size={16} color="var(--brand-accent)" />
                      Professional Word Enhancements
                    </h5>
                    <div style={styles.vocabList}>
                      {analysisResult.vocabSuggestions.map((item, idx) => (
                        <div className="glass-card" style={styles.vocabItem} key={idx}>
                          <div style={styles.vocabWordRow}>
                            <span style={styles.oldWord}>"{item.original}"</span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>could be elevated to</span>
                            <span style={styles.newWord}>{item.suggested}</span>
                          </div>
                          <p style={styles.vocabExp}>{item.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.emptyResults}>
                <FileText size={48} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                <p style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Submit a sentence on the left to see grammatical analysis and suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeSubTab === "tutor" && (
        /* INTERACTIVE TUTOR CHAT */
        <div style={styles.tutorContainer} className="glass-panel">
          {/* CHAT SESSION HEADER */}
          <div style={styles.chatSessionHeader}>
            <div style={styles.chatHeaderLeft}>
              <Sparkles size={16} color="var(--brand-accent)" style={{ animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Interactive Coaching Session</span>
              {isBotSpeaking && (
                <div style={styles.soundWave} className="sound-wave">
                  <div style={{ ...styles.waveBar, animationDelay: "0s" }} className="wave-bar" />
                  <div style={{ ...styles.waveBar, animationDelay: "0.15s" }} className="wave-bar" />
                  <div style={{ ...styles.waveBar, animationDelay: "0.3s" }} className="wave-bar" />
                </div>
              )}
            </div>
            
            <button
              style={{
                ...styles.voiceModeToggleBtn,
                borderColor: isVoiceEnabled ? "var(--accent-emerald)" : "var(--border-color)",
                color: isVoiceEnabled ? "var(--accent-emerald)" : "var(--text-secondary)",
                background: isVoiceEnabled ? "rgba(16, 185, 129, 0.08)" : "transparent"
              }}
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              title="Toggle AI Speak Back (Text-To-Speech)"
            >
              {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>Voice Mode: {isVoiceEnabled ? "Active (Speech Enabled)" : "Muted"}</span>
            </button>
          </div>

          <div style={styles.chatArea}>
            <div style={styles.chatMessagesList}>
              {chatMessages.map(msg => (
                <div 
                  key={msg.id} 
                  style={{
                    ...styles.messageRow,
                    justifyContent: msg.sender === "bot" ? "flex-start" : "flex-end"
                  }}
                >
                  {msg.sender === "bot" && (
                    <div style={styles.botAvatar}>
                      <Sparkles size={14} color="white" />
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", maxWidth: "70%" }}>
                    <div 
                      style={{
                        ...styles.chatBubble,
                        background: msg.sender === "bot" ? "var(--bg-accent)" : "var(--brand-gradient)",
                        color: "#ffffff",
                        borderRadius: msg.sender === "bot" ? "0 16px 16px 16px" : "16px 0 16px 16px"
                      }}
                    >
                      {msg.sender === "bot" ? (
                        <div style={styles.botBubbleContent}>
                          <p style={{ whiteSpace: "pre-line", fontSize: "0.95rem", lineHeight: "1.4", flex: 1 }}>{msg.text}</p>
                          <button 
                            type="button"
                            style={styles.speakBubbleBtn}
                            onClick={() => speakText(msg.text)}
                            title="Speak Message"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <p style={{ whiteSpace: "pre-line", fontSize: "0.95rem", lineHeight: "1.4" }}>{msg.text}</p>
                      )}
                      
                      {/* Grammar indicator badge */}
                      {msg.sender === "user" && msg.grammarAnalysis?.hasMistakes && (
                        <button 
                          style={styles.warningBadge}
                          onClick={() => setSelectedFeedbackMessage(msg)}
                        >
                          <AlertTriangle size={12} style={{ marginRight: 4 }} />
                          Feedback Available ({msg.grammarAnalysis.errors.length})
                        </button>
                      )}
                    </div>
                    <span style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      marginTop: 4,
                      textAlign: msg.sender === "bot" ? "left" : "right"
                    }}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === "user" && (
                    <div style={styles.userAvatar}>
                      <User size={14} color="white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* FEEDBACK SLIDEOUT PANEL */}
            {selectedFeedbackMessage && (
              <div style={styles.feedbackSlideout} className="glass-panel">
                <div style={styles.slideoutHeader}>
                  <h4 style={styles.slideoutTitle}>AI Placement Feedback</h4>
                  <button 
                    style={styles.closeSlideoutBtn}
                    onClick={() => setSelectedFeedbackMessage(null)}
                  >
                    ×
                  </button>
                </div>
                <div style={styles.slideoutContent}>
                  <div style={styles.bubbleFeedbackPreview}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Your Response:</p>
                    <p style={{ fontStyle: "italic", margin: "4px 0", fontSize: "0.9rem" }}>"{selectedFeedbackMessage.text}"</p>
                    
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 12 }}>Polished Phrasing:</p>
                    <p style={{ color: "var(--accent-emerald)", fontWeight: 600, fontSize: "0.9rem" }}>
                      "{selectedFeedbackMessage.grammarAnalysis.correctedText}"
                    </p>
                  </div>

                  <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "16px 0 8px 0" }}>Corrections:</h5>
                  <div style={styles.slideoutErrorsList}>
                    {selectedFeedbackMessage.grammarAnalysis.errors.map((err, idx) => (
                      <div className="glass-card" style={styles.slideoutErrorItem} key={idx}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", fontSize: "0.85rem" }}>
                          <span style={{ color: "var(--accent-rose)", textDecoration: "line-through" }}>{err.mistake}</span>
                          <span style={{ color: "var(--accent-emerald)" }}>{err.fix}</span>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>{err.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {selectedFeedbackMessage.grammarAnalysis.vocabSuggestions.length > 0 && (
                    <>
                      <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "16px 0 8px 0" }}>Suggested Words:</h5>
                      <div style={styles.slideoutErrorsList}>
                        {selectedFeedbackMessage.grammarAnalysis.vocabSuggestions.map((item, idx) => (
                          <div className="glass-card" style={styles.slideoutErrorItem} key={idx}>
                            <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>Use "{item.suggested}" instead of "{item.original}"</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>{item.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* INPUT FORM CHAT */}
          <form onSubmit={handleSendChat} style={styles.chatInputForm}>
            <button 
              type="button"
              style={{
                ...styles.micBtn,
                borderColor: isListening ? "var(--accent-rose)" : "var(--border-color)",
                color: isListening ? "var(--accent-rose)" : "var(--text-secondary)",
                background: isListening ? "rgba(244, 63, 94, 0.1)" : "rgba(255,255,255,0.02)"
              }}
              onClick={startSpeechRecognition}
              title={isListening ? "Coach is listening..." : "Speak into microphone (Speech-to-Text)"}
            >
              {isListening ? (
                <Radio size={18} style={{ animation: "pulse 1s infinite" }} />
              ) : (
                <Mic size={18} />
              )}
            </button>

            <input 
              type="text"
              style={styles.chatInput}
              className="input-field"
              placeholder={isListening ? "Listening... Speak clearly now." : "Type or click the microphone to speak your response..."}
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              disabled={isListening}
            />
            
            <button type="submit" className="btn btn-primary" style={styles.sendBtn} disabled={isListening}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {activeSubTab === "video" && (
        <div style={styles.videoWorkspace}>
          {!isInterviewActive ? (
            <div className="glass-panel" style={styles.videoIntroCard}>
              <div style={styles.videoIntroIconContainer}>
                <Video size={48} color="var(--brand-primary)" style={{ animation: "pulse 2s infinite" }} />
              </div>
              <h3 style={styles.videoIntroTitle}>Virtual HR Interview Chamber</h3>
              <p style={styles.videoIntroText}>
                Accelerate your campus placement preparation by simulating a live corporate HR interview. 
                Experience a side-by-side virtual video conference with <strong>Priya, AI Placement Director</strong>. 
                Priya will ask placement-related questions aloud, and you will respond by speaking into your microphone.
              </p>
              
              <div className="glass-card" style={styles.rulesList}>
                <h5 style={{ fontWeight: 700, marginBottom: "10px", color: "var(--brand-accent)" }}>Chamber Guidelines:</h5>
                <ul style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                  <li>Ensure your microphone and webcam permissions are granted.</li>
                  <li>Listen to the AI's questions. You can repeat them using the Volume button.</li>
                  <li>Click the microphone icon to record your response. Review the transcript.</li>
                  <li>Click <strong>Submit Answer</strong> to evaluate your grammar and advance to the next question.</li>
                </ul>
              </div>

              <button className="btn btn-primary" style={{ padding: "12px 32px", fontSize: "1rem", marginTop: "12px" }} onClick={startInterview}>
                Start Virtual Interview
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div style={styles.interviewCallContainer}>
              {/* VIDEO CALL PANEL */}
              <div style={styles.videoConferenceGrid}>
                
                {/* AI INTERVIEWER WINDOW */}
                <div className="glass-panel" style={styles.videoFeedBox}>
                  <div style={styles.videoFeedHeader}>
                    <span style={styles.feedStatusBadge}>🔴 VIRTUAL COACH</span>
                    <span style={styles.feedName}>Priya (AI HR Director)</span>
                  </div>
                  
                  {/* AI AVATAR PLACEHOLDER */}
                  <div style={styles.avatarVisualContainer}>
                    <div style={{
                      ...styles.avatarPulseOuter,
                      animation: isBotSpeaking ? "pulse 1.5s infinite" : "none",
                      borderColor: isBotSpeaking ? "var(--brand-accent)" : "rgba(255,255,255,0.06)"
                    }}>
                      <div style={styles.avatarPulseInner}>
                        <User size={48} color="white" />
                      </div>
                    </div>
                    {isBotSpeaking && (
                      <div style={{ marginTop: "16px" }} className="sound-wave">
                        <div className="wave-bar" style={{ height: "16px", width: "4px" }} />
                        <div className="wave-bar" style={{ height: "24px", width: "4px" }} />
                        <div className="wave-bar" style={{ height: "12px", width: "4px" }} />
                        <div className="wave-bar" style={{ height: "20px", width: "4px" }} />
                      </div>
                    )}
                  </div>

                  {/* AI CAPTION BANNER */}
                  <div style={styles.speechCaptionBox}>
                    <p style={styles.speechCaptionLabel}>AI QUESTION:</p>
                    <p style={styles.speechCaptionText}>
                      {interviewQuestionIndex < TUTOR_QUESTIONS.length 
                        ? `"${TUTOR_QUESTIONS[interviewQuestionIndex]}"`
                        : `"Interview completed. You can review your placement grammar report below."`}
                    </p>
                  </div>
                </div>

                {/* STUDENT WEBCAM WINDOW */}
                <div className="glass-panel" style={styles.videoFeedBox}>
                  <div style={styles.videoFeedHeader}>
                    <span style={styles.feedStatusBadgeGreen}>🔴 CANDIDATE LIVE</span>
                    <span style={styles.feedName}>Student (You)</span>
                  </div>

                  <div style={styles.webcamStreamWrapper}>
                    <video 
                      ref={userVideoRef} 
                      style={{
                        ...styles.userWebcamVideo,
                        display: isInterviewCamOn ? "block" : "none"
                      }}
                      playsInline 
                      muted 
                    />
                    
                    {!isInterviewCamOn && (
                      <div style={styles.webcamFallback}>
                        <VideoOff size={40} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "8px" }}>
                          Webcam feed is offline or blocked.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* STUDENT SPEECH CAPTION */}
                  <div style={styles.speechCaptionBox}>
                    <p style={styles.speechCaptionLabelCandidate}>YOUR SPEECH RESPONSE:</p>
                    {isInterviewListening ? (
                      <p style={{ color: "var(--brand-accent)", fontWeight: 600, fontSize: "0.95rem" }} className="blink-text">
                        🎙️ Listening to microphone... Speak clearly.
                      </p>
                    ) : (
                      <textarea
                        style={styles.speechCaptionInputText}
                        placeholder="Click microphone below to speak, or type your answer here..."
                        value={currentSpeechTranscript}
                        onChange={(e) => setCurrentSpeechTranscript(e.target.value)}
                      />
                    )}
                  </div>
                </div>

              </div>

              {/* CONFERENCES CONTROLS TOOLBAR (TEAMS STYLE) */}
              <div className="glass-card" style={styles.videoControlBar}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button 
                    type="button" 
                    style={{
                      ...styles.controlRoundBtn,
                      background: isInterviewCamOn ? "rgba(255,255,255,0.06)" : "var(--accent-rose)",
                      color: "white"
                    }}
                    onClick={isInterviewCamOn ? stopInterviewCamera : startInterviewCamera}
                    title={isInterviewCamOn ? "Turn Camera Off" : "Turn Camera On"}
                  >
                    {isInterviewCamOn ? <Video size={18} /> : <VideoOff size={18} />}
                  </button>

                  <button 
                    type="button" 
                    style={{
                      ...styles.controlRoundBtn,
                      background: isInterviewListening ? "var(--accent-rose)" : "rgba(255,255,255,0.06)",
                      color: "white"
                    }}
                    onClick={startInterviewSpeech}
                    disabled={interviewQuestionIndex >= TUTOR_QUESTIONS.length}
                    title={isInterviewListening ? "Recording Active..." : "Record Speech (Speech-to-Text)"}
                  >
                    <Mic size={18} />
                  </button>

                  <button 
                    type="button" 
                    style={styles.controlRoundBtn}
                    onClick={playInterviewQuestion}
                    title="Repeat AI Question Voice"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ height: "40px", padding: "0 24px", fontSize: "0.85rem" }}
                    onClick={submitInterviewAnswer}
                    disabled={isInterviewEvaluating || interviewQuestionIndex >= TUTOR_QUESTIONS.length}
                  >
                    {isInterviewEvaluating ? "Evaluating..." : "Submit Answer"}
                    <ArrowRight size={16} />
                  </button>

                  <button 
                    type="button" 
                    style={{ ...styles.controlRoundBtn, background: "var(--accent-rose)", color: "white" }}
                    onClick={endInterview}
                    title="Hang Up / End Session"
                  >
                    <PhoneOff size={18} />
                  </button>
                </div>
              </div>

              {/* REAL-TIME FEEDBACK PANEL */}
              {interviewFeedback && (
                <div className="glass-panel animate-slide-up" style={styles.realtimeFeedbackPanel}>
                  <div style={styles.feedbackHeaderRow}>
                    <h4 style={styles.feedbackSectionTitle}>AI Placement Grammar Assessment</h4>
                    <span style={interviewFeedback.hasMistakes ? styles.assessmentBadgeWarning : styles.assessmentBadgeSuccess}>
                      {interviewFeedback.hasMistakes ? "Needs Polish" : "Grammatically Sound"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "12px" }}>
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>POLISHED PHRASING:</p>
                      <p style={styles.realtimeCorrectedText}>"{interviewFeedback.correctedText}"</p>
                    </div>

                    {interviewFeedback.errors.length > 0 && (
                      <div style={{ flex: 1.5, minWidth: "300px" }}>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "8px" }}>
                          CORRECTION BREAKDOWN:
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {interviewFeedback.errors.slice(0, 2).map((err, idx) => (
                            <div key={idx} style={styles.feedbackBriefItem}>
                              <span style={{ color: "var(--accent-rose)", textDecoration: "line-through" }}>{err.mistake}</span>
                              <ArrowRight size={12} />
                              <span style={{ color: "var(--accent-emerald)" }}>{err.fix}</span>
                              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                                {err.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AGGREGATE END REPORT (TRANSCRIPT) */}
              {interviewQuestionIndex >= TUTOR_QUESTIONS.length && (
                <div className="glass-panel animate-slide-up" style={{ marginTop: "24px", padding: "28px" }}>
                  <h4 style={{ ...styles.cardTitle, borderLeftColor: "var(--accent-emerald)" }}>
                    Placement Readiness Performance Report
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                    Congratulations on completing the virtual HR round. Review the details below to improve your verbal scores.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {interviewTranscript.map((log, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: "20px", textAlign: "left" }}>
                        <h5 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--brand-accent)", marginBottom: "6px" }}>
                          Q{idx + 1}: "{log.question}"
                        </h5>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontStyle: "italic", margin: "6px 0" }}>
                          Your Answer: "{log.answer}"
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "var(--accent-emerald)", fontWeight: 600 }}>
                          Polished: "{log.feedback.correctedText}"
                        </p>
                        {log.feedback.errors.length > 0 && (
                          <div style={{ marginTop: "10px", paddingLeft: "10px", borderLeft: "2px solid var(--accent-rose)" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Grammar Tips:</span>
                            <ul style={{ paddingLeft: "15px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                              {log.feedback.errors.map((err, eIdx) => (
                                <li key={eIdx}>
                                  Replace <strong>{err.mistake}</strong> with <strong>{err.fix}</strong>: {err.explanation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button className="btn btn-secondary" style={{ marginTop: "20px" }} onClick={endInterview}>
                    Return to Chamber Lobby
                  </button>
                </div>
              )}

            </div>
          )}
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
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderRadius: "16px",
    flexWrap: "wrap",
    gap: "16px"
  },
  headerTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    textAlign: "left"
  },
  headerTitle: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "var(--text-primary)"
  },
  headerSubtitle: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)"
  },
  subTabsContainer: {
    display: "flex",
    gap: "8px",
    background: "rgba(255,255,255,0.02)",
    padding: "4px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)"
  },
  subTabButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "all 0.3s ease"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "24px",
    alignItems: "start"
  },
  card: {
    padding: "28px"
  },
  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
    marginBottom: "16px",
    textAlign: "left",
    borderLeft: "3px solid var(--brand-primary)",
    paddingLeft: "10px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    resize: "vertical",
    fontSize: "0.95rem"
  },
  presetsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "left"
  },
  presetsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },
  presetBadge: {
    padding: "6px 12px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  actionsRow: {
    display: "flex",
    gap: "10px",
    marginTop: "8px"
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left"
  },
  correctedBox: {
    padding: "16px",
    background: "rgba(16, 185, 129, 0.05)",
    borderColor: "rgba(16, 185, 129, 0.2)"
  },
  correctedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  badgeSuccess: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--accent-emerald)",
    letterSpacing: "0.5px"
  },
  correctedText: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "var(--text-primary)"
  },
  copyBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "color 0.2s ease"
  },
  sectionHeading: {
    fontSize: "1rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px"
  },
  errorsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  errorItem: {
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.01)"
  },
  errorHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "6px"
  },
  mistakeText: {
    color: "var(--accent-rose)",
    fontSize: "0.85rem",
    fontWeight: 600,
    textDecoration: "line-through"
  },
  fixText: {
    color: "var(--accent-emerald)",
    fontSize: "0.85rem",
    fontWeight: 600
  },
  errorExplanation: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4"
  },
  successPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 0",
    gap: "10px"
  },
  vocabList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  vocabItem: {
    padding: "12px 16px",
    background: "rgba(192, 132, 252, 0.03)"
  },
  vocabWordRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "4px"
  },
  oldWord: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    fontStyle: "italic"
  },
  newWord: {
    color: "var(--brand-accent)",
    fontSize: "0.85rem",
    fontWeight: 700
  },
  vocabExp: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)"
  },
  emptyResults: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "260px",
    textAlign: "center"
  },
  tutorContainer: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 220px)",
    minHeight: "480px"
  },
  chatArea: {
    flex: 1,
    display: "flex",
    position: "relative",
    overflow: "hidden"
  },
  chatMessagesList: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    width: "100%"
  },
  botAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "var(--brand-gradient)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "var(--shadow-sm)"
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "var(--bg-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "var(--shadow-sm)"
  },
  chatBubble: {
    padding: "12px 18px",
    textAlign: "left",
    boxShadow: "var(--shadow-sm)"
  },
  warningBadge: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: "8px",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "rgba(245, 158, 11, 0.15)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    color: "var(--accent-amber)",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer"
  },
  chatInputForm: {
    display: "flex",
    padding: "16px 24px",
    gap: "12px",
    borderTop: "1px solid var(--border-color)",
    background: "rgba(10, 8, 22, 0.4)"
  },
  chatInput: {
    flex: 1,
    fontSize: "0.95rem"
  },
  sendBtn: {
    padding: "0 18px",
    height: "46px"
  },
  feedbackSlideout: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "320px",
    height: "100%",
    borderLeft: "1px solid var(--border-color)",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: "-8px 0 32px rgba(0,0,0,0.3)",
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
  },
  slideoutHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border-color)"
  },
  slideoutTitle: {
    fontSize: "1rem",
    fontWeight: 700
  },
  closeSlideoutBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: "1.5rem",
    lineHeight: "1",
    cursor: "pointer"
  },
  slideoutContent: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    textAlign: "left"
  },
  bubbleFeedbackPreview: {
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--border-color)"
  },
  slideoutErrorsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  slideoutErrorItem: {
    padding: "10px 12px",
    background: "rgba(255, 255, 255, 0.01)"
  },
  botBubbleContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    width: "100%"
  },
  speakBubbleBtn: {
    background: "rgba(255, 255, 255, 0.06)",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--text-secondary)",
    transition: "all 0.2s ease"
  },
  chatSessionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "1px solid var(--border-color)",
    background: "rgba(255, 255, 255, 0.01)",
    flexWrap: "wrap",
    gap: "12px"
  },
  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  voiceModeToggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid var(--border-color)",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  micBtn: {
    width: "46px",
    height: "46px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  soundWave: {
    display: "flex",
    alignItems: "flex-end",
    gap: "2px",
    height: "16px",
    marginLeft: "8px"
  },
  waveBar: {
    width: "2px",
    height: "4px",
    backgroundColor: "var(--brand-accent)",
    borderRadius: "1px",
    animation: "soundWaveHeight 0.8s ease-in-out infinite"
  },
  videoWorkspace: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    minHeight: "480px"
  },
  videoIntroCard: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "20px"
  },
  videoIntroIconContainer: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(144, 97, 249, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    border: "1px solid rgba(144, 97, 249, 0.2)"
  },
  videoIntroTitle: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "var(--text-primary)"
  },
  videoIntroText: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    maxWidth: "640px"
  },
  rulesList: {
    padding: "20px",
    width: "100%",
    maxWidth: "500px",
    background: "rgba(255,255,255,0.01)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px"
  },
  interviewCallContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%"
  },
  videoConferenceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "20px"
  },
  videoFeedBox: {
    position: "relative",
    height: "360px",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: "rgba(10, 8, 22, 0.6)"
  },
  videoFeedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 18px",
    background: "rgba(10, 8, 22, 0.4)",
    borderBottom: "1px solid var(--border-color)",
    zIndex: 10
  },
  feedStatusBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--brand-accent)",
    padding: "2px 8px",
    borderRadius: "4px",
    background: "rgba(144, 97, 249, 0.15)",
    border: "1px solid rgba(144, 97, 249, 0.25)"
  },
  feedStatusBadgeGreen: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--accent-emerald)",
    padding: "2px 8px",
    borderRadius: "4px",
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.25)"
  },
  feedName: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-secondary)"
  },
  avatarVisualContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  avatarPulseOuter: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarPulseInner: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    background: "var(--bg-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow-sm)"
  },
  webcamStreamWrapper: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#080612",
    overflow: "hidden"
  },
  userWebcamVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)"
  },
  webcamFallback: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  speechCaptionBox: {
    padding: "16px 20px",
    background: "rgba(10, 8, 22, 0.5)",
    borderTop: "1px solid var(--border-color)",
    textAlign: "left",
    zIndex: 10
  },
  speechCaptionLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--brand-accent)",
    letterSpacing: "0.5px",
    marginBottom: "4px"
  },
  speechCaptionLabelCandidate: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--accent-emerald)",
    letterSpacing: "0.5px",
    marginBottom: "4px"
  },
  speechCaptionText: {
    fontSize: "0.95rem",
    fontWeight: 600,
    lineHeight: "1.4",
    color: "var(--text-primary)",
    fontStyle: "italic"
  },
  speechCaptionInputText: {
    width: "100%",
    height: "36px",
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    resize: "none",
    outline: "none",
    fontFamily: "inherit"
  },
  videoControlBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    background: "rgba(10, 8, 22, 0.55)",
    borderRadius: "14px",
    border: "1px solid var(--border-color)"
  },
  controlRoundBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid var(--border-color)",
    background: "rgba(255,255,255,0.02)",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  realtimeFeedbackPanel: {
    padding: "20px 24px",
    textAlign: "left"
  },
  feedbackHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  feedbackSectionTitle: {
    fontSize: "1rem",
    fontWeight: 700
  },
  assessmentBadgeWarning: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--accent-rose)",
    background: "rgba(244, 63, 94, 0.15)",
    border: "1px solid rgba(244, 63, 94, 0.25)",
    padding: "2px 8px",
    borderRadius: "4px"
  },
  assessmentBadgeSuccess: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--accent-emerald)",
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    padding: "2px 8px",
    borderRadius: "4px"
  },
  realtimeCorrectedText: {
    fontSize: "0.95rem",
    color: "var(--accent-emerald)",
    fontWeight: 600,
    lineHeight: "1.4",
    marginTop: "6px"
  },
  feedbackBriefItem: {
    padding: "8px 12px",
    background: "rgba(255,255,255,0.01)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "0.85rem"
  }
};
