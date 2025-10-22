import { Platform } from 'react-native';

const primaryGreen = '#22C55E';   // Accent / Primary brand color
const backgroundDark = '#0E0E0E'; // Background color from design
const cardGray = '#151718';       // Card or section background
const textPrimary = '#FFFFFF';    // White main text
const textSecondary = '#9BA1A6';  // Muted gray text
const borderGray = '#1F1F1F';     // Subtle border line

export const Colors = {
  light: {
    text: textPrimary,
    textSecondary,
    background: backgroundDark,
    card: cardGray,
    tint: primaryGreen,
    icon: textSecondary,
    border: borderGray,
    success: primaryGreen,
    tabIconDefault: textSecondary,
    tabIconSelected: primaryGreen,
  },
  dark: {
    text: textPrimary,
    textSecondary,
    background: backgroundDark,
    card: cardGray,
    tint: primaryGreen,
    icon: textSecondary,
    border: borderGray,
    success: primaryGreen,
    tabIconDefault: textSecondary,
    tabIconSelected: primaryGreen,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
