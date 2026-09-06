import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../models/question.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../services/database_service.dart';

class CompanyPrepScreen extends StatefulWidget {
  final Student user;
  const CompanyPrepScreen({super.key, required this.user});

  @override
  State<CompanyPrepScreen> createState() => _CompanyPrepScreenState();
}

class _CompanyPrepScreenState extends State<CompanyPrepScreen> {
  CompanyProfile? _selectedCompany;
  int _activeStepIndex = 0;

  void _selectCompany(CompanyProfile comp) {
    setState(() {
      _selectedCompany = comp;
      _activeStepIndex = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final allCompanies = DatabaseService().companyProfiles;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Company Preparation Stepper',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Detailed interview rounds, assessment guidelines, and strategy guides for top tier corporations.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        if (_selectedCompany == null) ...[
          // LIST OF COMPANIES
          Text(
            'Target Companies',
            style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: allCompanies.length,
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 400,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.8,
            ),
            itemBuilder: (context, index) {
              final comp = allCompanies[index];
              return GlassContainer(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.business, color: AppTheme.brandPrimary, size: 24),
                        const SizedBox(width: 12),
                        Text(
                          comp.companyName,
                          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Expanded(
                      child: Text(
                        comp.description,
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton.icon(
                        onPressed: () => _selectCompany(comp),
                        icon: const Icon(Icons.arrow_forward, size: 16),
                        label: const Text('Preparation Guide'),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ] else ...[
          // STEPPER VIEW FOR SELECTED COMPANY
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => setState(() => _selectedCompany = null),
              ),
              const SizedBox(width: 8),
              Text(
                '${_selectedCompany!.companyName} Recruitment Pipeline',
                style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Stepper widget
          Stepper(
            currentStep: _activeStepIndex,
            physics: const ClampingScrollPhysics(),
            onStepTapped: (step) => setState(() => _activeStepIndex = step),
            onStepContinue: () {
              if (_activeStepIndex < _selectedCompany!.rounds.length - 1) {
                setState(() => _activeStepIndex++);
              }
            },
            onStepCancel: () {
              if (_activeStepIndex > 0) {
                setState(() => _activeStepIndex--);
              }
            },
            steps: List.generate(_selectedCompany!.rounds.length, (idx) {
              final roundText = _selectedCompany!.rounds[idx];
              final parts = roundText.split(':');
              final title = parts.isNotEmpty ? parts[0] : 'Round ${idx + 1}';
              final desc = parts.length > 1 ? parts[1].trim() : roundText;

              return Step(
                state: _activeStepIndex > idx 
                  ? StepState.complete 
                  : (_activeStepIndex == idx ? StepState.editing : StepState.indexed),
                isActive: _activeStepIndex >= idx,
                title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                content: Align(
                  alignment: Alignment.centerLeft,
                  child: Padding(
                    padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                    child: Text(
                      desc,
                      style: const TextStyle(fontSize: 12, height: 1.4),
                    ),
                  ),
                ),
              );
            }),
          ),
        ],
      ],
    );
  }
}
