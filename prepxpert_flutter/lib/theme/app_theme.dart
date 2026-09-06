import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Dark Theme Colors
  static const Color darkBgPrimary = Color(0xFF0A0816);
  static const Color darkBgSecondary = Color(0xB3110D21); // opacity 0.7
  static const Color darkBgAccent = Color(0x731E1839); // opacity 0.45
  static const Color darkBgSurface = Color(0xFF120E24);
  static const Color darkTextPrimary = Color(0xFFF1ECF9);
  static const Color darkTextSecondary = Color(0xFF9A93B4);
  static const Color darkBorder = Color(0x14FFFFFF); // opacity 0.08
  
  static const Color brandPrimary = Color(0xFF9061F9);
  static const Color brandSecondary = Color(0xFFE02424);
  static const Color brandAccent = Color(0xFFC084FC);
  
  static const LinearGradient brandGradient = LinearGradient(
    colors: [Color(0xFF7C3AED), Color(0xFFD946EF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const Color accentEmerald = Color(0xFF10B981);
  static const Color accentRose = Color(0xFFF43F5E);
  static const Color accentAmber = Color(0xFFF59E0B);

  // Light Theme Colors
  static const Color lightBgPrimary = Color(0xFFF6F5FA);
  static const Color lightBgSecondary = Color(0xC0FFFFFF);
  static const Color lightBgAccent = Color(0xB2F0EDFA);
  static const Color lightBgSurface = Color(0xFFFFFFFF);
  static const Color lightTextPrimary = Color(0xFF19142B);
  static const Color lightTextSecondary = Color(0xFF665F80);
  static const Color lightBorder = Color(0x14000000);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: brandPrimary,
      scaffoldBackgroundColor: darkBgPrimary,
      cardColor: darkBgSurface,
      dividerColor: darkBorder,
      textTheme: TextTheme(
        headlineMedium: GoogleFonts.outfit(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          color: darkTextPrimary,
        ),
        titleLarge: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: darkTextPrimary,
        ),
        bodyLarge: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: darkTextPrimary,
        ),
        bodyMedium: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: darkTextSecondary,
        ),
      ),
      colorScheme: const ColorScheme.dark(
        primary: brandPrimary,
        secondary: brandAccent,
        surface: darkBgSurface,
        error: accentRose,
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: brandPrimary,
      scaffoldBackgroundColor: lightBgPrimary,
      cardColor: lightBgSurface,
      dividerColor: lightBorder,
      textTheme: TextTheme(
        headlineMedium: GoogleFonts.outfit(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          color: lightTextPrimary,
        ),
        titleLarge: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: lightTextPrimary,
        ),
        bodyLarge: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: lightTextPrimary,
        ),
        bodyMedium: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: lightTextSecondary,
        ),
      ),
      colorScheme: const ColorScheme.light(
        primary: brandPrimary,
        secondary: brandAccent,
        surface: lightBgSurface,
        error: accentRose,
      ),
    );
  }
}
