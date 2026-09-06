class AptitudeQuestion {
  final String category;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;

  AptitudeQuestion({
    required this.category,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
  });

  factory AptitudeQuestion.fromJson(Map<String, dynamic> json) {
    return AptitudeQuestion(
      category: json['category'] ?? '',
      question: json['question'] ?? '',
      options: List<String>.from(json['options'] ?? []),
      correctIndex: json['correctIndex'] ?? 0,
      explanation: json['explanation'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'category': category,
      'question': question,
      'options': options,
      'correctIndex': correctIndex,
      'explanation': explanation,
    };
  }
}

class CodingChallenge {
  final String id;
  final String title;
  final String difficulty;
  final String description;
  final List<Map<String, String>> testCases; // {input, output}

  CodingChallenge({
    required this.id,
    required this.title,
    required this.difficulty,
    required this.description,
    required this.testCases,
  });

  factory CodingChallenge.fromJson(Map<String, dynamic> json) {
    return CodingChallenge(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      difficulty: json['difficulty'] ?? 'Easy',
      description: json['description'] ?? '',
      testCases: List<Map<String, String>>.from(
        (json['testCases'] as List?)?.map((t) => Map<String, String>.from(t)) ?? []
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'difficulty': difficulty,
      'description': description,
      'testCases': testCases,
    };
  }
}

class CompanyProfile {
  final String companyName;
  final String description;
  final List<String> rounds;

  CompanyProfile({
    required this.companyName,
    required this.description,
    required this.rounds,
  });

  factory CompanyProfile.fromJson(Map<String, dynamic> json) {
    return CompanyProfile(
      companyName: json['companyName'] ?? '',
      description: json['description'] ?? '',
      rounds: List<String>.from(json['rounds'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'companyName': companyName,
      'description': description,
      'rounds': rounds,
    };
  }
}
