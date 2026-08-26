import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BestScoreCard } from '../components/home/BestScoreCard';
import { HomeActions } from '../components/home/HomeActions';
import { HomeFooter } from '../components/home/HomeFooter';
import { HomeHeader } from '../components/home/HomeHeader';
import { StatsModal } from '../components/home/StatsModal';
import type { HomeTheme } from '../components/home/types';
import { useGameStore } from '../store/gameStore';
import { getThemeValue } from '../utils/theme';

export default function HomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const game = useGameStore((state) => state.game);
    const settings = useGameStore((state) => state.settings);
    const [statsVisible, setStatsVisible] = useState(false);
    const resolvedTheme = getThemeValue(settings.theme, colorScheme);
    const theme = useMemo<HomeTheme>(() => createTheme(resolvedTheme), [resolvedTheme]);
    const hasProgress = game.score > 0 || game.board.some((row) => row.some((cell) => cell !== null));

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.container}>
                <HomeHeader theme={theme} />
                <BestScoreCard score={game.bestScore} theme={theme} />
                <HomeActions theme={theme} hasProgress={hasProgress} onPlay={() => router.push('/game')} onStats={() => setStatsVisible(true)} onSettings={() => router.push('/settings')} />
                <HomeFooter theme={theme} />
            </View>
            <StatsModal visible={statsVisible} onClose={() => setStatsVisible(false)} themeName={resolvedTheme} theme={theme} game={game} settings={settings} />
        </SafeAreaView>
    );
}

function createTheme(resolvedTheme: 'light' | 'dark'): HomeTheme {
    const isDark = resolvedTheme === 'dark';
    return {
        background: isDark ? '#09090B' : '#F7F7F8',
        surface: isDark ? '#141416' : '#FFFFFF',
        text: isDark ? '#FAFAFA' : '#111113',
        muted: isDark ? '#D1D5DB' : '#71717A',
        border: isDark ? '#27272A' : '#E4E4E7',
        accent: '#7C3AED',
        accentSoft: isDark ? '#24153F' : '#F1EAFE',
    };
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 18, justifyContent: 'center' },
});
