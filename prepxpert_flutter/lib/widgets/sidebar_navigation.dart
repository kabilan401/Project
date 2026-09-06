import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student.dart';
import '../theme/app_theme.dart';
import 'glass_container.dart';

class SidebarNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTabChanged;
  final Student user;
  final VoidCallback onThemeToggle;
  final bool isDark;
  final VoidCallback onLogout;

  const SidebarNavigation({
    super.key,
    required this.currentIndex,
    required this.onTabChanged,
    required this.user,
    required this.onThemeToggle,
    required this.isDark,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> menuItems = [
      {'title': 'Progress & Scores', 'icon': Icons.trending_up},
      {'title': 'Profile Workspace', 'icon': Icons.person_outline},
      {'title': 'Aptitude Arena', 'icon': Icons.psychology},
      {'title': 'Coding Arena', 'icon': Icons.code},
      {'title': 'Placement Mock Test', 'icon': Icons.assignment},
      {'title': 'Interview Prep Q&A', 'icon': Icons.chat_bubble_outline},
      {'title': 'AI English Assistant', 'icon': Icons.translate},
      {'title': 'Company Prep Stepper', 'icon': Icons.business_center},
      {'title': 'Placement Jobs', 'icon': Icons.notifications_none},
    ];

    if (user.role == 'admin') {
      menuItems.insert(0, {'title': 'Admin Dashboard', 'icon': Icons.admin_panel_settings});
    }

    return GlassContainer(
      borderRadius: 16.0,
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // BRAND LOGO
          Row(
            children: [
              const Icon(Icons.school, color: AppTheme.brandPrimary, size: 32),
              const SizedBox(width: 12),
              ShaderMask(
                shaderCallback: (bounds) => AppTheme.brandGradient.createShader(bounds),
                child: Text(
                  'PrepXpert',
                  style: GoogleFonts.outfit(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          
          // USER PROFILE SUMMARY CARD
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? Colors.white.withOpacity(0.02) : Colors.black.withOpacity(0.02),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.08),
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppTheme.brandPrimary,
                  child: Text(
                    user.name.isNotEmpty ? user.name[0].toUpperCase() : 'S',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.name,
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        user.department,
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          color: isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // NAVIGATION BUTTONS
          Expanded(
            child: ListView.separated(
              itemCount: menuItems.length,
              separatorBuilder: (context, index) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final isSelected = index == currentIndex;
                return InkWell(
                  onTap: () => onTabChanged(index),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      gradient: isSelected ? AppTheme.brandGradient : null,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          menuItems[index]['icon'],
                          color: isSelected 
                            ? Colors.white 
                            : (isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            menuItems[index]['title'],
                            style: GoogleFonts.outfit(
                              fontSize: 13,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                              color: isSelected 
                                ? Colors.white 
                                : (isDark ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // SETTINGS / ACTION BUTTONS FOOTER
          const SizedBox(height: 16),
          Column(
            children: [
              OutlinedButton.icon(
                onPressed: onThemeToggle,
                icon: Icon(
                  isDark ? Icons.light_mode : Icons.dark_mode, 
                  size: 16, 
                  color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary
                ),
                label: Text(
                  isDark ? 'Light Theme' : 'Dark Theme',
                  style: TextStyle(
                    fontSize: 12, 
                    color: isDark ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(40),
                  alignment: Alignment.centerLeft,
                  side: BorderSide(
                    color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.08)
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                onPressed: onLogout,
                icon: const Icon(Icons.logout, size: 16, color: AppTheme.accentRose),
                label: const Text('Log Out', style: TextStyle(fontSize: 12, color: AppTheme.accentRose)),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(40),
                  alignment: Alignment.centerLeft,
                  side: BorderSide(color: AppTheme.accentRose.withOpacity(0.25)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
