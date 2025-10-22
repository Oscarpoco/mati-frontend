import { Platform } from 'react-native';

const primaryGreen = '#22C55E';   
const backgroundDark = '#000'; 
const cardGray = '#252525';       
const textPrimary = '#FFFFFF';    // White main text
const textSecondary = '#9BA1A6';  // Muted gray text
const borderGray = '#1F1F1F';     // Subtle border line
const warningRed = '#EF4444';     // Red for errors/warnings  

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
    warningRed: warningRed,
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
    warningRed: warningRed,
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
