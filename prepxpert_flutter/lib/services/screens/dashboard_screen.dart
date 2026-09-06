import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../services/database_service.dart';

class DashboardScreen extends StatefulWidget {
  final Student user;
  const DashboardScreen({super.key, required this.user});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Student _currentUser;
  late Map<String, bool> _dailyTasksCompleted;
  late int _streak;

  final Map<String, String> _taskLabels = {
    'apt': 'Aptitude Practice: Solve 5 Quantitative questions',
    'coding': 'Coding Arena: Complete 1 medium-level challenge',
    'interview': 'Interview Prep: Review 2 behavioral flashcards',
    'jobs': 'Jobs Board: Check for new placement notification alerts',
    'profile': 'Profile Update: Complete CGPA, projects or skill section'
  };

  @override
  void initState() {
    super.initState();
    _currentUser = widget.user;
    
    // Set up daily tasks
    final dt = _currentUser.dailyTasks;
    _streak = dt['streak'] ?? 0;
    
    final comp = dt['completed'] ?? {};
    _dailyTasksCompleted = {
      'apt': comp['apt'] == true,
      'coding': comp['coding'] == true,
      'interview': comp['interview'] == true,
      'jobs': comp['jobs'] == true,
      'profile': comp['profile'] == true,
    };
  }

  void _toggleDailyTask(String taskId) async {
    setState(() {
      _dailyTasksCompleted[taskId] = !_dailyTasksCompleted[taskId]!;
      
      final previouslyCompletedAny = _dailyTasksCompleted.values.any((element) => element == true);
      if (previouslyCompletedAny && _streak == 0) {
        _streak = 1;
      }
    });

    // Save back to DatabaseService
    final updatedDaily = {
      'streak': _streak,
      'completed': _dailyTasksCompleted,
    };

    final db = DatabaseService();
    final updatedStudent = Student(
      email: _currentUser.email,
      name: _currentUser.name,
      role: _currentUser.role,
      department: _currentUser.department,
      year: _currentUser.year,
      cgpa: _currentUser.cgpa,
      bio: _currentUser.bio,
      skills: _currentUser.skills,
      certifications: _currentUser.certifications,
      projects: _currentUser.projects,
      resume: _currentUser.resume,
      aptitudeStats: _currentUser.aptitudeStats,
      codingSolvedList: _currentUser.codingSolvedList,
      mockHistory: _currentUser.mockHistory,
      dailyTasks: updatedDaily,
    );

    await db.updateUser(updatedStudent);
    _currentUser = updatedStudent;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // Calculate stats
    final totalApt = _currentUser.aptitudeStats['total'] ?? 0;
    final correctApt = _currentUser.aptitudeStats['correct'] ?? 0;
    final aptAccuracy = totalApt > 0 ? ((correctApt / totalApt) * 100).round() : 0;
    
    final codingCount = _currentUser.codingSolvedList.length;
    final mockCount = _currentUser.mockHistory.length;
    final averageMockScore = mockCount > 0 
      ? (_currentUser.mockHistory.map((m) => (m['score'] as num).toDouble()).reduce((a, b) => a + b) / mockCount * 10).round()
      : 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Page Title & Header
        Text(
          'Placement Performance Workspace',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Track your campus placement preparedness metrics and daily milestones.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        // TOP METRICS CARDS
        LayoutBuilder(
          builder: (context, constraints) {
            double cardWidth = (constraints.maxWidth - 36) / 4;
            if (constraints.maxWidth < 600) {
              return GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.4,
                children: [
                  _buildMetricCard('Aptitude Accuracy', '$aptAccuracy%', Icons.psychology, AppTheme.brandPrimary, isDark),
                  _buildMetricCard('Coding Challenges', '$codingCount Solved', Icons.code, AppTheme.accentEmerald, isDark),
                  _buildMetricCard('Mock Assessments', '$mockCount Completed', Icons.assignment, AppTheme.brandAccent, isDark),
                  _buildMetricCard('Average Scores', '$averageMockScore%', Icons.analytics_outlined, AppTheme.accentAmber, isDark),
                ],
              );
            }
            return Row(
              children: [
                Expanded(child: _buildMetricCard('Aptitude Accuracy', '$aptAccuracy%', Icons.psychology, AppTheme.brandPrimary, isDark)),
                const SizedBox(width: 12),
                Expanded(child: _buildMetricCard('Coding Challenges', '$codingCount Solved', Icons.code, AppTheme.accentEmerald, isDark)),
                const SizedBox(width: 12),
                Expanded(child: _buildMetricCard('Mock Assessments', '$mockCount Completed', Icons.assignment, AppTheme.brandAccent, isDark)),
                const SizedBox(width: 12),
                Expanded(child: _buildMetricCard('Average Scores', '$averageMockScore%', Icons.analytics_outlined, AppTheme.accentAmber, isDark)),
              ],
            );
          },
        ),
        const SizedBox(height: 24),

        // DAILY TASKS & STREAKS
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.calendar_today, color: AppTheme.brandPrimary, size: 22),
                      const SizedBox(width: 12),
                      Text(
                        'Daily Placement Milestones',
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.accentAmber.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.accentAmber.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.local_fire_department, color: AppTheme.accentAmber, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          '$_streak Day Streak',
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.accentAmber,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 12),
              ..._dailyTasksCompleted.keys.map((taskId) {
                final isCompleted = _dailyTasksCompleted[taskId]!;
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6.0),
                  child: InkWell(
                    onTap: () => _toggleDailyTask(taskId),
                    child: Row(
                      children: [
                        Container(
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: isCompleted 
                                ? AppTheme.accentEmerald 
                                : (isDark ? Colors.white30 : Colors.black30),
                            ),
                            borderRadius: BorderRadius.circular(6),
                            color: isCompleted ? AppTheme.accentEmerald.withOpacity(0.2) : Colors.transparent,
                          ),
                          child: isCompleted 
                            ? const Icon(Icons.check, size: 16, color: AppTheme.accentEmerald) 
                            : null,
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            _taskLabels[taskId]!,
                            style: GoogleFonts.outfit(
                              fontSize: 13,
                              color: isCompleted
                                ? (isDark ? Colors.white30 : Colors.black30)
                                : (isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary),
                              decoration: isCompleted ? TextDecoration.lineThrough : null,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // RECENT MOCK TESTS
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.history, color: AppTheme.brandAccent, size: 22),
                  const SizedBox(width: 12),
                  Text(
                    'Recent Mock Exams & Proctoring Reports',
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 8),
              if (_currentUser.mockHistory.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 24.0),
                  child: Center(
                    child: Text(
                      'No mock test sessions completed yet. Attempt a Placement Mock Test to see metrics.',
                      style: TextStyle(
                        color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                        fontSize: 13,
                      ),
                    ),
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _currentUser.mockHistory.length,
                  separatorBuilder: (context, index) => const Divider(),
                  itemBuilder: (context, index) {
                    final item = _currentUser.mockHistory[index];
                    final date = item['date'] ?? '';
                    final score = item['score'] ?? 0;
                    final total = item['total'] ?? 0;
                    final violations = item['violations'] ?? 0;
                    final result = item['result'] ?? 'Pass';
                    final isPass = result.toLowerCase() == 'pass';

                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: (isPass ? AppTheme.accentEmerald : AppTheme.accentRose).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'Score: $score/$total',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isPass ? AppTheme.accentEmerald : AppTheme.accentRose,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Mock Assessment - $date',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    Icon(
                                      violations > 0 ? Icons.warning_amber_rounded : Icons.shield_outlined,
                                      size: 14,
                                      color: violations > 0 ? AppTheme.accentAmber : AppTheme.accentEmerald,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      '$violations Proctoring Violations',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: violations > 0 ? AppTheme.accentAmber : AppTheme.accentEmerald,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isPass ? AppTheme.accentEmerald : AppTheme.accentRose,
                              ),
                            ),
                            child: Text(
                              result,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isPass ? AppTheme.accentEmerald : AppTheme.accentRose,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color accent, bool isDark) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                ),
              ),
              Icon(icon, color: accent, size: 18),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
