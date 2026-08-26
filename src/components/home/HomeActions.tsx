import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { Button } from '../Button';
import type { HomeTheme } from './types';

type Props = { theme: HomeTheme; hasProgress: boolean; onPlay: () => void; onStats: () => void; onSettings: () => void };

export function HomeActions({ theme, hasProgress, onPlay, onStats, onSettings }: Props) {
    const themeMode = theme.background === '#09090B' ? 'dark' : 'light';
    return (
        <Animated.View entering={FadeInDown.delay(180).duration(450)} style={styles.actions}>
            <View style={styles.primaryAction}><Button label="Play" onPress={onPlay} /></View>
            <View style={styles.secondaryActions}>
                <View style={styles.secondaryAction}><Button label="Continue" variant="secondary" onPress={onPlay} disabled={!hasProgress} /></View>
                <View style={styles.secondaryAction}><Button label="Stats" variant="ghost" themeMode={themeMode} onPress={onStats} /></View>
            </View>
            <View style={styles.settingsAction}><Button label="Settings" variant="ghost" themeMode={themeMode} onPress={onSettings} /></View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({ actions: { width: '100%' }, primaryAction: { width: '100%', marginBottom: 12 }, secondaryActions: { flexDirection: 'row', gap: 12, marginBottom: 12 }, secondaryAction: { flex: 1 }, settingsAction: { width: '100%' } });