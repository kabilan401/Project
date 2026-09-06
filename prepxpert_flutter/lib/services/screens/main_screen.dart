import 'package:flutter/material.dart';
import '../models/student.dart';
import '../services/database_service.dart';
import '../widgets/sidebar_navigation.dart';

// Screen imports
import 'dashboard_screen.dart';
import 'profile_screen.dart';
import 'aptitude_screen.dart';
import 'coding_screen.dart';
import 'mock_test_screen.dart';
import 'interview_screen.dart';
import 'english_assistant_screen.dart';
import 'company_prep_screen.dart';
import 'notifications_screen.dart';
import 'admin_screen.dart';

class MainScreen extends StatefulWidget {
  final Student user;
  final VoidCallback onLogout;
  final VoidCallback onThemeToggle;
  final bool isDark;

  const MainScreen({
    super.key,
    required this.user,
    required this.onLogout,
    required this.onThemeToggle,
    required this.isDark,
  });

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    // Default starting tab:
    // If admin, start with Admin Dashboard (tab index 0)
    // If student, start with Dashboard/Progress (tab index 0)
  }

  Widget _buildContent(Student currentUser) {
    final isAdmin = currentUser.role == 'admin';
    
    // Resolve which screen to show based on index
    int index = _activeTab;
    if (isAdmin) {
      switch (index) {
        case 0: return AdminScreen(user: currentUser);
        case 1: return DashboardScreen(user: currentUser);
        case 2: return ProfileScreen(user: currentUser, onUserUpdate: _handleUserUpdate);
        case 3: return AptitudeScreen(user: currentUser);
        case 4: return CodingScreen(user: currentUser);
        case 5: return MockTestScreen(user: currentUser);
        case 6: return InterviewScreen(user: currentUser);
        case 7: return EnglishAssistantScreen(user: currentUser);
        case 8: return CompanyPrepScreen(user: currentUser);
        case 9: return NotificationsScreen(user: currentUser);
        default: return AdminScreen(user: currentUser);
      }
    } else {
      switch (index) {
        case 0: return DashboardScreen(user: currentUser);
        case 1: return ProfileScreen(user: currentUser, onUserUpdate: _handleUserUpdate);
        case 2: return AptitudeScreen(user: currentUser);
        case 3: return CodingScreen(user: currentUser);
        case 4: return MockTestScreen(user: currentUser);
        case 5: return InterviewScreen(user: currentUser);
        case 6: return EnglishAssistantScreen(user: currentUser);
        case 7: return CompanyPrepScreen(user: currentUser);
        case 8: return NotificationsScreen(user: currentUser);
        default: return DashboardScreen(user: currentUser);
      }
    }
  }

  void _handleUserUpdate(Student updatedUser) async {
    await DatabaseService().updateUser(updatedUser);
    setState(() {}); // refresh local UI
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final isDesktop = mediaQuery.size.width > 900;
    final currentUser = DatabaseService().getCurrentUser() ?? widget.user;

    Widget mainWorkspace = SafeArea(
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: isDesktop ? 40.0 : 16.0, 
          vertical: 24.0
        ),
        child: _buildContent(currentUser),
      ),
    );

    if (isDesktop) {
      return Scaffold(
        body: Row(
          children: [
            // Permanent Side Navigation Panel
            Container(
              width: 300,
              padding: const EdgeInsets.all(20.0),
              child: SidebarNavigation(
                currentIndex: _activeTab,
                onTabChanged: (idx) => setState(() => _activeTab = idx),
                user: currentUser,
                onThemeToggle: widget.onThemeToggle,
                isDark: widget.isDark,
                onLogout: widget.onLogout,
              ),
            ),
            // Scrollable Content Pane
            Expanded(
              child: SingleChildScrollView(
                child: mainWorkspace,
              ),
            ),
          ],
        ),
      );
    } else {
      // Mobile Layout with Hamburger Drawer
      final titleStr = currentUser.role == 'admin' && _activeTab == 0
          ? 'Admin Console'
          : 'PrepXpert';
          
      return Scaffold(
        appBar: AppBar(
          title: Text(
            titleStr,
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
        ),
        drawer: Drawer(
          backgroundColor: Colors.transparent,
          child: SidebarNavigation(
            currentIndex: _activeTab,
            onTabChanged: (idx) {
              setState(() => _activeTab = idx);
              Navigator.pop(context); // close drawer
            },
            user: currentUser,
            onThemeToggle: widget.onThemeToggle,
            isDark: widget.isDark,
            onLogout: widget.onLogout,
          ),
        ),
        body: SingleChildScrollView(
          child: mainWorkspace,
        ),
      );
    }
  }
}
