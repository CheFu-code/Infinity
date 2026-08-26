import Animated, { FadeIn } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import type { HomeTheme } from './types';

export function HomeFooter({ theme }: { theme: HomeTheme }) {
    return <Animated.View entering={FadeIn.delay(450).duration(500)} style={styles.footer}><View style={[styles.dot, { backgroundColor: theme.accent }]} /><Text style={[styles.text, { color: theme.muted }]}>Merge. Think. Repeat.</Text></Animated.View>;
}

const styles = StyleSheet.create({ footer: { position: 'absolute', bottom: 18, left: 24, right: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }, dot: { width: 5, height: 5, borderRadius: 3, marginRight: 8 }, text: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 } });