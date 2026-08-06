export function getThemeValue(theme: 'light' | 'dark' | 'system', colorScheme: 'light' | 'dark' | null | undefined) {
  if (theme === 'system') {
    return colorScheme ?? 'light';
  }

  return theme;
}
