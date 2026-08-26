import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import type { HomeTheme } from './types';

export function BestScoreCard({ score, theme }: { score: number; theme: HomeTheme }) {
    return (
        <Animated.View entering={FadeInDown.delay(100).duration(450)} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.header}>
                <View><Text style={[styles.caption, { color: theme.muted }]}>BEST SCORE</Text><Text style={[styles.value, { color: theme.text }]}>{score.toLocaleString()}</Text></View>
                <View style={[styles.icon, { backgroundColor: theme.accentSoft }]}><Ionicons name="trophy-outline" size={22} color={theme.accent} /></View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.footer}><Text style={[styles.footerLabel, { color: theme.muted }]}>Keep going. There is no limit.</Text><Ionicons name="arrow-up" size={16} color={theme.accent} /></View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 26, borderWidth: 1, padding: 22, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 4 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    caption: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 5 },
    value: { fontSize: 42, lineHeight: 46, fontWeight: '900', letterSpacing: -1.5 },
    icon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    divider: { height: 1, marginVertical: 18 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    footerLabel: { fontSize: 13, fontWeight: '500' },
});
