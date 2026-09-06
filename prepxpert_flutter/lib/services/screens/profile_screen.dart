import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';

class ProfileScreen extends StatefulWidget {
  final Student user;
  final Function(Student) onUserUpdate;

  const ProfileScreen({
    super.key,
    required this.user,
    required this.onUserUpdate,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Student _student;
  
  // Controllers
  final _bioController = TextEditingController();
  final _nameController = TextEditingController();
  final _cgpaController = TextEditingController();
  final _skillController = TextEditingController();
  
  // Form controllers for new projects
  final _projTitleController = TextEditingController();
  final _projDescController = TextEditingController();
  
  // Form controllers for certifications
  final _certNameController = TextEditingController();

  bool _isEditingAcademics = false;
  String _selectedDept = "";
  String _selectedYear = "";

  final List<String> _departments = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication",
    "Electrical and Electronics",
    "Mechanical Engineering"
  ];

  final List<String> _years = [
    "First Year",
    "Second Year",
    "Third Year",
    "Final Year"
  ];

  @override
  void initState() {
    super.initState();
    _student = widget.user;
    _bioController.text = _student.bio;
    _nameController.text = _student.name;
    _cgpaController.text = _student.cgpa.toString();
    _selectedDept = _student.department;
    _selectedYear = _student.year;
  }

  void _saveBasicDetails() {
    final updated = Student(
      email: _student.email,
      name: _nameController.text.trim(),
      role: _student.role,
      department: _student.department,
      year: _student.year,
      cgpa: _student.cgpa,
      bio: _bioController.text.trim(),
      skills: _student.skills,
      certifications: _student.certifications,
      projects: _student.projects,
      resume: _student.resume,
      aptitudeStats: _student.aptitudeStats,
      codingSolvedList: _student.codingSolvedList,
      mockHistory: _student.mockHistory,
      dailyTasks: _student.dailyTasks,
    );
    widget.onUserUpdate(updated);
    setState(() => _student = updated);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Profile details updated successfully.')),
    );
  }

  void _saveAcademics() {
    final cgpaVal = double.tryParse(_cgpaController.text) ?? 8.0;
    if (cgpaVal < 0 || cgpaVal > 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('CGPA must be between 0.0 and 10.0')),
      );
      return;
    }

    final updated = Student(
      email: _student.email,
      name: _student.name,
      role: _student.role,
      department: _selectedDept,
      year: _selectedYear,
      cgpa: cgpaVal,
      bio: _student.bio,
      skills: _student.skills,
      certifications: _student.certifications,
      projects: _student.projects,
      resume: _student.resume,
      aptitudeStats: _student.aptitudeStats,
      codingSolvedList: _student.codingSolvedList,
      mockHistory: _student.mockHistory,
      dailyTasks: _student.dailyTasks,
    );
    widget.onUserUpdate(updated);
    setState(() {
      _student = updated;
      _isEditingAcademics = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Academic records updated.')),
    );
  }

  void _addSkill() {
    final newSkill = _skillController.text.trim();
    if (newSkill.isEmpty) return;
    
    if (_student.skills.any((s) => s.toLowerCase() == newSkill.toLowerCase())) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Skill already exists.')),
      );
      return;
    }

    final updatedSkills = List<String>.from(_student.skills)..add(newSkill);
    final updated = _updateStudentFields(skills: updatedSkills);
    widget.onUserUpdate(updated);
    setState(() {
      _student = updated;
      _skillController.clear();
    });
  }

  void _removeSkill(String skill) {
    final updatedSkills = List<String>.from(_student.skills)..remove(skill);
    final updated = _updateStudentFields(skills: updatedSkills);
    widget.onUserUpdate(updated);
    setState(() => _student = updated);
  }

  void _addProject() {
    final title = _projTitleController.text.trim();
    final desc = _projDescController.text.trim();
    if (title.isEmpty || desc.isEmpty) return;

    final updatedProjects = List<Map<String, String>>.from(_student.projects)
      ..add({'title': title, 'desc': desc});
    
    final updated = _updateStudentFields(projects: updatedProjects);
    widget.onUserUpdate(updated);
    setState(() {
      _student = updated;
      _projTitleController.clear();
      _projDescController.clear();
    });
    Navigator.pop(context); // close dialog
  }

  void _removeProject(int index) {
    final updatedProjects = List<Map<String, String>>.from(_student.projects)
      ..removeAt(index);
    final updated = _updateStudentFields(projects: updatedProjects);
    widget.onUserUpdate(updated);
    setState(() => _student = updated);
  }

  void _addCert() {
    final name = _certNameController.text.trim();
    if (name.isEmpty) return;

    final updatedCerts = List<String>.from(_student.certifications)..add(name);
    final updated = _updateStudentFields(certifications: updatedCerts);
    widget.onUserUpdate(updated);
    setState(() {
      _student = updated;
      _certNameController.clear();
    });
    Navigator.pop(context);
  }

  void _removeCert(int index) {
    final updatedCerts = List<String>.from(_student.certifications)..removeAt(index);
    final updated = _updateStudentFields(certifications: updatedCerts);
    widget.onUserUpdate(updated);
    setState(() => _student = updated);
  }

  Student _updateStudentFields({
    List<String>? skills,
    List<Map<String, String>>? projects,
    List<String>? certifications,
    String? resume,
  }) {
    return Student(
      email: _student.email,
      name: _student.name,
      role: _student.role,
      department: _student.department,
      year: _student.year,
      cgpa: _student.cgpa,
      bio: _student.bio,
      skills: skills ?? _student.skills,
      certifications: certifications ?? _student.certifications,
      projects: projects ?? _student.projects,
      resume: resume ?? _student.resume,
      aptitudeStats: _student.aptitudeStats,
      codingSolvedList: _student.codingSolvedList,
      mockHistory: _student.mockHistory,
      dailyTasks: _student.dailyTasks,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Candidate Portfolio Workspace',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Edit your credentials, highlight core skills, and manage project achievements.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        // BASIC INFO PANEL
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Personal Particulars',
                style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 12),
              
              Text('Full Name', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: _nameController,
                decoration: _inputDecoration(isDark),
              ),
              const SizedBox(height: 16),

              Text('Professional Statement (Bio)', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: _bioController,
                maxLines: 3,
                decoration: _inputDecoration(isDark),
              ),
              const SizedBox(height: 16),
              
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton(
                  onPressed: _saveBasicDetails,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.brandPrimary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Save Basic Details', style: TextStyle(color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // ACADEMIC INFO PANEL
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Text(
                    'Academic Standing',
                    style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: Icon(_isEditingAcademics ? Icons.check_circle_outline : Icons.edit_outlined),
                    color: AppTheme.brandPrimary,
                    onPressed: () {
                      if (_isEditingAcademics) {
                        _saveAcademics();
                      } else {
                        setState(() => _isEditingAcademics = true);
                      }
                    },
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Divider(),
              const SizedBox(height: 12),
              
              if (!_isEditingAcademics) ...[
                _buildReadonlyField('Department', _student.department, isDark),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildReadonlyField('Year of Study', _student.year, isDark)),
                    const SizedBox(width: 16),
                    Expanded(child: _buildReadonlyField('Current Cumulative GPA', _student.cgpa.toString(), isDark)),
                  ],
                ),
              ] else ...[
                Text('Department', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: _dropdownDecoration(isDark),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedDept,
                      isExpanded: true,
                      items: _departments.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                      onChanged: (val) => setState(() => _selectedDept = val!),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Year of Study', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: _dropdownDecoration(isDark),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedYear,
                                isExpanded: true,
                                items: _years.map((y) => DropdownMenuItem(value: y, child: Text(y))).toList(),
                                onChanged: (val) => setState(() => _selectedYear = val!),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('CGPA Score', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          TextField(
                            controller: _cgpaController,
                            keyboardType: TextInputType.number,
                            decoration: _inputDecoration(isDark),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 24),

        // TECHNICAL SKILLS PANEL
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Technical & Soft Skills',
                style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _skillController,
                      decoration: _inputDecoration(isDark).copyWith(hintText: 'Add a new skill (e.g. Flutter, Golang)'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _addSkill,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandPrimary,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Icon(Icons.add, color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _student.skills.map((skill) {
                  return Chip(
                    label: Text(skill, style: const TextStyle(fontSize: 12)),
                    backgroundColor: AppTheme.brandPrimary.withOpacity(0.08),
                    side: const BorderSide(color: AppTheme.brandPrimary, width: 0.5),
                    deleteIcon: const Icon(Icons.close, size: 14, color: AppTheme.accentRose),
                    onDeleted: () => _removeSkill(skill),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // PROJECTS PANEL
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Text(
                    'Featured Projects',
                    style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _showAddProjectDialog(context, isDark),
                    icon: const Icon(Icons.add, size: 16, color: Colors.white),
                    label: const Text('Add Project', style: TextStyle(color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandPrimary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(),
              const SizedBox(height: 12),
              
              if (_student.projects.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                  child: Center(child: Text('No projects added yet.', style: TextStyle(fontSize: 13))),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _student.projects.length,
                  separatorBuilder: (context, index) => const Divider(),
                  itemBuilder: (context, index) {
                    final proj = _student.projects[index];
                    return ListTile(
                      title: Text(proj['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(proj['desc'] ?? '', style: const TextStyle(fontSize: 13)),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline, color: AppTheme.accentRose),
                        onPressed: () => _removeProject(index),
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // CERTIFICATIONS PANEL
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Text(
                    'Licenses & Certifications',
                    style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _showAddCertDialog(context, isDark),
                    icon: const Icon(Icons.add, size: 16, color: Colors.white),
                    label: const Text('Add Credential', style: TextStyle(color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandPrimary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(),
              const SizedBox(height: 12),

              if (_student.certifications.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                  child: Center(child: Text('No certifications added yet.', style: TextStyle(fontSize: 13))),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _student.certifications.length,
                  separatorBuilder: (context, index) => const Divider(),
                  itemBuilder: (context, index) {
                    final cert = _student.certifications[index];
                    return ListTile(
                      leading: const Icon(Icons.workspace_premium, color: AppTheme.brandAccent),
                      title: Text(cert, style: const TextStyle(fontWeight: FontWeight.w600)),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline, color: AppTheme.accentRose),
                        onPressed: () => _removeCert(index),
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // MOCK RESUME UPLOADER
        GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Placement Resume Attachment',
                style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              const Divider(),
              const SizedBox(height: 16),

              if (_student.resume == null) ...[
                InkWell(
                  onTap: () async {
                    setState(() {});
                    // Mock file parser
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Parsing resume: extracted skills and profile data!')),
                    );
                    final updated = _updateStudentFields(
                      resume: 'kabilan_resume_2026.pdf',
                      skills: List<String>.from(_student.skills)..addAll(['SQL', 'Docker', 'Git']),
                    );
                    widget.onUserUpdate(updated);
                    setState(() => _student = updated);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 36),
                    width: double.infinity,
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: isDark ? Colors.white24 : Colors.black24,
                        style: BorderStyle.values[1], // dashed mock border
                      ),
                      borderRadius: BorderRadius.circular(12),
                      color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
                    ),
                    child: Column(
                      children: [
                        const Icon(Icons.upload_file, size: 36, color: AppTheme.brandPrimary),
                        const SizedBox(height: 12),
                        Text(
                          'Upload PDF Resume to Auto-Extract Skills',
                          style: GoogleFonts.outfit(fontWeight: FontWeight.w600, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Simulate parser: adds SQL, Docker, and Git to your skills automatically',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ),
              ] else ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.accentEmerald.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppTheme.accentEmerald.withOpacity(0.2)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_outline, color: AppTheme.accentEmerald, size: 24),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _student.resume!,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'Verified and parsed successfully.',
                              style: TextStyle(fontSize: 11, color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, color: AppTheme.accentRose),
                        onPressed: () {
                          final updated = _updateStudentFields(resume: null);
                          widget.onUserUpdate(updated);
                          setState(() => _student = updated);
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildReadonlyField(String label, String value, bool isDark) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isDark ? Colors.white10 : Colors.black10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(bool isDark) {
    return InputDecoration(
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: isDark ? Colors.white12 : Colors.black12),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: AppTheme.brandPrimary),
      ),
      filled: true,
      fillColor: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
      hintStyle: const TextStyle(fontSize: 12),
    );
  }

  BoxDecoration _dropdownDecoration(bool isDark) {
    return BoxDecoration(
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
      color: isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01),
    );
  }

  void _showAddProjectDialog(BuildContext context, bool isDark) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add Featured Project'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _projTitleController,
                decoration: _inputDecoration(isDark).copyWith(hintText: 'Project Title'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _projDescController,
                maxLines: 3,
                decoration: _inputDecoration(isDark).copyWith(hintText: 'Short Description'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: _addProject,
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              child: const Text('Save Project', style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  void _showAddCertDialog(BuildContext context, bool isDark) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add License or Certification'),
          content: TextField(
            controller: _certNameController,
            decoration: _inputDecoration(isDark).copyWith(hintText: 'Credential Name (e.g. AWS Security)'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: _addCert,
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              child: const Text('Save Certification', style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }
}
