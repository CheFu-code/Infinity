import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import type { HomeTheme } from './types';

export function HomeHeader({ theme }: { theme: HomeTheme }) {
    return (
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
            <View style={[styles.brandMark, { backgroundColor: theme.accentSoft }]}>
                <Ionicons name="infinite" size={28} color={theme.accent} />
            </View>
            <View>
                <Text style={[styles.eyebrow, { color: theme.muted }]}>THE ENDLESS PUZZLE</Text>
                <Text style={[styles.title, { color: theme.text }]}>Infinity</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 34 },
    brandMark: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginBottom: 2 },
    title: { fontSize: 36, lineHeight: 40, fontWeight: '900', letterSpacing: -1.5 },
});
