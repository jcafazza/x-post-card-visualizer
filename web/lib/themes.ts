import { Theme } from '@/types/post'

export const themeConfig = {
  light: {
    bg: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#E6E6E6',
    appBg: '#FAFAFA',
    appText: '#171717',
    headerBg: '#FFFFFF',
    headerBorder: '#E5E5E5',
    toolbarBg: 'rgba(255, 255, 255, 0.8)',
  },
  dim: {
    bg: '#15202B',
    textPrimary: '#F2F2F2',
    textSecondary: '#8899A6',
    textTertiary: '#6E767D',
    border: '#38444D',
    appBg: '#10171E',
    appText: '#F7F9F9',
    headerBg: '#15202B',
    headerBorder: '#38444D',
    toolbarBg: 'rgba(21, 32, 43, 0.8)',
  },
  dark: {
    bg: '#000000',
    textPrimary: '#FFFFFF',
    textSecondary: '#71767B',
    textTertiary: '#71767B',
    border: '#2F3336',
    appBg: '#0A0A0A',
    appText: '#E7E9EA',
    headerBg: '#000000',
    headerBorder: '#2F3336',
    toolbarBg: 'rgba(0, 0, 0, 0.8)',
  },
}

export function getThemeStyles(theme: Theme) {
  return themeConfig[theme]
}
