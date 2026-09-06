import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../models/question.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../services/database_service.dart';

class AptitudeScreen extends StatefulWidget {
  final Student user;
  const AptitudeScreen({super.key, required this.user});

  @override
  State<AptitudeScreen> createState() => _AptitudeScreenState();
}

class _DashboardAptStats {
  int total;
  int correct;
  _DashboardAptStats(this.total, this.correct);
}

class _AptitudeScreenState extends State<AptitudeScreen> {
  String _selectedCategory = "Quantitative";
  List<AptitudeQuestion> _filteredQuestions = [];
  int _currentQuestionIndex = 0;
  int? _selectedOptionIndex;
  bool _isAnswered = false;

  late Student _student;
  late _DashboardAptStats _aptStats;

  @override
  void initState() {
    super.initState();
    _student = widget.user;
    final total = _student.aptitudeStats['total'] ?? 0;
    final correct = _student.aptitudeStats['correct'] ?? 0;
    _aptStats = _DashboardAptStats(total, correct);
    _loadQuestions();
  }

  void _loadQuestions() {
    final allQuestions = DatabaseService().aptitudeQuestions;
    setState(() {
      _filteredQuestions = allQuestions
          .where((q) => q.category.toLowerCase() == _selectedCategory.toLowerCase())
          .toList();
      _currentQuestionIndex = 0;
      _selectedOptionIndex = null;
      _isAnswered = false;
    });
  }

  void _submitAnswer() async {
    if (_selectedOptionIndex == null || _filteredQuestions.isEmpty) return;

    final q = _filteredQuestions[_currentQuestionIndex];
    final isCorrect = _selectedOptionIndex == q.correctIndex;

    setState(() {
      _isAnswered = true;
      _aptStats.total += 1;
      if (isCorrect) {
        _aptStats.correct += 1;
      }
    });

    // Save back to SharedPreferences / user profile
    final db = DatabaseService();
    final updatedUser = Student(
      email: _student.email,
      name: _student.name,
      role: _student.role,
      department: _student.department,
      year: _student.year,
      cgpa: _student.cgpa,
      bio: _student.bio,
      skills: _student.skills,
      certifications: _student.certifications,
      projects: _student.projects,
      resume: _student.resume,
      aptitudeStats: {'total': _aptStats.total, 'correct': _aptStats.correct},
      codingSolvedList: _student.codingSolvedList,
      mockHistory: _student.mockHistory,
      dailyTasks: _student.dailyTasks,
    );
    await db.updateUser(updatedUser);
    _student = updatedUser;
  }

  void _nextQuestion() {
    if (_currentQuestionIndex + 1 < _filteredQuestions.length) {
      setState(() {
        _currentQuestionIndex++;
        _selectedOptionIndex = null;
        _isAnswered = false;
      });
    } else {
      // Loop back to start
      setState(() {
        _currentQuestionIndex = 0;
        _selectedOptionIndex = null;
        _isAnswered = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Completed all questions in this category. Starting over!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final categories = ["Quantitative", "Logical", "Verbal"];

    AptitudeQuestion? currentQuestion;
    if (_filteredQuestions.isNotEmpty && _currentQuestionIndex < _filteredQuestions.length) {
      currentQuestion = _filteredQuestions[_currentQuestionIndex];
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Text(
          'Aptitude Arena',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Sharpen your problem-solving skills across quantitative, logical and verbal reasoning.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        // CATEGORY TABS
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

        // MAIN QUESTION BOX
        if (currentQuestion == null)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 36.0),
            child: Center(child: Text('No questions available in this category.')),
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
                      'QUESTION ${_currentQuestionIndex + 1} OF ${_filteredQuestions.length}',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.brandPrimary,
                        letterSpacing: 1.0,
                      ),
                    ),
                    Text(
                      'Score: ${_aptStats.correct}/${_aptStats.total}',
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.accentEmerald,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  currentQuestion.question,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                  ),
                ),
                const SizedBox(height: 24),

                // OPTIONS LIST
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: currentQuestion.options.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final optionText = currentQuestion!.options[index];
                    final isSelected = _selectedOptionIndex == index;
                    final isCorrectOption = index == currentQuestion.correctIndex;
                    
                    Color itemBorderColor = isDark ? Colors.white12 : Colors.black12;
                    Color itemBgColor = Colors.transparent;
                    Color itemTextColor = isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary;

                    if (_isAnswered) {
                      if (isCorrectOption) {
                        itemBorderColor = AppTheme.accentEmerald;
                        itemBgColor = AppTheme.accentEmerald.withOpacity(0.08);
                        itemTextColor = AppTheme.accentEmerald;
                      } else if (isSelected) {
                        itemBorderColor = AppTheme.accentRose;
                        itemBgColor = AppTheme.accentRose.withOpacity(0.08);
                        itemTextColor = AppTheme.accentRose;
                      }
                    } else if (isSelected) {
                      itemBorderColor = AppTheme.brandPrimary;
                      itemBgColor = AppTheme.brandPrimary.withOpacity(0.05);
                    }

                    return InkWell(
                      onTap: _isAnswered ? null : () => setState(() => _selectedOptionIndex = index),
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          border: Border.all(color: itemBorderColor),
                          borderRadius: BorderRadius.circular(10),
                          color: itemBgColor,
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected || (_isAnswered && isCorrectOption)
                                      ? (isCorrectOption && _isAnswered ? AppTheme.accentEmerald : AppTheme.brandPrimary)
                                      : (isDark ? Colors.white24 : Colors.black24),
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  String.fromCharCode(65 + index), // A, B, C, D
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: isSelected || (_isAnswered && isCorrectOption)
                                        ? (isCorrectOption && _isAnswered ? AppTheme.accentEmerald : AppTheme.brandPrimary)
                                        : (isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                optionText,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                  color: itemTextColor,
                                ),
                              ),
                            ),
                            if (_isAnswered) ...[
                              if (isCorrectOption)
                                const Icon(Icons.check_circle_outline, color: AppTheme.accentEmerald, size: 20)
                              else if (isSelected)
                                const Icon(Icons.cancel_outlined, color: AppTheme.accentRose, size: 20)
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 24),
                
                // SUBMIT / NEXT BUTTON
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (!_isAnswered)
                      ElevatedButton.icon(
                        onPressed: _selectedOptionIndex == null ? null : _submitAnswer,
                        icon: const Icon(Icons.check, color: Colors.white, size: 16),
                        label: const Text('Verify Phrasing', style: TextStyle(color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.brandPrimary,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        ),
                      )
                    else
                      ElevatedButton.icon(
                        onPressed: _nextQuestion,
                        icon: const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                        label: const Text('Next Challenge', style: TextStyle(color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.brandPrimary,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 20),

          // DETAILED EXPLANATION PANEL
          if (_isAnswered)
            GlassContainer(
              padding: const EdgeInsets.all(20),
              color: AppTheme.accentEmerald.withOpacity(0.02),
              border: Border.all(color: AppTheme.accentEmerald.withOpacity(0.2)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.lightbulb_outline, color: AppTheme.accentEmerald, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Detailed Solution Explanation',
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.accentEmerald,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    currentQuestion.explanation,
                    style: GoogleFonts.outfit(
                      fontSize: 13,
                      height: 1.5,
                      color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ],
    );
  }
}
