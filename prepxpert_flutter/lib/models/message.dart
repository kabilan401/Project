class GrammarError {
  final String mistake;
  final String fix;
  final String explanation;

  GrammarError({
    required this.mistake,
    required this.fix,
    required this.explanation,
  });

  factory GrammarError.fromJson(Map<String, dynamic> json) {
    return GrammarError(
      mistake: json['mistake'] ?? '',
      fix: json['fix'] ?? '',
      explanation: json['explanation'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'mistake': mistake,
      'fix': fix,
      'explanation': explanation,
    };
  }
}

class VocabSuggestion {
  final String original;
  final String suggested;
  final String explanation;

  VocabSuggestion({
    required this.original,
    required this.suggested,
    required this.explanation,
  });

  factory VocabSuggestion.fromJson(Map<String, dynamic> json) {
    return VocabSuggestion(
      original: json['original'] ?? '',
      suggested: json['suggested'] ?? '',
      explanation: json['explanation'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'original': original,
      'suggested': suggested,
      'explanation': explanation,
    };
  }
}

class GrammarAnalysis {
  final String originalText;
  final String correctedText;
  final List<GrammarError> errors;
  final List<VocabSuggestion> vocabSuggestions;
  final bool hasMistakes;

  GrammarAnalysis({
    required this.originalText,
    required this.correctedText,
    required this.errors,
    required this.vocabSuggestions,
    required this.hasMistakes,
  });

  factory GrammarAnalysis.fromJson(Map<String, dynamic> json) {
    return GrammarAnalysis(
      originalText: json['originalText'] ?? '',
      correctedText: json['correctedText'] ?? '',
      errors: List<GrammarError>.from(
        (json['errors'] as List?)?.map((e) => GrammarError.fromJson(e)) ?? []
      ),
      vocabSuggestions: List<VocabSuggestion>.from(
        (json['vocabSuggestions'] as List?)?.map((v) => VocabSuggestion.fromJson(v)) ?? []
      ),
      hasMistakes: json['hasMistakes'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'originalText': originalText,
      'correctedText': correctedText,
      'errors': errors.map((e) => e.toJson()).toList(),
      'vocabSuggestions': vocabSuggestions.map((v) => v.toJson()).toList(),
      'hasMistakes': hasMistakes,
    };
  }
}

class ChatMessage {
  final String id;
  final String sender; // 'user' or 'bot'
  final String text;
  final String timestamp;
  final GrammarAnalysis? grammarAnalysis;

  ChatMessage({
    required this.id,
    required this.sender,
    required this.text,
    required this.timestamp,
    this.grammarAnalysis,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] ?? '',
      sender: json['sender'] ?? 'bot',
      text: json['text'] ?? '',
      timestamp: json['timestamp'] ?? '',
      grammarAnalysis: json['grammarAnalysis'] != null 
          ? GrammarAnalysis.fromJson(json['grammarAnalysis']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sender': sender,
      'text': text,
      'timestamp': timestamp,
      'grammarAnalysis': grammarAnalysis?.toJson(),
    };
  }
}
