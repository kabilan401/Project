import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'services/database_service.dart';
import 'screens/auth_screen.dart';
import 'screens/main_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Mock Local Database
  final db = DatabaseService();
  await db.init();

  runApp(const PrepXpertApp());
}

class PrepXpertApp extends StatefulWidget {
  const PrepXpertApp({super.key});

  @override
  State<PrepXpertApp> createState() => _PrepXpertAppState();
}

class _PrepXpertAppState extends State<PrepXpertApp> {
  bool _isDarkTheme = true;
  bool _isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  void _checkLoginStatus() {
    final db = DatabaseService();
    final user = db.getCurrentUser();
    setState(() {
      _isLoggedIn = (user != null);
    });
  }

  void _toggleTheme() {
    setState(() {
      _isDarkTheme = !_isDarkTheme;
    });
  }

  void _handleLoginSuccess() {
    setState(() {
      _isLoggedIn = true;
    });
  }

  void _handleLogout() async {
    final db = DatabaseService();
    await db.logout();
    setState(() {
      _isLoggedIn = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget activeScreen;
    if (_isLoggedIn) {
      final user = DatabaseService().getCurrentUser();
      activeScreen = MainScreen(
        user: user!,
        onLogout: _handleLogout,
        onThemeToggle: _toggleTheme,
        isDark: _isDarkTheme,
      );
    } else {
      activeScreen = AuthScreen(
        onLoginSuccess: _handleLoginSuccess,
      );
    }

    return MaterialApp(
      title: 'PrepXpert Placement Portal',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _isDarkTheme ? ThemeMode.dark : ThemeMode.light,
      home: activeScreen,
    );
  }
}
