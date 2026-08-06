import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useGameStore((state) => state.settings.theme);
  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return colorScheme ?? 'light';
    }
    return theme;
  }, [colorScheme, theme]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: resolvedTheme === 'dark' ? '#111827' : '#f8fafc' } }} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
