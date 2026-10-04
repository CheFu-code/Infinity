import type { ColorSchemeName } from 'react-native';

export function getThemeValue(theme: 'light' | 'dark' | 'system', colorScheme: ColorSchemeName): 'light' | 'dark' {
  if (theme === 'system') {
    return colorScheme === 'dark' ? 'dark' : 'light';
  }

  return theme;
}
