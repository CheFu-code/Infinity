import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGameStore } from '../store/gameStore';
import * as Sentry from '@sentry/react-native';

Sentry.init({
    dsn: 'https://357385c5b58bd4ce40006d7e7f82bffb@o4512011915296768.ingest.de.sentry.io/4512200301609040',

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
        Sentry.mobileReplayIntegration({
            maskAllText: false,
            maskAllImages: false,
            maskAllVectors: false,
        }),
        Sentry.feedbackIntegration(),
    ],
});

function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = useGameStore((state) => state.settings.theme);
    const isHydrated = useGameStore((state) => state.isHydrated);
    const initialize = useGameStore((state) => state.initialize);
    const resolvedTheme = useMemo(() => {
        if (theme === 'system') {
            return colorScheme ?? 'light';
        }
        return theme;
    }, [colorScheme, theme]);

    useEffect(() => {
        if (!isHydrated) {
            void initialize();
        }
    }, [initialize, isHydrated]);

    if (!isHydrated) {
        return (
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={resolvedTheme === 'dark' ? '#f8fafc' : '#7c3aed'} />
                        <Text style={[styles.loadingText, resolvedTheme === 'dark' ? styles.darkText : styles.lightText]}>Loading game…</Text>
                    </View>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: resolvedTheme === 'dark' ? '#111827' : '#f8fafc' } }} />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 16, fontWeight: '600' },
    lightText: { color: '#0f172a' },
    darkText: { color: '#f8fafc' },
});

export default Sentry.wrap(RootLayout);