import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';

class NotificationsScreen extends StatelessWidget {
  final Student user;
  const NotificationsScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Map<String, dynamic>> jobAlerts = [
      {
        'id': 'n1',
        'company': 'Google India',
        'role': 'Associate Software Engineer',
        'package': '32.5 LPA',
        'eligibility': 'B.Tech CSE/IT, CGPA >= 8.0, No active backlogs',
        'posted': '2 hours ago',
      },
      {
        'id': 'n2',
        'company': 'Microsoft Research',
        'role': 'Data Science Intern',
        'package': '1.2 Lakhs / Month stipend',
        'eligibility': 'B.Tech/M.Tech/Ph.D in CSE or related domains',
        'posted': '1 day ago',
      },
      {
        'id': 'n3',
        'company': 'Adobe Systems',
        'role': 'Member of Technical Staff',
        'package': '24.8 LPA',
        'eligibility': 'B.Tech/Dual Degree CSE, CGPA >= 7.5',
        'posted': '3 days ago',
      }
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Placement Jobs Board',
          style: GoogleFonts.outfit(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'View active campus recruitment drives, eligibility rules, and packages.',
          style: GoogleFonts.outfit(
            fontSize: 14,
            color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 24),

        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: jobAlerts.length,
          separatorBuilder: (context, index) => const SizedBox(height: 16),
          itemBuilder: (context, index) {
            final job = jobAlerts[index];
            return GlassContainer(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.brandPrimary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          job['package']!,
                          style: const TextStyle(
                            fontSize: 12, 
                            fontWeight: FontWeight.bold,
                            color: AppTheme.brandPrimary
                          ),
                        ),
                      ),
                      Text(
                        job['posted']!,
                        style: const TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    job['role']!,
                    style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.business, size: 16, color: Colors.grey),
                      const SizedBox(width: 8),
                      Text(
                        job['company']!,
                        style: const TextStyle(color: Colors.grey, fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Divider(),
                  const SizedBox(height: 12),
                  Text(
                    'Eligibility Criteria:',
                    style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    job['eligibility']!,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 20),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            backgroundColor: AppTheme.accentEmerald,
                            content: Text('Successfully applied for "${job['role']}" at ${job['company']}.'),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text('Apply Now', style: TextStyle(color: Colors.white)),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
