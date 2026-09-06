import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../models/question.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../services/database_service.dart';

class MockTestScreen extends StatefulWidget {
  final Student user;
  const MockTestScreen({super.key, required this.user});

  @override
  State<MockTestScreen> createState() => _MockTestScreenState();
}

class _MockTestScreenState extends State<MockTestScreen> with WidgetsBindingObserver {
  // Test states
  String _status = "lobby"; // lobby, running, finished
  List<AptitudeQuestion> _testQuestions = [];
  int _currentQuestionIndex = 0;
  Map<int, int> _answers = {}; // question index -> option index selected
  
  // Timer states
  Timer? _timer;
  int _secondsRemaining = 600; // 10 minutes

  // Proctoring states
  int _violations = 0;
  final List<String> _violationLogs = [];

  late Student _student;

  @override
  void initState() {
    super.initState();
    _student = widget.user;
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    _timer?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  // Monitor tab/app focus changes
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (_status == "running" && 
        (state == AppLifecycleState.inactive || state == AppLifecycleState.paused)) {
      _triggerViolation("Loss of Screen Focus / App Backgrounded");
    }
  }

  void _triggerViolation(String type) {
    setState(() {
      _violations++;
      _violationLogs.add("${DateTime.now().toLocal().toIso8601String().substring(11, 19)} - $type");
    });

    DatabaseService().logProctoringViolation(_student.name, type);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppTheme.accentRose,
        content: Text('PROCTORING WARNING: $type detected! Violation $_violations/3'),
      ),
    );

    if (_violations >= 3) {
      _submitTest(autoSubmitted: true);
    }
  }

  void _startTest() {
    final allQuestions = DatabaseService().aptitudeQuestions;
    final testSet = List<AptitudeQuestion>.from(allQuestions)..shuffle();
    
    setState(() {
      _testQuestions = testSet.take(5).toList(); // 5 random questions for the test
      _status = "running";
      _currentQuestionIndex = 0;
      _answers = {};
      _secondsRemaining = 300; // 5 minutes test
      _violations = 0;
      _violationLogs.clear();
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() => _secondsRemaining--);
      } else {
        _submitTest(autoSubmitted: true);
      }
    });
  }

  void _submitTest({bool autoSubmitted = false}) async {
    _timer?.cancel();
    if (_status != "running") return;

    int score = 0;
    for (int i = 0; i < _testQuestions.length; i++) {
      if (_answers[i] == _testQuestions[i].correctIndex) {
        score++;
      }
    }

    final dateStr = DateTime.now().toIso8601String().substring(0, 10);
    final resultStr = score >= 3 ? "Pass" : "Fail";

    final record = {
      'date': dateStr,
      'score': score,
      'total': _testQuestions.length,
      'violations': _violations,
      'result': resultStr,
    };

    final db = DatabaseService();
    final updatedHistory = List<Map<String, dynamic>>.from(_student.mockHistory)..add(record);
    
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
      aptitudeStats: _student.aptitudeStats,
      codingSolvedList: _student.codingSolvedList,
      mockHistory: updatedHistory,
      dailyTasks: _student.dailyTasks,
    );

    await db.updateUser(updatedUser);
    
    setState(() {
      _student = updatedUser;
      _status = "finished";
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: autoSubmitted ? AppTheme.accentRose : AppTheme.accentEmerald,
        content: Text(autoSubmitted 
            ? 'Test automatically submitted due to proctoring violation limit.' 
            : 'Mock exam submitted successfully!'),
      ),
    );
  }

  String _formatDuration(int totalSeconds) {
    final m = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (totalSeconds % 60).toString().padLeft(2, '0');
    return "$m:$s";
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Placement Mock Test',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Simulate official campus hiring assessments with real-time AI proctoring checks.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        if (_status == "lobby") ...[
          // LOBBY CARD
          GlassContainer(
            padding: const EdgeInsets.all(28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const Icon(Icons.security, size: 48, color: AppTheme.brandPrimary),
                const SizedBox(height: 16),
                Text(
                  'Assessment Room Guidelines',
                  style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                const Divider(),
                const SizedBox(height: 16),
                _buildRuleItem('Duration: 5 Minutes timed challenge.', Icons.timer_outlined, isDark),
                _buildRuleItem('Quantity: 5 MCQ Aptitude questions.', Icons.list_alt_rounded, isDark),
                _buildRuleItem('AI Proctoring Active: Tab shifts, screen minimizing, or focus loss will be flagged as cheating violations.', Icons.remove_red_eye_outlined, isDark),
                _buildRuleItem('Violation Limit: Reaching 3 flags will trigger automatic exam cancellation and immediate submission.', Icons.gavel_outlined, isDark),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: _startTest,
                  icon: const Icon(Icons.play_arrow, color: Colors.white),
                  label: const Text('Start Simulated Exam', style: TextStyle(color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.brandPrimary,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ] else if (_status == "running") ...[
          // RUNNING TEST INTERFACE
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.brandPrimary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.timer_outlined, size: 16, color: AppTheme.brandPrimary),
                    const SizedBox(width: 8),
                    Text(
                      _formatDuration(_secondsRemaining),
                      style: GoogleFonts.sourceCodePro(
                        fontSize: 14, 
                        fontWeight: FontWeight.bold,
                        color: AppTheme.brandPrimary
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.accentRose.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'Violations: $_violations/3',
                  style: const TextStyle(
                    fontSize: 13, 
                    fontWeight: FontWeight.bold,
                    color: AppTheme.accentRose,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Question Card
          _buildRunningQuestionCard(isDark),
        ] else ...[
          // FINISHED REPORT CARD
          _buildResultReportCard(isDark),
        ],
      ],
    );
  }

  Widget _buildRunningQuestionCard(bool isDark) {
    final qIndex = _currentQuestionIndex;
    final q = _testQuestions[qIndex];
    final selectedOption = _answers[qIndex];

    return GlassContainer(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'QUESTION ${qIndex + 1} OF ${_testQuestions.length}',
                style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandPrimary, fontSize: 11),
              ),
              ElevatedButton(
                onPressed: () => _submitTest(),
                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.accentRose),
                child: const Text('Finish Test', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            q.question,
            style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),

          // Options List
          ...List.generate(q.options.length, (optIdx) {
            final optionText = q.options[optIdx];
            final isSelected = selectedOption == optIdx;

            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 6.0),
              child: InkWell(
                onTap: () {
                  setState(() {
                    _answers[qIndex] = optIdx;
                  });
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: isSelected ? AppTheme.brandPrimary : (isDark ? Colors.white10 : Colors.black10),
                    ),
                    borderRadius: BorderRadius.circular(8),
                    color: isSelected ? AppTheme.brandPrimary.withOpacity(0.05) : Colors.transparent,
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected ? AppTheme.brandPrimary : Colors.grey,
                          ),
                        ),
                        child: isSelected 
                          ? const Center(
                              child: CircleAvatar(radius: 6, backgroundColor: AppTheme.brandPrimary),
                            )
                          : null,
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(optionText, style: const TextStyle(fontSize: 13)),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),

          const SizedBox(height: 24),

          // Previous / Next footer
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: qIndex == 0 ? null : () => setState(() => _currentQuestionIndex--),
                icon: const Icon(Icons.chevron_left),
                label: const Text('Previous'),
              ),
              TextButton.icon(
                onPressed: qIndex + 1 == _testQuestions.length 
                  ? null 
                  : () => setState(() => _currentQuestionIndex++),
                icon: const Icon(Icons.chevron_right),
                label: const Text('Next'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildResultReportCard(bool isDark) {
    final lastRecord = _student.mockHistory.last;
    final score = lastRecord['score'] ?? 0;
    final total = lastRecord['total'] ?? 0;
    final isPass = (lastRecord['result'] ?? '') == 'Pass';

    return GlassContainer(
      padding: const EdgeInsets.all(28),
      child: Column(
        children: [
          Icon(
            isPass ? Icons.check_circle_outline : Icons.cancel_outlined,
            size: 56,
            color: isPass ? AppTheme.accentEmerald : AppTheme.accentRose,
          ),
          const SizedBox(height: 16),
          Text(
            isPass ? 'Mock Exam Passed Successfully!' : 'Mock Exam Score Below Pass Margin',
            style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Your Final Score: $score / $total ($percent%)',
            style: TextStyle(
              fontSize: 14, 
              fontWeight: FontWeight.bold, 
              color: isPass ? AppTheme.accentEmerald : AppTheme.accentRose
            ),
          ),
          const SizedBox(height: 12),
          const Divider(),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildReportMetric('Proctoring Flags', '$_violations / 3', Icons.security),
              _buildReportMetric('Result Status', lastRecord['result'] ?? '', Icons.bookmark_outline),
            ],
          ),
          if (_violationLogs.isNotEmpty) ...[
            const SizedBox(height: 20),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'AI Proctoring Incidents Log',
                style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: _violationLogs.map((log) => Text(log, style: GoogleFonts.sourceCodePro(fontSize: 11, color: AppTheme.accentRose))).toList(),
              ),
            ),
          ],
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => setState(() => _status = "lobby"),
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
            child: const Text('Return to Lobby', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  int get percent => _testQuestions.isNotEmpty ? ((_student.mockHistory.last['score'] as int) / _testQuestions.length * 100).round() : 0;

  Widget _buildReportMetric(String label, String val, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 18, color: Colors.grey),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
      ],
    );
  }

  Widget _buildRuleItem(String text, IconData icon, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppTheme.brandPrimary, size: 18),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 13,
                color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
