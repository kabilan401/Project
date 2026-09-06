import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GlassContainer extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final Color? color;
  final BoxBorder? border;

  const GlassContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius = 16.0,
    this.color,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    final resolvedColor = color ?? (isDark 
      ? AppTheme.darkBgSecondary.withOpacity(0.55)
      : AppTheme.lightBgSecondary.withOpacity(0.65));

    final resolvedBorder = border ?? Border.all(
      color: isDark 
        ? Colors.white.withOpacity(0.08) 
        : AppTheme.brandPrimary.withOpacity(0.08),
      width: 1.0,
    );

    return Container(
      width: width,
      height: height,
      margin: margin,
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: isDark 
              ? Colors.black.withOpacity(0.45) 
              : AppTheme.brandPrimary.withOpacity(0.08),
            blurRadius: 32.0,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 14.0, sigmaY: 14.0),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: resolvedColor,
              borderRadius: BorderRadius.circular(borderRadius),
              border: resolvedBorder,
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
