import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../services/database_service.dart';

class InterviewScreen extends StatefulWidget {
  final Student user;
  const InterviewScreen({super.key, required this.user});

  @override
  State<InterviewScreen> createState() => _InterviewScreenState();
}

class _InterviewScreenState extends State<InterviewScreen> {
  String _selectedCategory = "Behavioral";
  List<Map<String, dynamic>> _filteredQuestions = [];
  int _currentQuestionIndex = 0;

  final _answerController = TextEditingController();
  bool _isEvaluated = false;
  
  // Results
  List<String> _matchedKeywords = [];
  List<String> _missingKeywords = [];
  double _scorePercent = 0.0;
  String _remarks = "";

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  void _loadQuestions() {
    final allQuestions = DatabaseService().interviewQuestions;
    setState(() {
      _filteredQuestions = allQuestions
          .where((q) => (q['category'] as String).toLowerCase() == _selectedCategory.toLowerCase())
          .toList();
      _currentQuestionIndex = 0;
      _isEvaluated = false;
      _answerController.clear();
    });
  }

  void _evaluateAnswer() {
    if (_filteredQuestions.isEmpty) return;
    final q = _filteredQuestions[_currentQuestionIndex];
    final keyWords = List<String>.from(q['keyWords'] ?? []);
    final answerText = _answerController.text.trim().toLowerCase();

    if (answerText.isEmpty) return;

    final matched = <String>[];
    final missing = <String>[];

    for (final word in keyWords) {
      if (answerText.contains(word.toLowerCase())) {
        matched.add(word);
      } else {
        missing.add(word);
      }
    }

    final score = keyWords.isNotEmpty ? matched.length / keyWords.length : 0.0;
    String remarks = "Needs Improvement";
    if (score >= 0.75) {
      remarks = "Excellent Response";
    } else if (score >= 0.40) {
      remarks = "Satisfactory Response";
    }

    setState(() {
      _matchedKeywords = matched;
      _missingKeywords = missing;
      _scorePercent = score;
      _remarks = remarks;
      _isEvaluated = true;
    });
  }

  void _nextQuestion() {
    if (_currentQuestionIndex + 1 < _filteredQuestions.length) {
      setState(() {
        _currentQuestionIndex++;
        _isEvaluated = false;
        _answerController.clear();
      });
    } else {
      setState(() {
        _currentQuestionIndex = 0;
        _isEvaluated = false;
        _answerController.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Completed all flashcards in this category.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final categories = ["Behavioral", "Technical"];
    
    Map<String, dynamic>? currentQ;
    if (_filteredQuestions.isNotEmpty && _currentQuestionIndex < _filteredQuestions.length) {
      currentQ = _filteredQuestions[_currentQuestionIndex];
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Interview Preparation Q&A',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Practice common corporate interview questions and get real-time keyword keyword feedback.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        // Categories
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: isDark ? Colors.white.withOpacity(0.02) : Colors.black.withOpacity(0.02),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
          ),
          child: Row(
            children: categories.map((cat) {
              final isSel = cat == _selectedCategory;
              return Expanded(
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _selectedCategory = cat;
                      _loadQuestions();
                    });
                  },
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      gradient: isSel ? AppTheme.brandGradient : null,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        cat,
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          fontWeight: isSel ? FontWeight.bold : FontWeight.w600,
                          color: isSel 
                            ? Colors.white 
                            : (isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 24),

        // FLASHCARD
        if (currentQ == null)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 36.0),
            child: Center(child: Text('No questions found in this category.')),
          )
        else ...[
          GlassContainer(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text(
                      'FLASHCARD ${_currentQuestionIndex + 1} OF ${_filteredQuestions.length}',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandPrimary, fontSize: 11),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.brandPrimary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        _selectedCategory,
                        style: const TextStyle(fontSize: 11, color: AppTheme.brandPrimary, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  currentQ['question'] ?? '',
                  style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),

                if (!_isEvaluated) ...[
                  // Text Area for answer
                  Text('Type your verbal answer response here:', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _answerController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: 'e.g. In my project, we had a conflict...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      filled: true,
                      fillColor: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton.icon(
                      onPressed: _evaluateAnswer,
                      icon: const Icon(Icons.check, color: Colors.white, size: 16),
                      label: const Text('Verify Response', style: TextStyle(color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ),
                ] else ...[
                  // Feedback summary
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _remarks,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: _scorePercent >= 0.75 
                            ? AppTheme.accentEmerald 
                            : (_scorePercent >= 0.40 ? AppTheme.accentAmber : AppTheme.accentRose),
                        ),
                      ),
                      Text(
                        'Score: ${(_scorePercent * 100).round()}%',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: _scorePercent >= 0.75 ? AppTheme.accentEmerald : AppTheme.accentRose,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Key words matched and missed chips
                  const Text('Keyword Feedback:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ..._matchedKeywords.map((word) => Chip(
                        label: Text(word, style: const TextStyle(fontSize: 11, color: Colors.white)),
                        backgroundColor: AppTheme.accentEmerald.withOpacity(0.6),
                      )),
                      ..._missingKeywords.map((word) => Chip(
                        label: Text(word, style: const TextStyle(fontSize: 11)),
                        backgroundColor: isDark ? Colors.white10 : Colors.black10,
                      )),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Model Answer
                  const Text('Sample Model Answer:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                      border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      currentQ['sampleAnswer'] ?? '',
                      style: const TextStyle(fontSize: 12, height: 1.4),
                    ),
                  ),

                  const SizedBox(height: 20),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton.icon(
                      onPressed: _nextQuestion,
                      icon: const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                      label: const Text('Next Flashcard', style: TextStyle(color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ],
    );
  }
}
