/**
 * LeetLab design tokens — single source of truth for values that can't
 * come from CSS (StyleSheet fallbacks, tab bar, StatusBar, chart colors).
 * Hex values must stay in sync with global.css.
 */

export const colors = {
  /* Base */
  background: "#0F1115",
  foreground: "#F3F8FF",
  muted: "#8B95A5",
  faint: "#4A5263",

  /* Surfaces */
  surface: "#1A1D24",
  surfaceSecondary: "#22262F",
  overlay: "#1A1D24",

  /* Lines — 1px only, everywhere */
  border: "#2A2E39",

  /* Brand: primary Emerald, secondary Sky */
  primary: "#00D09E",
  onPrimary: "#052E22",
  secondary: "#4DABF7",

  /* Status */
  success: "#00D09E",
  warning: "#FFB800",
  danger: "#FF6B6B",

  /* Difficulty (Easy reuses primary — no extra hue) */
  easy: "#00D09E",
  medium: "#FFB800",
  hard: "#FF6B6B",
} as const;

export const radius = {
  sm: 8, // chips, tags
  md: 12, // buttons, inputs
  lg: 16, // cards
  xl: 20, // sheets, dialogs
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20, // default screen padding
  xl: 24,
  xxl: 32,
} as const;

export const tabBar = {
  background: colors.background,
  border: colors.border,
  active: colors.primary,
  inactive: colors.muted,
} as const;
