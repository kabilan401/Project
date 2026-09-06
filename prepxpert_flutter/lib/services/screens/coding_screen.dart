import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../models/question.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../services/database_service.dart';

class CodingScreen extends StatefulWidget {
  final Student user;
  const CodingScreen({super.key, required this.user});

  @override
  State<CodingScreen> createState() => _CodingScreenState();
}

class _CodingScreenState extends State<CodingScreen> {
  CodingChallenge? _selectedChallenge;
  String _selectedLanguage = "Python";
  final _codeController = TextEditingController();
  
  bool _isCompiling = false;
  bool _hasRunTests = false;
  List<bool> _testCasesPassed = [];
  bool _isSolved = false;

  late Student _student;

  final Map<String, Map<String, String>> _templates = {
    'c1': {
      'Python': 'def reverse_string(s: str) -> str:\n    # Write your code here\n    return s[::-1]\n\nprint(reverse_string("google"))',
      'Java': 'public class Solution {\n    public static String reverseString(String s) {\n        // Write your code here\n        return new StringBuilder(s).reverse().toString();\n    }\n}',
      'C++': '#include <iostream>\n#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Write your code here\n    return "";\n}'
    },
    'c2': {
      'Python': 'def is_palindrome(x: int) -> bool:\n    # Write your code here\n    return str(x) == str(x)[::-1]\n\nprint(is_palindrome(121))',
      'Java': 'public class Solution {\n    public static boolean isPalindrome(int x) {\n        // Write your code here\n        return true;\n    }\n}',
      'C++': '#include <iostream>\nusing namespace std;\n\nbool isPalindrome(int x) {\n    // Write your code here\n    return true;\n}'
    },
    'c3': {
      'Python': 'def two_sum(nums: list, target: int) -> list:\n    # Write your code here\n    return [0, 1]\n\nprint(two_sum([2, 7, 11, 15], 9))',
      'Java': 'public class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{0, 1};\n    }\n}',
      'C++': '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {0, 1};\n}'
    }
  };

  @override
  void initState() {
    super.initState();
    _student = widget.user;
  }

  void _selectChallenge(CodingChallenge challenge) {
    setState(() {
      _selectedChallenge = challenge;
      _hasRunTests = false;
      _testCasesPassed = [];
      _isSolved = _student.codingSolvedList.contains(challenge.id);
      _loadTemplate();
    });
  }

  void _loadTemplate() {
    if (_selectedChallenge == null) return;
    final template = _templates[_selectedChallenge!.id]?[_selectedLanguage];
    _codeController.text = template ?? "# Write code here";
  }

  void _runCode() {
    if (_selectedChallenge == null) return;
    
    setState(() {
      _isCompiling = true;
      _hasRunTests = false;
    });

    // Simulate compilation for 2 seconds
    Future.delayed(const Duration(seconds: 2), () async {
      final isCorrectImplementation = _codeController.text.contains('::-1') || 
                                      _codeController.text.contains('reverse()') ||
                                      _codeController.text.contains('true') ||
                                      _codeController.text.contains('[0, 1]') ||
                                      _codeController.text.contains('{0, 1}') ||
                                      _selectedChallenge!.id == 'c1' || 
                                      _selectedChallenge!.id == 'c2' ||
                                      _selectedChallenge!.id == 'c3'; // mock success for demo

      final results = List<bool>.filled(_selectedChallenge!.testCases.length, isCorrectImplementation);
      
      setState(() {
        _isCompiling = false;
        _hasRunTests = true;
        _testCasesPassed = results;
      });

      if (isCorrectImplementation && !_isSolved) {
        setState(() => _isSolved = true);
        
        final db = DatabaseService();
        final updatedSolvedList = List<String>.from(_student.codingSolvedList);
        if (!updatedSolvedList.contains(_selectedChallenge!.id)) {
          updatedSolvedList.add(_selectedChallenge!.id);
        }

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
          codingSolvedList: updatedSolvedList,
          mockHistory: _student.mockHistory,
          dailyTasks: _student.dailyTasks,
        );

        await db.updateUser(updatedUser);
        _student = updatedUser;

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.accentEmerald,
            content: Text('Congratulations! Challenge "${_selectedChallenge!.title}" solved successfully.'),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final allChallenges = DatabaseService().codingChallenges;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Coding Practice Arena',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Master programming algorithms and prepare for corporate technical screenings.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        if (_selectedChallenge == null) ...[
          // CHALLENGES DIRECTORY LIST
          Text(
            'Algorithm Challenge Directory',
            style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: allChallenges.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final challenge = allChallenges[index];
              final isSolved = _student.codingSolvedList.contains(challenge.id);
              final isMedium = challenge.difficulty == 'Medium';

              return GlassContainer(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: (isSolved ? AppTheme.accentEmerald : AppTheme.brandPrimary).withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isSolved ? Icons.check_circle_outline : Icons.code,
                        color: isSolved ? AppTheme.accentEmerald : AppTheme.brandPrimary,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            challenge.title,
                            style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            challenge.description,
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: (isMedium ? AppTheme.accentAmber : AppTheme.accentEmerald).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        challenge.difficulty,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isMedium ? AppTheme.accentAmber : AppTheme.accentEmerald,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    IconButton(
                      icon: const Icon(Icons.chevron_right),
                      onPressed: () => _selectChallenge(challenge),
                    ),
                  ],
                ),
              );
            },
          ),
        ] else ...[
          // SANDBOX EDITOR WORKSPACE
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => setState(() => _selectedChallenge = null),
              ),
              const SizedBox(width: 8),
              Text(
                _selectedChallenge!.title,
                style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const Spacer(),
              if (_isSolved)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.accentEmerald.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.accentEmerald.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.check, color: AppTheme.accentEmerald, size: 14),
                      SizedBox(width: 6),
                      Text('Solved', style: TextStyle(color: AppTheme.accentEmerald, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),

          // Challenge description card
          GlassContainer(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Problem Statement', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 8),
                Text(
                  _selectedChallenge!.description,
                  style: const TextStyle(fontSize: 13, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Code Editor Toolbar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              DropdownButton<String>(
                value: _selectedLanguage,
                underline: const SizedBox(),
                items: ["Python", "Java", "C++"]
                    .map((lang) => DropdownMenuItem(value: lang, child: Text(lang)))
                    .toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedLanguage = val!;
                    _loadTemplate();
                  });
                },
              ),
              ElevatedButton.icon(
                onPressed: _isCompiling ? null : _runCode,
                icon: const Icon(Icons.play_arrow, color: Colors.white, size: 16),
                label: Text(_isCompiling ? 'Running...' : 'Run Tests', style: const TextStyle(color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.brandPrimary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Code Field Container
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
              borderRadius: BorderRadius.circular(12),
              color: isDark ? const Color(0xFF0F0E1F) : const Color(0xFFFAF9FF),
            ),
            child: TextField(
              controller: _codeController,
              maxLines: 12,
              style: GoogleFonts.sourceCodePro(
                fontSize: 13,
                color: isDark ? Colors.white70 : Colors.black87,
              ),
              decoration: const InputDecoration(
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),

          const SizedBox(height: 20),

          // RESULTS & COMPILER STDOUT
          if (_isCompiling)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16.0),
              child: Center(
                child: Column(
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 12),
                    Text('Compiling and running mock test cases...', style: TextStyle(fontSize: 12)),
                  ],
                ),
              ),
            ),

          if (_hasRunTests)
            GlassContainer(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Test Case Results', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 12),
                  const Divider(),
                  const SizedBox(height: 8),
                  ...List.generate(_selectedChallenge!.testCases.length, (idx) {
                    final testCase = _selectedChallenge!.testCases[idx];
                    final passed = _testCasesPassed[idx];
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6.0),
                      child: Row(
                        children: [
                          Icon(
                            passed ? Icons.check_circle : Icons.cancel,
                            color: passed ? AppTheme.accentEmerald : AppTheme.accentRose,
                            size: 18,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Test Case ${idx + 1}: Input "${testCase['input']}" -> Expected "${testCase['output']}"',
                              style: const TextStyle(fontSize: 12),
                            ),
                          ),
                          Text(
                            passed ? 'PASSED' : 'FAILED',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: passed ? AppTheme.accentEmerald : AppTheme.accentRose,
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
        ],
      ],
    );
  }
}
