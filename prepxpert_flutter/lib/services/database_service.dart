import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/student.dart';
import '../models/question.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  SharedPreferences? _prefs;
  Student? _currentUser;
  
  // Local list in-memory as cache
  final List<Student> _registeredStudents = [];
  final List<Map<String, dynamic>> _adminViolationsLog = [];

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    _loadInitialData();
  }

  void _loadInitialData() {
    // Populate default students if empty
    final String? studentsStr = _prefs?.getString('prep_registered_students');
    if (studentsStr != null) {
      final List parsed = jsonDecode(studentsStr);
      _registeredStudents.clear();
      _registeredStudents.addAll(parsed.map((s) => Student.fromJson(s)));
    } else {
      // Default Mock Student and Admin
      _registeredStudents.addAll([
        Student(
          email: "student@prepxpert.com",
          name: "Kabilan S",
          role: "student",
          department: "Computer Science and Engineering",
          year: "Final Year",
          cgpa: 8.75,
          bio: "Passionate full-stack developer interested in building mobile applications and solving complex algorithms.",
          skills: ["Flutter", "Dart", "React", "Node.js", "Java", "Python"],
          certifications: ["Google Flutter Specialist", "AWS Certified Cloud Practitioner"],
          projects: [
            {"title": "PrepXpert Placement Portal", "desc": "A proctored, multi-functional examination and assessment system."},
            {"title": "Smart Agri-Tech IoT", "desc": "Real-time crop monitoring system with localized weather prediction."}
          ],
          aptitudeStats: {'total': 15, 'correct': 12},
          codingSolvedList: ["c1", "c3"],
          mockHistory: [
            {'date': '2026-08-15', 'score': 8, 'total': 10, 'violations': 0, 'result': 'Pass'},
            {'date': '2026-08-25', 'score': 9, 'total': 10, 'violations': 1, 'result': 'Pass'}
          ],
          dailyTasks: {
            'streak': 4,
            'completed': {'2026-08-30': true, '2026-08-31': true}
          },
        ),
        Student(
          email: "admin@prepxpert.com",
          name: "Placement Admin Team",
          role: "admin",
          department: "Placement Cell Office",
          year: "Staff",
          cgpa: 10.0,
          bio: "Placement officer managing corporate training programs and assessments.",
          skills: ["Coordination", "Corporate Relations"],
          certifications: [],
          projects: [],
          aptitudeStats: {'total': 0, 'correct': 0},
          codingSolvedList: [],
          mockHistory: [],
          dailyTasks: {'streak': 0, 'completed': {}},
        ),
      ]);
      _saveStudentsToPrefs();
    }

    final String? currentStr = _prefs?.getString('prep_student_user');
    if (currentStr != null) {
      _currentUser = Student.fromJson(jsonDecode(currentStr));
    }

    final String? violationsStr = _prefs?.getString('prep_admin_violations');
    if (violationsStr != null) {
      final List parsed = jsonDecode(violationsStr);
      _adminViolationsLog.clear();
      _adminViolationsLog.addAll(parsed.map((e) => Map<String, dynamic>.from(e)));
    }
  }

  void _saveStudentsToPrefs() {
    _prefs?.setString(
      'prep_registered_students', 
      jsonEncode(_registeredStudents.map((s) => s.toJson()).toList())
    );
  }

  Future<Student?> login(String email, String password) async {
    // In our simplified mock, any password length >= 6 works, matching React logic
    if (password.length < 6) return null;
    
    final normalizedEmail = email.trim().toLowerCase();
    final index = _registeredStudents.indexWhere(
      (s) => s.email.toLowerCase() == normalizedEmail
    );

    if (index != -1) {
      _currentUser = _registeredStudents[index];
      await _prefs?.setString('prep_student_user', jsonEncode(_currentUser!.toJson()));
      return _currentUser;
    }
    return null;
  }

  Future<Student> register(
    String name, 
    String email, 
    String password, 
    String department, 
    String year
  ) async {
    final newStudent = Student(
      email: email.trim(),
      name: name.trim(),
      role: "student",
      department: department,
      year: year,
      cgpa: 8.0,
      bio: "Motivated student focusing on full-stack software development and problem solving.",
      skills: [],
      certifications: [],
      projects: [],
      aptitudeStats: {'total': 0, 'correct': 0},
      codingSolvedList: [],
      mockHistory: [],
      dailyTasks: {'streak': 0, 'completed': {}},
    );

    _registeredStudents.add(newStudent);
    _saveStudentsToPrefs();
    
    _currentUser = newStudent;
    await _prefs?.setString('prep_student_user', jsonEncode(_currentUser!.toJson()));
    return newStudent;
  }

  Student? getCurrentUser() => _currentUser;

  Future<void> updateUser(Student updated) async {
    _currentUser = updated;
    await _prefs?.setString('prep_student_user', jsonEncode(updated.toJson()));

    final idx = _registeredStudents.indexWhere((s) => s.email.toLowerCase() == updated.email.toLowerCase());
    if (idx != -1) {
      _registeredStudents[idx] = updated;
      _saveStudentsToPrefs();
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    await _prefs?.remove('prep_student_user');
  }

  List<Student> getAllStudents() {
    return _registeredStudents.where((s) => s.role == "student").toList();
  }

  Future<void> logProctoringViolation(String studentName, String violationType) async {
    final record = {
      'timestamp': DateTime.now().toIso8601String().substring(0, 19).replaceAll('T', ' '),
      'name': studentName,
      'violation': violationType,
    };
    _adminViolationsLog.add(record);
    await _prefs?.setString('prep_admin_violations', jsonEncode(_adminViolationsLog));
  }

  List<Map<String, dynamic>> getAdminViolations() {
    return _adminViolationsLog;
  }

  // --- Static databases matching React App questions ---
  
  final List<AptitudeQuestion> aptitudeQuestions = [
    AptitudeQuestion(
      category: "Quantitative",
      question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
      options: ["120 metres", "150 metres", "324 metres", "180 metres"],
      correctIndex: 1,
      explanation: "Speed of the train = 60 km/hr = 60 * (5/18) m/sec = 50/3 m/sec.\nLength of the train = Speed * Time = (50/3) * 9 = 150 metres."
    ),
    AptitudeQuestion(
      category: "Quantitative",
      question: "A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?",
      options: ["12 days", "15 days", "16 days", "18 days"],
      correctIndex: 1,
      explanation: "Work done by A in 2 days = (1/20) * 2 = 1/10.\nWork done by A, B and C on the 3rd day = 1/20 + 1/30 + 1/60 = (3+2+1)/60 = 6/60 = 1/10.\nTotal work done in 3 days = 1/10 + 1/10 = 1/5.\nSo, 1/5 of the work is done in 3 days. Therefore, the whole work will be completed in 3 * 5 = 15 days."
    ),
    AptitudeQuestion(
      category: "Quantitative",
      question: "The average age of a class of 39 students is 15 years. If the age of the teacher be included, the average age increases by 3 months. What is the age of the teacher?",
      options: ["35 years", "28 years", "25 years", "40 years"],
      correctIndex: 2,
      explanation: "Sum of ages of 39 students = 39 * 15 = 585 years.\nAverage age of 40 people (students + teacher) = 15.25 years.\nSum of ages of 40 people = 40 * 15.25 = 610 years.\nAge of the teacher = 610 - 585 = 25 years."
    ),
    AptitudeQuestion(
      category: "Logical",
      question: "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded in that code?",
      options: ["CPNCBX", "CPNCBZ", "CPOCBZ", "CQOCBZ"],
      correctIndex: 1,
      explanation: "Each letter in MADRAS is shifted forward by 1 (+1). Moving letters of BOMBAY yields CPNCBZ."
    ),
    AptitudeQuestion(
      category: "Logical",
      question: "Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son.' How is Vipul related to the girl in the photograph?",
      options: ["Brother", "Uncle", "Cousin", "Data Insufficient"],
      correctIndex: 0,
      explanation: "Grandfather's only son is Vipul's father. Father's daughter is Vipul's sister. So Vipul is the brother."
    ),
    AptitudeQuestion(
      category: "Verbal",
      question: "Find the synonym of 'CANDID':",
      options: ["Sincere", "Polite", "Frank", "Silent"],
      correctIndex: 2,
      explanation: "Candid means truthful, straightforward, or frank."
    ),
    AptitudeQuestion(
      category: "Verbal",
      question: "Choose the correct spelling:",
      options: ["Receive", "Recieve", "Receve", "Reiceve"],
      correctIndex: 0,
      explanation: "The correct spelling is 'Receive'. Remember the rule: 'i before e except after c'."
    ),
  ];

  final List<CodingChallenge> codingChallenges = [
    CodingChallenge(
      id: "c1",
      title: "Reverse a String",
      difficulty: "Easy",
      description: "Write a function that takes a string as input and returns the string reversed. For example, if input is 'hello', the output should be 'olleh'.",
      testCases: [
        {"input": "google", "output": "elgoog"},
        {"input": "hello", "output": "olleh"}
      ]
    ),
    CodingChallenge(
      id: "c2",
      title: "Palindrome Check",
      difficulty: "Easy",
      description: "Write a function to check whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward. Example: 121 is a palindrome, but -121 is not.",
      testCases: [
        {"input": "121", "output": "true"},
        {"input": "-121", "output": "false"}
      ]
    ),
    CodingChallenge(
      id: "c3",
      title: "Two Sum",
      difficulty: "Medium",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
      testCases: [
        {"input": "[2, 7, 11, 15], 9", "output": "[0, 1]"},
        {"input": "[3, 2, 4], 6", "output": "[1, 2]"}
      ]
    )
  ];

  final List<CompanyProfile> companyProfiles = [
    CompanyProfile(
      companyName: "Google",
      description: "Leading technology corporation specializing in search engine advertising, cloud computing, and software platforms.",
      rounds: [
        "Round 1: Online Technical Assessment (2 Coding Questions, 45 Mins)",
        "Round 2: Technical Interview I (Data Structures & Algorithms, Problem Solving)",
        "Round 3: Technical Interview II (System Design & Scalability)",
        "Round 4: Googliness & Leadership (Behavioral and Cultural Fit Round)"
      ]
    ),
    CompanyProfile(
      companyName: "Microsoft",
      description: "Global computer technology firm providing software licensing, consumer electronics, and cloud cloud platforms.",
      rounds: [
        "Round 1: Coding Test on Codility (3 Questions, 90 Mins)",
        "Round 2: Technical Interview (Core DSA and OS concepts)",
        "Round 3: System Design & Projects Deep-dive",
        "Round 4: HR Round (Vetting, alignment with Microsoft's growth mindset)"
      ]
    ),
  ];

  final List<Map<String, dynamic>> interviewQuestions = [
    {
      'id': 'i1',
      'category': 'Behavioral',
      'question': 'Tell me about a time you worked in a team and faced a conflict. How did you resolve it?',
      'keyWords': ['conflict', 'resolve', 'communicate', 'listen', 'team', 'compromise'],
      'sampleAnswer': 'In my final-year project, our team disagreed on whether to use SQL or NoSQL. I organized a comparison meeting, listened to arguments, and we compromises on SQL for data integrity, resolving the conflict through clear communication.'
    },
    {
      'id': 'i2',
      'category': 'Technical',
      'question': 'What is the difference between an abstract class and an interface in OOP?',
      'keyWords': ['abstract', 'interface', 'multiple inheritance', 'state', 'contract', 'implementation'],
      'sampleAnswer': 'An abstract class can have instance variables and concrete methods, allowing state preservation. An interface defines a strict contract with only signatures, enabling multiple inheritance implementation in languages like Java.'
    }
  ];

  final List<String> tutorQuestions = [
    "Hi! I am Priya, your placement coach. Let's start with a unique challenge: If you had to explain your favorite programming language to a 10-year-old child using a real-world metaphor, how would you describe it?",
    "Fascinating. Let's talk about tech innovation. If you had unlimited funding to build any AI application to solve a major everyday problem in your student life, what would you build and why?",
    "Great concept. Imagine you are working on a team project and a key member abruptly leaves two days before the deployment deadline. What immediate, actionable steps would you take to save the project?",
    "Excellent problem-solving. With generative AI writing code so quickly now, what is the most important human skill a software engineer needs to possess to stay highly valuable?",
    "Insightful view. Final question: Tell me about a time you failed at a technical task or project. What went wrong, and how did that failure actually make you a better developer?"
  ];
}
