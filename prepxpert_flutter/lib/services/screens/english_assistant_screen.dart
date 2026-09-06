import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../models/message.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../services/database_service.dart';

// --- Grammar Grammar rules checker translated from JavaScript ---
GrammarAnalysis analyzeEnglish(String text) {
  if (text.trim().isEmpty) {
    return GrammarAnalysis(
      originalText: text,
      correctedText: text,
      errors: [],
      vocabSuggestions: [],
      hasMistakes: false,
    );
  }

  final errors = <GrammarError>[];
  String correctedText = text;

  // Rule 1: Subject-Verb Agreement
  final regexPluralSubj = RegExp(r'\b(i|you|we|they)\s+(has|goes|likes|wants|runs|does)\b', caseSensitive: false);
  for (final match in regexPluralSubj.allMatches(text)) {
    final p1 = match.group(1)!;
    final p2 = match.group(2)!;
    String correctVerb = p2.toLowerCase() == "has" 
        ? "have" 
        : p2.toLowerCase() == "does" 
            ? "do" 
            : p2.replaceAll(RegExp(r'es$', caseSensitive: false), '').replaceAll(RegExp(r's$', caseSensitive: false), '');
    
    errors.add(GrammarError(
      mistake: "$p1 $p2",
      fix: "$p1 $correctVerb",
      explanation: "The pronouns 'I', 'you', 'we', and 'they' require plural verbs (e.g. 'have', 'go') without the '-s' suffix."
    ));
    correctedText = correctedText.replaceAll(match.group(0)!, "$p1 $correctVerb");
  }

  final regexSingularSubj = RegExp(r'\b(he|she|it|everyone|someone|everybody|each)\s+(have|go|like|want|run|do)\b', caseSensitive: false);
  for (final match in regexSingularSubj.allMatches(text)) {
    final p1 = match.group(1)!;
    final p2 = match.group(2)!;
    String correctVerb = p2.toLowerCase() == "have" 
        ? "has" 
        : p2.toLowerCase() == "go" 
            ? "goes" 
            : p2.toLowerCase() == "do" 
                ? "does" 
                : "${p2}s";
    
    errors.add(GrammarError(
      mistake: "$p1 $p2",
      fix: "$p1 $correctVerb",
      explanation: "Singular pronouns ('he', 'she', 'it') and indefinite pronouns ('everyone', 'each') require singular verbs (e.g. 'has', 'goes') ending in '-s'."
    ));
    correctedText = correctedText.replaceAll(match.group(0)!, "$p1 $correctVerb");
  }

  // Rule 2: Past Tense indicators
  final regexDidPast = RegExp(r'\bdid\s+(\w+ed|\w+t)\b', caseSensitive: false);
  for (final match in regexDidPast.allMatches(text)) {
    final p1 = match.group(1)!;
    String baseForm = p1;
    if (p1.endsWith("ed")) baseForm = p1.substring(0, p1.length - 2);
    if (baseForm.endsWith("l")) baseForm += "e";
    
    errors.add(GrammarError(
      mistake: "did $p1",
      fix: "$p1 or did $baseForm",
      explanation: "Avoid using a past tense verb directly after the auxiliary verb 'did'. Use the base form instead."
    ));
    correctedText = correctedText.replaceAll(match.group(0)!, "did $baseForm");
  }

  final regexTimePast = RegExp(r'\b(yesterday|last\s+(year|month|week|day)|ago)\s+(\w+)\b', caseSensitive: false);
  final presentToPast = {
    "go": "went", "take": "took", "make": "made", "see": "saw", "get": "got",
    "write": "wrote", "speak": "spoke", "think": "thought", "run": "ran",
    "has": "had", "have": "had", "is": "was", "are": "were"
  };
  for (final match in regexTimePast.allMatches(text)) {
    final p1 = match.group(1)!;
    final p3 = match.group(3)!.toLowerCase();
    if (presentToPast.containsKey(p3)) {
      final correctPast = presentToPast[p3]!;
      errors.add(GrammarError(
        mistake: "$p1 ${match.group(3)}",
        fix: "$p1 $correctPast",
        explanation: "Past time indicators (yesterday, last, ago) require verbs in the simple past tense."
      ));
      correctedText = correctedText.replaceAll(match.group(0)!, "$p1 $correctPast");
    }
  }

  // Rule 3: Redundant prepositions & idioms
  final preps = {
    "discuss about": "discuss",
    "cop up with": "cope with",
    "return back": "return",
    "on yesterday": "yesterday",
    "married with": "married to"
  };
  for (final entry in preps.entries) {
    final regex = RegExp('\\b${entry.key}\\b', caseSensitive: false);
    if (regex.hasMatch(text)) {
      String explanation = "";
      if (entry.key == "discuss about") {
        explanation = "The verb 'discuss' means 'to talk about', making the preposition 'about' redundant.";
      } else if (entry.key == "cop up with") {
        explanation = "The correct idiomatic phrase is 'cope with'.";
      } else if (entry.key == "return back") {
        explanation = "'Return' means 'to go back', making the word 'back' redundant.";
      } else if (entry.key == "on yesterday") {
        explanation = "Do not use prepositions before adverbs like yesterday, today or tomorrow.";
      } else if (entry.key == "married with") {
        explanation = "The correct preposition following 'married' is 'to' for relationships.";
      }
      errors.add(GrammarError(
        mistake: entry.key,
        fix: entry.value,
        explanation: explanation
      ));
      correctedText = correctedText.replaceAll(regex, entry.value);
    }
  }

  // Rule 4: Word Choice / Confused Words
  final regexTheirIs = RegExp(r'\btheir\s+(is|are|was|were)\b', caseSensitive: false);
  for (final match in regexTheirIs.allMatches(text)) {
    final p1 = match.group(1)!;
    errors.add(GrammarError(
      mistake: match.group(0)!,
      fix: "there $p1",
      explanation: "'Their' is possessive. Use 'there' to indicate existence or location."
    ));
    correctedText = correctedText.replaceAll(match.group(0)!, "there $p1");
  }

  final regexThereNoun = RegExp(r'\b(there|they\'re)\s+(book|car|house|project|skills|resume|graduation)\b', caseSensitive: false);
  for (final match in regexThereNoun.allMatches(text)) {
    final p2 = match.group(2)!;
    errors.add(GrammarError(
      mistake: match.group(0)!,
      fix: "their $p2",
      explanation: "Use the possessive pronoun 'their' to indicate ownership of '$p2'."
    ));
    correctedText = correctedText.replaceAll(match.group(0)!, "their $p2");
  }

  final regexItsA = RegExp(r'\b(its)\s+a\s+(\w+)\b', caseSensitive: false);
  for (final match in regexItsA.allMatches(text)) {
    final p2 = match.group(2)!;
    errors.add(GrammarError(
      mistake: "its a $p2",
      fix: "it's a $p2",
      explanation: "'Its' is possessive. Use the contraction 'it's' (it is) before the noun."
    ));
    correctedText = correctedText.replaceAll(match.group(0)!, "it's a $p2");
  }

  // Capitalize start
  final trimmed = text.trim();
  if (trimmed.isNotEmpty && trimmed[0] != trimmed[0].toUpperCase()) {
    errors.add(GrammarError(
      mistake: 'First letter "${trimmed[0]}" is lowercase',
      fix: 'Capitalize to "${trimmed[0].toUpperCase()}"',
      explanation: "A sentence should always begin with a capital letter."
    ));
    final idx = correctedText.indexOf(trimmed[0]);
    if (idx != -1) {
      correctedText = correctedText.replaceRange(idx, idx + 1, trimmed[0].toUpperCase());
    }
  }

  // Period ending
  if (trimmed.isNotEmpty) {
    final lastChar = trimmed.substring(trimmed.length - 1);
    if (lastChar != '.' && lastChar != '!' && lastChar != '?') {
      errors.add(GrammarError(
        mistake: "Missing sentence terminal punctuation",
        fix: "Add a period (.)",
        explanation: "A declarative sentence should always end with a terminal mark like a period."
      ));
      correctedText = "$correctedText.";
    }
  }

  // Vocab enhancements
  final vocabEnhancements = [
    {"word": "help", "suggestion": "assist / facilitate", "explanation": "Use 'assist' or 'facilitate' in professional contexts."},
    {"word": "make", "suggestion": "develop / construct / author", "explanation": "Use 'develop' or 'create' to describe building projects."},
    {"word": "got", "suggestion": "obtained / acquired / secured", "explanation": "Use 'obtained' or 'acquired' for credentials."},
    {"word": "use", "suggestion": "utilize / leverage", "explanation": "Use 'utilize' or 'leverage' to show competence in tools."},
    {"word": "good", "suggestion": "proficient / exceptional / adept", "explanation": "Use 'proficient' or 'exceptional' to describe your skills."},
    {"word": "job", "suggestion": "professional role / career", "explanation": "Use 'professional role' to elevate your terminology."}
  ];

  final vocabSuggestions = <VocabSuggestion>[];
  for (final item in vocabEnhancements) {
    final regex = RegExp('\\b${item["word"]}\\b', caseSensitive: false);
    if (regex.hasMatch(text)) {
      vocabSuggestions.add(VocabSuggestion(
        original: item["word"]!,
        suggested: item["suggestion"]!,
        explanation: item["explanation"]!,
      ));
    }
  }

  return GrammarAnalysis(
    originalText: text,
    correctedText: correctedText,
    errors: errors,
    vocabSuggestions: vocabSuggestions,
    hasMistakes: errors.isNotEmpty,
  );
}

class EnglishAssistantScreen extends StatefulWidget {
  final Student user;
  const EnglishAssistantScreen({super.key, required this.user});

  @override
  State<EnglishAssistantScreen> createState() => _EnglishAssistantScreenState();
}

class _EnglishAssistantScreenState extends State<EnglishAssistantScreen> {
  String _activeSubTab = "corrector"; // corrector, tutor, video

  // Corrector states
  final _correctorController = TextEditingController();
  GrammarAnalysis? _analysisResult;

  // Tutor states
  final _tutorInputController = TextEditingController();
  final List<ChatMessage> _chatMessages = [];
  bool _isBotSpeaking = false;
  bool _isVoiceEnabled = true;
  bool _isListening = false;
  int _tutorQuestionIndex = 0;
  ChatMessage? _selectedFeedbackMessage;

  // Video Conference states
  bool _isInterviewActive = false;
  bool _isInterviewCamOn = false;
  bool _isInterviewListening = false;
  int _interviewQuestionIndex = 0;
  final List<Map<String, dynamic>> _interviewTranscript = [];
  final _speechTranscriptController = TextEditingController();
  bool _isInterviewEvaluating = false;
  GrammarAnalysis? _interviewFeedback;

  final ScrollController _chatScrollController = ScrollController();

  final List<String> _presets = [
    "I has completed my graduation on yesterday.",
    "We discuss about our final year projects.",
    "He have a good skills in react and got certificates.",
    "Its a great opportunity to show my talents."
  ];

  @override
  void initState() {
    super.initState();
    // Load first tutor question
    _chatMessages.add(ChatMessage(
      id: '1',
      sender: 'bot',
      text: DatabaseService().tutorQuestions[0],
      timestamp: _timeString(),
    ));
  }

  String _timeString() {
    final now = DateTime.now();
    final h = now.hour.toString().padLeft(2, '0');
    final m = now.minute.toString().padLeft(2, '0');
    return "$h:$m";
  }

  void _runCorrector() {
    final text = _correctorController.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _analysisResult = analyzeEnglish(text);
    });
  }

  // --- Tutor Chat functions ---
  void _sendTutorMessage() {
    final text = _tutorInputController.text.trim();
    if (text.isEmpty) return;

    _tutorInputController.clear();
    final grammar = analyzeEnglish(text);

    final userMsg = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      sender: 'user',
      text: text,
      timestamp: _timeString(),
      grammarAnalysis: grammar,
    );

    setState(() {
      _chatMessages.add(userMsg);
      _isBotSpeaking = true;
    });

    _scrollTutorToBottom();

    // Priya reply after 1s
    Future.delayed(const Duration(seconds: 1), () {
      final nextIdx = _tutorQuestionIndex + 1;
      final questions = DatabaseService().tutorQuestions;
      String reply = "";

      String remarks = grammar.hasMistakes 
          ? "I noticed a few errors in your response. Click the 'Feedback Available' badge under your message for tips! "
          : "Superb! Your response is grammatically correct. ";

      if (nextIdx < questions.length) {
        setState(() => _tutorQuestionIndex = nextIdx);
        reply = "$remarks\n\nNext question: ${questions[nextIdx]}";
      } else {
        reply = "$remarks\n\nExcellent job! You have completed all the coaching questions. Review the details above.";
      }

      final botMsg = ChatMessage(
        id: (DateTime.now().millisecondsSinceEpoch + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: _timeString(),
      );

      setState(() {
        _chatMessages.add(botMsg);
        _isBotSpeaking = _isVoiceEnabled; // animation speaking status
      });

      _scrollTutorToBottom();

      if (_isVoiceEnabled) {
        // mock speak duration
        Future.delayed(const Duration(seconds: 4), () {
          if (mounted) setState(() => _isBotSpeaking = false);
        });
      }
    });
  }

  void _scrollTutorToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_chatScrollController.hasClients) {
        _chatScrollController.animateTo(
          _chatScrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _startTutorMicSimulate() {
    setState(() => _isListening = true);
    Future.delayed(const Duration(seconds: 1.5), () {
      setState(() {
        _isListening = false;
        _tutorInputController.text = "I has completed my graduation on yesterday.";
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Simulated speech captured! Click Send to evaluate.')),
      );
    });
  }

  // --- Video Conference HR rounds ---
  void _startInterview() {
    setState(() {
      _isInterviewActive = true;
      _isInterviewCamOn = true;
      _interviewQuestionIndex = 0;
      _interviewTranscript.clear();
      _speechTranscriptController.clear();
      _interviewFeedback = null;
      _isBotSpeaking = true;
    });

    // Mock speaking intro
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() => _isBotSpeaking = false);
    });
  }

  void _submitInterviewAnswer() {
    final text = _speechTranscriptController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isInterviewEvaluating = true);
    final feedback = analyzeEnglish(text);

    final currentQ = DatabaseService().tutorQuestions[_interviewQuestionIndex];
    _interviewTranscript.add({
      'question': currentQ,
      'answer': text,
      'feedback': feedback,
    });

    setState(() {
      _interviewFeedback = feedback;
      _isInterviewEvaluating = false;
      _isBotSpeaking = true;
    });

    Future.delayed(const Duration(seconds: 1), () {
      final nextIdx = _interviewQuestionIndex + 1;
      if (nextIdx < DatabaseService().tutorQuestions.length) {
        setState(() {
          _interviewQuestionIndex = nextIdx;
          _speechTranscriptController.clear();
        });
      } else {
        setState(() {
          _interviewQuestionIndex = nextIdx; // completes
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Virtual conference interview completed successfully!')),
        );
      }
      
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) setState(() => _isBotSpeaking = false);
      });
    });
  }

  void _startInterviewMicSimulate() {
    setState(() => _isInterviewListening = true);
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _isInterviewListening = false;
        _speechTranscriptController.text = "We discuss about our final year projects.";
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'AI English Skills Optimizer',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Improve your verbal grammar, sentence structures, and vocabulary for HR interviews.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        // SUBTABS
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: isDark ? Colors.white.withOpacity(0.02) : Colors.black.withOpacity(0.02),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
          ),
          child: Row(
            children: [
              _buildSubTabButton('corrector', 'Sentence Corrector', Icons.auto_awesome, isDark),
              _buildSubTabButton('tutor', 'AI English Tutor', Icons.chat_bubble_outline, isDark),
              _buildSubTabButton('video', 'AI Video Conference', Icons.video_call_outlined, isDark),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // RENDER ACTIVE SUBTAB
        if (_activeSubTab == "corrector") ...[
          _buildCorrectorTab(isDark),
        ] else if (_activeSubTab == "tutor") ...[
          _buildTutorTab(isDark),
        ] else ...[
          _buildVideoTab(isDark),
        ],
      ],
    );
  }

  Widget _buildSubTabButton(String tabId, String label, IconData icon, bool isDark) {
    final isSel = _activeSubTab == tabId;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _activeSubTab = tabId),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            gradient: isSel ? AppTheme.brandGradient : null,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 16,
                color: isSel ? Colors.white : (isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  label,
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: isSel ? FontWeight.bold : FontWeight.w600,
                    color: isSel ? Colors.white : (isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- Sentence Corrector Workspace ---
  Widget _buildCorrectorTab(bool isDark) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 750;
        
        final leftBox = GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Analyze Sentence', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 12),
              TextField(
                controller: _correctorController,
                maxLines: 4,
                style: const TextStyle(fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'e.g. He have a good skills in react and got certificates...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  filled: true,
                  fillColor: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                ),
              ),
              const SizedBox(height: 16),
              
              // Presets wrapper
              const Text('Quick Test Presets:', style: TextStyle(fontSize: 11, color: Colors.grey)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: List.generate(_presets.length, (idx) {
                  return InkWell(
                    onTap: () => setState(() => _correctorController.text = _presets[idx]),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white.withOpacity(0.03) : Colors.black.withOpacity(0.03),
                        border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text('Preset ${idx + 1}', style: const TextStyle(fontSize: 11)),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 20),

              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _runCorrector,
                      icon: const Icon(Icons.flash_on, color: Colors.white, size: 16),
                      label: const Text('Analyze & Polish', style: TextStyle(color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  OutlinedButton(
                    onPressed: () {
                      _correctorController.clear();
                      setState(() => _analysisResult = null);
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Icon(Icons.refresh),
                  ),
                ],
              ),
            ],
          ),
        );

        final rightBox = GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Polish & Corrections', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 12),
              const Divider(),
              const SizedBox(height: 12),

              if (_analysisResult == null)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 48.0),
                  child: Center(
                    child: Text(
                      'Submit a sentence on the left to see grammatical analysis and suggestions.',
                      style: TextStyle(color: Colors.grey, fontSize: 13),
                      textAlign: Center,
                    ),
                  ),
                )
              else ...[
                // Polished sentence box
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.accentEmerald.withOpacity(0.05),
                    border: Border.all(color: AppTheme.accentEmerald.withOpacity(0.2)),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'POLISHED SENTENCE',
                        style: TextStyle(
                          fontSize: 11, 
                          fontWeight: FontWeight.bold, 
                          color: AppTheme.accentEmerald,
                          letterSpacing: 0.5
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _analysisResult!.correctedText,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Errors list
                Text('Grammar Remarks (${_analysisResult!.errors.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 8),
                if (_analysisResult!.errors.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12.0),
                    child: Row(
                      children: [
                        Icon(Icons.check_circle_outline, color: AppTheme.accentEmerald),
                        SizedBox(width: 12),
                        Text('No grammar issues found! Perfect.', style: TextStyle(fontSize: 12)),
                      ],
                    ),
                  )
                else
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _analysisResult!.errors.length,
                    itemBuilder: (context, idx) {
                      final err = _analysisResult!.errors[idx];
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    'Incorrect: "${err.mistake}"',
                                    style: const TextStyle(color: AppTheme.accentRose, decoration: TextDecoration.lineThrough, fontSize: 12),
                                  ),
                                  const SizedBox(width: 8),
                                  const Icon(Icons.arrow_forward, size: 12, color: Colors.grey),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Correct: "${err.fix}"',
                                    style: const TextStyle(color: AppTheme.accentEmerald, fontWeight: FontWeight.bold, fontSize: 12),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(err.explanation, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                // Vocab enhancements
                if (_analysisResult!.vocabSuggestions.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  const Text('Professional Word Enhancements', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 8),
                  ..._analysisResult!.vocabSuggestions.map((item) {
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      color: AppTheme.brandAccent.withOpacity(0.02),
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text('"${item.original}"', style: const TextStyle(fontStyle: FontStyle.italic, fontSize: 12)),
                                const Text(' elevated to ', style: TextStyle(fontSize: 11, color: Colors.grey)),
                                Text(item.suggested, style: const TextStyle(color: AppTheme.brandPrimary, fontWeight: FontWeight.bold, fontSize: 12)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(item.explanation, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ],
            ],
          ),
        );

        if (isWide) {
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: leftBox),
              const SizedBox(width: 20),
              Expanded(child: rightBox),
            ],
          );
        }
        return Column(
          children: [
            leftBox,
            const SizedBox(height: 20),
            rightBox,
          ],
        );
      },
    );
  }

  // --- AI English Tutor Chat tab ---
  Widget _buildTutorTab(bool isDark) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Main Chat Space
        Expanded(
          child: GlassContainer(
            height: 520,
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                // Chat header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                    border: Border(bottom: BorderSide(color: isDark ? Colors.white10 : Colors.black10)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.forum_outlined, color: AppTheme.brandPrimary, size: 18),
                      const SizedBox(width: 8),
                      const Text('Interactive Coaching Session', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      if (_isBotSpeaking) ...[
                        const SizedBox(width: 12),
                        const Icon(Icons.volume_up, color: AppTheme.brandAccent, size: 16),
                      ],
                      const Spacer(),
                      IconButton(
                        icon: Icon(_isVoiceEnabled ? Icons.volume_up : Icons.volume_off, size: 18),
                        onPressed: () => setState(() => _isVoiceEnabled = !_isVoiceEnabled),
                      ),
                    ],
                  ),
                ),

                // Chat Messages List
                Expanded(
                  child: ListView.builder(
                    controller: _chatScrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _chatMessages.length,
                    itemBuilder: (context, idx) {
                      final msg = _chatMessages[idx];
                      final isBot = msg.sender == 'bot';
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Row(
                          mainAxisAlignment: isBot ? MainAxisAlignment.start : MainAxisAlignment.end,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (isBot) ...[
                              const CircleAvatar(
                                radius: 14,
                                backgroundColor: AppTheme.brandPrimary,
                                child: Icon(Icons.school_outlined, size: 14, color: Colors.white),
                              ),
                              const SizedBox(width: 8),
                            ],
                            
                            Flexible(
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isBot 
                                    ? (isDark ? Colors.white.withOpacity(0.04) : Colors.black.withOpacity(0.04))
                                    : AppTheme.brandPrimary.withOpacity(0.15),
                                  borderRadius: BorderRadius.only(
                                    topLeft: const Radius.circular(12),
                                    topRight: const Radius.circular(12),
                                    bottomLeft: isBot ? Radius.zero : const Radius.circular(12),
                                    bottomRight: isBot ? const Radius.circular(12) : Radius.zero,
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(msg.text, style: const TextStyle(fontSize: 13)),
                                    if (!isBot && msg.grammarAnalysis != null && msg.grammarAnalysis!.hasMistakes) ...[
                                      const SizedBox(height: 6),
                                      InkWell(
                                        onTap: () => setState(() => _selectedFeedbackMessage = msg),
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: AppTheme.accentAmber.withOpacity(0.15),
                                            borderRadius: BorderRadius.circular(4),
                                            border: Border.all(color: AppTheme.accentAmber.withOpacity(0.3)),
                                          ),
                                          child: const Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(Icons.warning_amber_rounded, size: 12, color: AppTheme.accentAmber),
                                              SizedBox(width: 4),
                                              Text('Feedback Available', style: TextStyle(fontSize: 10, color: AppTheme.accentAmber, fontWeight: FontWeight.bold)),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ),
                            
                            if (!isBot) ...[
                              const SizedBox(width: 8),
                              const CircleAvatar(
                                radius: 14,
                                backgroundColor: AppTheme.brandAccent,
                                child: Icon(Icons.person_outline, size: 14, color: Colors.white),
                              ),
                            ],
                          ],
                        ),
                      );
                    },
                  ),
                ),

                // Chat Input bar
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                    border: Border(top: BorderSide(color: isDark ? Colors.white10 : Colors.black10)),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: Icon(_isListening ? Icons.mic : Icons.mic_none, color: _isListening ? AppTheme.accentRose : Colors.grey),
                        onPressed: _startTutorMicSimulate,
                      ),
                      Expanded(
                        child: TextField(
                          controller: _tutorInputController,
                          style: const TextStyle(fontSize: 13),
                          decoration: const InputDecoration(
                            hintText: 'Type your response...',
                            border: InputBorder.none,
                          ),
                          onSubmitted: (val) => _sendTutorMessage(),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.send, color: AppTheme.brandPrimary),
                        onPressed: _sendTutorMessage,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Slideout Feedback Panel (on tablets/desktops)
        if (_selectedFeedbackMessage != null) ...[
          const SizedBox(width: 16),
          Container(
            width: 320,
            height: 520,
            decoration: BoxDecoration(
              color: isDark ? AppTheme.darkBgSurface : AppTheme.lightBgSurface,
              border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
              borderRadius: BorderRadius.circular(16),
            ),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('AI Placement Feedback', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    IconButton(
                      icon: const Icon(Icons.close, size: 18),
                      onPressed: () => setState(() => _selectedFeedbackMessage = null),
                    ),
                  ],
                ),
                const Divider(),
                const SizedBox(height: 8),
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Your Response:', style: TextStyle(fontSize: 11, color: Colors.grey)),
                        Text('"${_selectedFeedbackMessage!.text}"', style: const TextStyle(fontStyle: FontStyle.italic, fontSize: 12)),
                        const SizedBox(height: 12),
                        const Text('Polished Phrasing:', style: TextStyle(fontSize: 11, color: Colors.grey)),
                        Text(
                          '"${_selectedFeedbackMessage!.grammarAnalysis!.correctedText}"',
                          style: const TextStyle(color: AppTheme.accentEmerald, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const SizedBox(height: 16),
                        const Text('Corrections:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        const SizedBox(height: 8),
                        ..._selectedFeedbackMessage!.grammarAnalysis!.errors.map((err) {
                          return Card(
                            margin: const EdgeInsets.symmetric(vertical: 4),
                            child: Padding(
                              padding: const EdgeInsets.all(10.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(err.mistake, style: const TextStyle(color: AppTheme.accentRose, decoration: TextDecoration.lineThrough, fontSize: 11)),
                                      const SizedBox(width: 6),
                                      const Icon(Icons.arrow_forward, size: 10),
                                      const SizedBox(width: 6),
                                      Text(err.fix, style: const TextStyle(color: AppTheme.accentEmerald, fontWeight: FontWeight.bold, fontSize: 11)),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(err.explanation, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                                ],
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  // --- AI Video Conference HR Round ---
  Widget _buildVideoTab(bool isDark) {
    if (!_isInterviewActive) {
      return GlassContainer(
        padding: const EdgeInsets.all(28),
        child: Column(
          children: [
            const Icon(Icons.video_call_outlined, size: 48, color: AppTheme.brandPrimary),
            const SizedBox(height: 16),
            Text('Virtual HR Interview Chamber', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Text(
              'Simulate a live corporate placement interview. Priya (AI Placement Director) will ask standard interview questions, and you will speak or type your responses to evaluate your communication score.',
              style: TextStyle(color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary, fontSize: 13, height: 1.5),
              textAlign: Center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _startInterview,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.brandPrimary,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
              ),
              child: const Text('Enter Chamber', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      );
    }

    final questions = DatabaseService().tutorQuestions;
    final isFinished = _interviewQuestionIndex >= questions.length;

    return Column(
      children: [
        // Conference split grid
        if (!isFinished)
          LayoutBuilder(
            builder: (context, constraints) {
              final isWide = constraints.maxWidth > 700;
              final feeds = [
                // Coach Feed
                _buildVideoFeedBox(
                  '🔴 VIRTUAL COACH', 
                  'Priya (AI HR Director)',
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircleAvatar(
                          radius: 36,
                          backgroundColor: _isBotSpeaking ? AppTheme.brandAccent : Colors.grey,
                          child: const Icon(Icons.school, size: 36, color: Colors.white),
                        ),
                        if (_isBotSpeaking) ...[
                          const SizedBox(height: 16),
                          const Text('Priya is speaking...', style: TextStyle(fontSize: 11, color: AppTheme.brandAccent)),
                        ],
                      ],
                    ),
                  ),
                  currentQ: questions[_interviewQuestionIndex],
                ),
                
                // Student Feed
                _buildVideoFeedBox(
                  '🟢 CANDIDATE LIVE', 
                  'Student (You)',
                  Container(
                    color: const Color(0xFF070510),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _isInterviewCamOn ? Icons.videocam : Icons.videocam_off, 
                            size: 36, 
                            color: _isInterviewCamOn ? AppTheme.accentEmerald : Colors.grey
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _isInterviewCamOn ? 'Webcam Feed Online' : 'Webcam Feed Offline', 
                            style: const TextStyle(fontSize: 11, color: Colors.grey)
                          ),
                        ],
                      ),
                    ),
                  ),
                  inputWidget: _isInterviewListening 
                    ? const Padding(
                        padding: EdgeInsets.all(12.0),
                        child: Text('🎙️ Listening... Speak clearly.', style: TextStyle(color: AppTheme.accentRose, fontWeight: FontWeight.bold, fontSize: 13)),
                      )
                    : TextField(
                        controller: _speechTranscriptController,
                        style: const TextStyle(fontSize: 13),
                        decoration: const InputDecoration(
                          hintText: 'Click Mic to speak or type your answer...',
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.all(8),
                        ),
                      ),
                ),
              ];

              if (isWide) {
                return Row(
                  children: [
                    Expanded(child: feeds[0]),
                    const SizedBox(width: 16),
                    Expanded(child: feeds[1]),
                  ],
                );
              }
              return Column(
                children: [
                  feeds[0],
                  const SizedBox(height: 16),
                  feeds[1],
                ],
              );
            },
          ),

        const SizedBox(height: 16),

        // Controls bar
        if (!isFinished)
          GlassContainer(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    IconButton(
                      icon: Icon(_isInterviewCamOn ? Icons.videocam : Icons.videocam_off),
                      onPressed: () => setState(() => _isInterviewCamOn = !_isInterviewCamOn),
                    ),
                    IconButton(
                      icon: Icon(_isInterviewListening ? Icons.mic : Icons.mic_none, color: _isInterviewListening ? AppTheme.accentRose : null),
                      onPressed: _startInterviewMicSimulate,
                    ),
                  ],
                ),
                Row(
                  children: [
                    ElevatedButton(
                      onPressed: _isInterviewEvaluating ? null : _submitInterviewAnswer,
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
                      child: Text(_isInterviewEvaluating ? 'Saving...' : 'Submit Answer'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () => setState(() => _isInterviewActive = false),
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.accentRose),
                      child: const Icon(Icons.call_end, color: Colors.white),
                    ),
                  ],
                ),
              ],
            ),
          ),

        // Grammar feedback popup below feeds
        if (_interviewFeedback != null && !isFinished) ...[
          const SizedBox(height: 16),
          GlassContainer(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('Grammar remarks for last answer:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(
                      _interviewFeedback!.hasMistakes ? 'Needs Polish' : 'Correct',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: _interviewFeedback!.hasMistakes ? AppTheme.accentRose : AppTheme.accentEmerald,
                        fontSize: 11
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Polished: "${_interviewFeedback!.correctedText}"', style: const TextStyle(fontSize: 12, color: AppTheme.accentEmerald, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],

        // Aggregate report if completed
        if (isFinished) ...[
          GlassContainer(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const Icon(Icons.workspace_premium_outlined, size: 48, color: AppTheme.accentEmerald),
                const SizedBox(height: 16),
                Text('Virtual interview complete!', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                const Text('Review your aggregate performance report below to polish your placement answers.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 20),
                const Divider(),
                const SizedBox(height: 16),
                ..._interviewTranscript.map((log) {
                  final GrammarAnalysis feedback = log['feedback'];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Q: "${log['question']}"', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.brandPrimary)),
                          const SizedBox(height: 6),
                          Text('Your Ans: "${log['answer']}"', style: const TextStyle(fontStyle: FontStyle.italic, fontSize: 12)),
                          const SizedBox(height: 4),
                          Text('Polished: "${feedback.correctedText}"', style: const TextStyle(color: AppTheme.accentEmerald, fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => setState(() => _isInterviewActive = false),
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
                  child: const Text('Return to lobby'),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildVideoFeedBox(String status, String name, Widget videoVisual, {String? currentQ, Widget? inputWidget}) {
    return Expanded(
      child: GlassContainer(
        height: 320,
        padding: EdgeInsets.zero,
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              color: Colors.black.withOpacity(0.2),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Text(status, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                  Text(name, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              ),
            ),
            Expanded(child: videoVisual),
            if (currentQ != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                color: Colors.black.withOpacity(0.1),
                child: Text('Q: "$currentQ"', style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic)),
              ),
            if (inputWidget != null)
              Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: Colors.white10)),
                ),
                child: inputWidget,
              ),
          ],
        ),
      ),
    );
  }
}
