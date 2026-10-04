import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Modal as RNModal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { useGameStore } from '../store/gameStore';
import { getThemeValue } from '../utils/theme';

export default function HomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const game = useGameStore((state) => state.game);
    const settings = useGameStore((state) => state.settings);
    const restart = useGameStore((state) => state.restart);

    const [statsVisible, setStatsVisible] = useState(false);
    const [confirmNewGame, setConfirmNewGame] = useState(false);

    const resolvedTheme = getThemeValue(settings.theme, colorScheme);
    const isDark = resolvedTheme === 'dark';

    const hasProgress = game.score > 0 || game.board.some((row) => row.some((cell) => cell !== null));

    const bg = isDark ? '#111827' : '#f8fafc';
    const text = isDark ? '#f8fafc' : '#0f172a';
    const muted = isDark ? '#94a3b8' : '#64748b';
    const surface = isDark ? '#1f2937' : '#ffffff';
    const border = isDark ? '#334155' : '#e2e8f0';

    const handlePlay = () => router.push('/game');
    const handleNewGame = () => {
        if (hasProgress) {
            setConfirmNewGame(true);
        } else {
            router.push('/game');
        }
    };
    const handleConfirmNewGame = () => {
        setConfirmNewGame(false);
        restart();
        router.push('/game');
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
            {/* Header: Stats and Settings icons pinned to the top right */}
            <View style={styles.header}>
                <Pressable
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Statistics"
                    onPress={() => setStatsVisible(true)}
                    style={({ pressed }) => [styles.headerIcon, pressed && styles.headerIconPressed]}
                >
                    <Ionicons name="stats-chart-outline" size={24} color={text} />
                </Pressable>
                <Pressable
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Settings"
                    onPress={() => router.push('/settings')}
                    style={({ pressed }) => [styles.headerIcon, pressed && styles.headerIconPressed]}
                >
                    <Ionicons name="settings-outline" size={24} color={text} />
                </Pressable>
            </View>

            <View style={styles.container}>

                {/* Title */}
                <View style={styles.top}>
                    <Text style={[styles.title, { color: text }]}>Infinity</Text>
                </View>

                {/* Score */}
                <View style={[styles.scoreBlock, { backgroundColor: surface, borderColor: border }]}>
                    <View style={styles.scoreRow}>
                        <View style={styles.scoreItem}>
                            <Text style={[styles.scoreLabel, { color: muted }]}>BEST</Text>
                            <Text style={[styles.scoreValue, { color: text }]}>{game.bestScore.toLocaleString()}</Text>
                        </View>
                        <View style={[styles.scoreDivider, { backgroundColor: border }]} />
                        <View style={styles.scoreItem}>
                            <Text style={[styles.scoreLabel, { color: muted }]}>MAX TILE</Text>
                            <Text style={[styles.scoreValue, { color: text }]}>{game.maxTile > 0 ? game.maxTile : '—'}</Text>
                        </View>
                    </View>
                </View>

                {/* Active game notice */}
                {hasProgress && (
                    <Text style={[styles.activeNotice, { color: muted }]}>
                        You have an active game — {game.score.toLocaleString()} pts
                    </Text>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    {hasProgress ? (
                        <View style={styles.actionRow}>
                            <View style={styles.flex}>
                                <Button label="New Game" variant="secondary" onPress={handleNewGame} />
                            </View>
                            <View style={styles.flex}>
                                <Button label="Continue" onPress={handlePlay} />
                            </View>
                        </View>
                    ) : (
                        <Button label="Play" onPress={handlePlay} />
                    )}
                </View>

            </View>

            {/* Stats Modal */}
            <RNModal visible={statsVisible} transparent animationType="fade" onRequestClose={() => setStatsVisible(false)}>
                <View style={styles.overlay}>
                    <Pressable style={styles.backdrop} onPress={() => setStatsVisible(false)} />
                    <View style={[styles.sheet, { backgroundColor: surface, borderColor: border }]}>
                        <View style={styles.sheetHeader}>
                            <Text style={[styles.sheetTitle, { color: text }]}>Statistics</Text>
                            <Pressable hitSlop={12} onPress={() => setStatsVisible(false)}>
                                <Text style={[styles.closeText, { color: muted }]}>✕</Text>
                            </Pressable>
                        </View>

                        <View style={[styles.statGrid, { borderColor: border }]}>
                            <StatCell label="Best Score" value={game.bestScore.toLocaleString()} text={text} muted={muted} />
                            <StatCell label="Max Tile" value={game.maxTile > 0 ? String(game.maxTile) : '—'} text={text} muted={muted} />
                            <StatCell label="Current Score" value={game.score.toLocaleString()} text={text} muted={muted} />
                            <StatCell label="Total Moves" value={game.moveCount.toLocaleString()} text={text} muted={muted} />
                        </View>

                        <Text style={[styles.sectionLabel, { color: muted }]}>
                            Achievements ({game.achievements.filter((a) => a.unlocked).length}/{game.achievements.length})
                        </Text>

                        <ScrollView style={styles.achScroll} showsVerticalScrollIndicator={false}>
                            {game.achievements.map((item) => (
                                <View key={item.id} style={[styles.achRow, { borderBottomColor: border, opacity: item.unlocked ? 1 : 0.4 }]}>
                                    <Text style={[styles.achTitle, { color: text }]}>{item.title}</Text>
                                    <Text style={[styles.achDesc, { color: muted }]}>{item.description}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </RNModal>

            {/* Confirm New Game */}
            <RNModal visible={confirmNewGame} transparent animationType="fade" onRequestClose={() => setConfirmNewGame(false)}>
                <View style={styles.overlay}>
                    <Pressable style={styles.backdrop} onPress={() => setConfirmNewGame(false)} />
                    <View style={[styles.sheet, { backgroundColor: surface, borderColor: border, maxWidth: 360 }]}>
                        <Text style={[styles.sheetTitle, { color: text, marginBottom: 8 }]}>Start a new game?</Text>
                        <Text style={[styles.confirmBody, { color: muted }]}>
                            Your current game ({game.score.toLocaleString()} pts) will be lost.
                        </Text>
                        <View style={styles.confirmActions}>
                            <View style={styles.flex}>
                                <Button label="Cancel" variant="secondary" onPress={() => setConfirmNewGame(false)} />
                            </View>
                            <View style={styles.flex}>
                                <Button label="New Game" onPress={handleConfirmNewGame} />
                            </View>
                        </View>
                    </View>
                </View>
            </RNModal>
        </SafeAreaView>
    );
}

function StatCell({ label, value, text, muted }: { label: string; value: string; text: string; muted: string }) {
    return (
        <View style={styles.statCell}>
            <Text style={[styles.statCellLabel, { color: muted }]}>{label}</Text>
            <Text style={[styles.statCellValue, { color: text }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { flex: 1, padding: 28, justifyContent: 'center', gap: 28 },

    header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingTop: 12 },
    headerIcon: { padding: 2 },
    headerIconPressed: { opacity: 0.5 },

    top: { gap: 6 },
    title: { fontSize: 42, fontWeight: '800', letterSpacing: -1.5 },
    subtitle: { fontSize: 16, fontWeight: '500' },

    scoreBlock: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
    },
    scoreRow: { flexDirection: 'row', alignItems: 'center' },
    scoreItem: { flex: 1, alignItems: 'center', gap: 4 },
    scoreDivider: { width: 1, height: 36, marginHorizontal: 16 },
    scoreLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
    scoreValue: { fontSize: 28, fontWeight: '800', letterSpacing: -1 },

    activeNotice: { fontSize: 14, fontWeight: '500' },

    actions: { gap: 10 },
    actionRow: { flexDirection: 'row', gap: 10 },
    flex: { flex: 1 },

    // Modal / Sheet
    overlay: { flex: 1, justifyContent: 'flex-end', padding: 16 },
    backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
    sheet: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 24,
        maxHeight: '80%',
        elevation: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -4 },
    },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sheetTitle: { fontSize: 20, fontWeight: '800' },
    closeText: { fontSize: 18 },

    statGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 24,
    },
    statCell: {
        width: '50%',
        padding: 14,
        gap: 2,
    },
    statCellLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
    statCellValue: { fontSize: 22, fontWeight: '800' },

    sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 12 },

    achScroll: {},
    achRow: {
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 2,
    },
    achTitle: { fontSize: 14, fontWeight: '700' },
    achDesc: { fontSize: 13, fontWeight: '400' },

    confirmBody: { fontSize: 15, marginBottom: 20, lineHeight: 22 },
    confirmActions: { flexDirection: 'row', gap: 10 },
});