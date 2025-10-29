import { Platform } from 'react-native';

const primaryGreen = '#41F4DA' + "80";   
const button = '#41F4DA' + "10";   
const bottomNav = '#1f8e7dff';   
const backgroundDark = '#000'; 
const cardGray = '#252525';       
const textPrimary = '#FFFFFF';    
const textSecondary = '#9BA1A6';  
const borderGray = '#1F1F1F';     
const warningRed = '#b34d4dff';     
const successGreen = '#22C55E'; 
const logo = '#41F4DA'

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
    successGreen: successGreen,
    bottomNav: bottomNav,
    button: button,
    logo: logo
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
    successGreen: successGreen,
    bottomNav: bottomNav,
    button: button,
    logo: logo
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
