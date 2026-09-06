class Student {
  final String email;
  final String name;
  final String role;
  final String department;
  final String year;
  final double cgpa;
  final String bio;
  final List<String> skills;
  final List<String> certifications;
  final List<Map<String, String>> projects;
  final String? resume;
  final Map<String, dynamic> aptitudeStats; // {total, correct}
  final List<String> codingSolvedList; // list of challenge IDs
  final List<Map<String, dynamic>> mockHistory;
  final Map<String, dynamic> dailyTasks; // {streak, completed: {date: true}}

  Student({
    required this.email,
    required this.name,
    required this.role,
    required this.department,
    required this.year,
    required this.cgpa,
    required this.bio,
    required this.skills,
    required this.certifications,
    required this.projects,
    this.resume,
    required this.aptitudeStats,
    required this.codingSolvedList,
    required this.mockHistory,
    required this.dailyTasks,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'student',
      department: json['department'] ?? '',
      year: json['year'] ?? '',
      cgpa: (json['cgpa'] ?? 8.0).toDouble(),
      bio: json['bio'] ?? '',
      skills: List<String>.from(json['skills'] ?? []),
      certifications: List<String>.from(json['certifications'] ?? []),
      projects: List<Map<String, String>>.from(
        (json['projects'] as List?)?.map((p) => Map<String, String>.from(p)) ?? []
      ),
      resume: json['resume'],
      aptitudeStats: Map<String, dynamic>.from(json['aptitudeStats'] ?? {'total': 0, 'correct': 0}),
      codingSolvedList: List<String>.from(json['codingSolvedList'] ?? []),
      mockHistory: List<Map<String, dynamic>>.from(json['mockHistory'] ?? []),
      dailyTasks: Map<String, dynamic>.from(json['dailyTasks'] ?? {'streak': 0, 'completed': {}}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'name': name,
      'role': role,
      'department': department,
      'year': year,
      'cgpa': cgpa,
      'bio': bio,
      'skills': skills,
      'certifications': certifications,
      'projects': projects,
      'resume': resume,
      'aptitudeStats': aptitudeStats,
      'codingSolvedList': codingSolvedList,
      'mockHistory': mockHistory,
      'dailyTasks': dailyTasks,
    };
  }
}
