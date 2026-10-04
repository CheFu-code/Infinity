import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Modal as RNModal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const unlockedAchievements = game.achievements.filter((a) => a.unlocked);

    const theme = useMemo(() => ({
        bg: isDark ? '#090D16' : '#F8FAFC',
        surface: isDark ? '#111827' : '#FFFFFF',
        surfaceSubtle: isDark ? '#1F293D' : '#F1F5F9',
        border: isDark ? '#1E293B' : '#E2E8F0',
        text: isDark ? '#F8FAFC' : '#0F172A',
        textMuted: isDark ? '#94A3B8' : '#64748B',
        accent: '#7C3AED',
        accentGlow: 'rgba(124, 58, 237, 0.25)',
        accentSoft: isDark ? 'rgba(124, 58, 237, 0.16)' : '#EDE9FE',
    }), [isDark]);

    const handlePress = (action: () => void) => {
        if (settings.vibrationEnabled) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        action();
    };

    const handleNewGame = () => {
        if (hasProgress) {
            setConfirmNewGame(true);
        } else {
            restart();
            router.push('/game');
        }
    };

    const handleConfirmNewGame = () => {
        setConfirmNewGame(false);
        restart();
        router.push('/game');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
            <View style={styles.container}>
                {/* Brand Header */}
                <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                    <View style={styles.brandRow}>
                        <View style={[styles.logoIcon, { backgroundColor: theme.accentSoft }]}>
                            <Ionicons name="infinite" size={30} color={theme.accent} />
                        </View>
                        <View>
                            <Text style={[styles.brandTitle, { color: theme.text }]}>INFINITY</Text>
                            <Text style={[styles.brandSubtitle, { color: theme.textMuted }]}>Endless 2048</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Hero Showcase Grid */}
                <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.heroSection}>
                    <View style={[styles.showcaseBoard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.showcaseRow}>
                            <ShowcaseTile value="128" color="#9B59B6" />
                            <ShowcaseTile value="512" color="#4C6FD7" />
                        </View>
                        <View style={styles.showcaseRow}>
                            <ShowcaseTile value="1024" color="#277DA1" />
                            <ShowcaseTile value="2048" color="#7C3AED" isGlow />
                        </View>
                    </View>
                </Animated.View>

                {/* Score & Best HUD */}
                <Animated.View entering={FadeInDown.delay(180).duration(450)} style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.statCardHeader}>
                            <Ionicons name="trophy-outline" size={17} color="#F59E0B" />
                            <Text style={[styles.statCardLabel, { color: theme.textMuted }]}>BEST</Text>
                        </View>
                        <Text style={[styles.statCardValue, { color: theme.text }]}>
                            {game.bestScore.toLocaleString()}
                        </Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.statCardHeader}>
                            <Ionicons name="ribbon-outline" size={17} color={theme.accent} />
                            <Text style={[styles.statCardLabel, { color: theme.textMuted }]}>MAX TILE</Text>
                        </View>
                        <View style={styles.maxTileBadge}>
                            <Text style={styles.maxTileText}>
                                {game.maxTile > 0 ? game.maxTile : '—'}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Active Session Status (if progress exists) */}
                {hasProgress && (
                    <Animated.View
                        entering={FadeIn.delay(240).duration(350)}
                        style={[styles.resumeBanner, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}
                    >
                        <View style={styles.resumeInfo}>
                            <View style={styles.pulseDot} />
                            <Text style={[styles.resumeText, { color: theme.text }]}>Current Run</Text>
                        </View>
                        <Text style={[styles.resumeScore, { color: theme.accent }]}>
                            {game.score.toLocaleString()} pts
                        </Text>
                    </Animated.View>
                )}

                {/* Action Buttons */}
                <Animated.View entering={FadeInUp.delay(280).duration(450)} style={styles.actions}>
                    {hasProgress ? (
                        <>
                            <Pressable
                                accessibilityRole="button"
                                style={({ pressed }) => [
                                    styles.primaryBtn,
                                    { backgroundColor: theme.accent },
                                    pressed && styles.btnPressed,
                                ]}
                                onPress={() => handlePress(() => router.push('/game'))}
                            >
                                <Ionicons name="play" size={20} color="#FFFFFF" style={styles.btnIcon} />
                                <Text style={styles.primaryBtnText}>Continue Game</Text>
                            </Pressable>

                            <Pressable
                                accessibilityRole="button"
                                style={({ pressed }) => [
                                    styles.secondaryBtn,
                                    { backgroundColor: theme.surface, borderColor: theme.border },
                                    pressed && styles.btnPressed,
                                ]}
                                onPress={() => handlePress(handleNewGame)}
                            >
                                <Ionicons name="refresh" size={18} color={theme.text} style={styles.btnIcon} />
                                <Text style={[styles.secondaryBtnText, { color: theme.text }]}>New Game</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Pressable
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.primaryBtn,
                                { backgroundColor: theme.accent },
                                pressed && styles.btnPressed,
                            ]}
                            onPress={() => handlePress(() => router.push('/game'))}
                        >
                            <Ionicons name="play" size={22} color="#FFFFFF" style={styles.btnIcon} />
                            <Text style={styles.primaryBtnText}>Play Now</Text>
                        </Pressable>
                    )}

                    <View style={styles.utilityRow}>
                        <Pressable
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.utilityBtn,
                                { backgroundColor: theme.surface, borderColor: theme.border },
                                pressed && styles.btnPressed,
                            ]}
                            onPress={() => handlePress(() => setStatsVisible(true))}
                        >
                            <Ionicons name="stats-chart" size={17} color={theme.textMuted} />
                            <Text style={[styles.utilityBtnText, { color: theme.text }]}>Stats</Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.utilityBtn,
                                { backgroundColor: theme.surface, borderColor: theme.border },
                                pressed && styles.btnPressed,
                            ]}
                            onPress={() => handlePress(() => router.push('/settings'))}
                        >
                            <Ionicons name="settings-sharp" size={17} color={theme.textMuted} />
                            <Text style={[styles.utilityBtnText, { color: theme.text }]}>Settings</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>

            {/* Stats & Achievements Modal */}
            <RNModal
                visible={statsVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setStatsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setStatsVisible(false)} />
                    <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>Game Statistics</Text>
                                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                                    {unlockedAchievements.length} of {game.achievements.length} achievements unlocked
                                </Text>
                            </View>
                            <Pressable hitSlop={12} onPress={() => setStatsVisible(false)} style={styles.closeBtn}>
                                <Ionicons name="close" size={22} color={theme.textMuted} />
                            </Pressable>
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            <View style={styles.statGrid}>
                                <View style={[styles.metricCell, { backgroundColor: theme.surfaceSubtle }]}>
                                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>BEST SCORE</Text>
                                    <Text style={[styles.metricVal, { color: theme.text }]}>{game.bestScore.toLocaleString()}</Text>
                                </View>
                                <View style={[styles.metricCell, { backgroundColor: theme.surfaceSubtle }]}>
                                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>MAX TILE</Text>
                                    <Text style={[styles.metricVal, { color: theme.text }]}>{game.maxTile || 0}</Text>
                                </View>
                                <View style={[styles.metricCell, { backgroundColor: theme.surfaceSubtle }]}>
                                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>CURRENT SCORE</Text>
                                    <Text style={[styles.metricVal, { color: theme.text }]}>{game.score.toLocaleString()}</Text>
                                </View>
                                <View style={[styles.metricCell, { backgroundColor: theme.surfaceSubtle }]}>
                                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>TOTAL MOVES</Text>
                                    <Text style={[styles.metricVal, { color: theme.text }]}>{game.moveCount.toLocaleString()}</Text>
                                </View>
                            </View>

                            <Text style={[styles.sectionHeading, { color: theme.text }]}>Achievements</Text>
                            {game.achievements.map((item) => (
                                <View
                                    key={item.id}
                                    style={[
                                        styles.achievementRow,
                                        { borderBottomColor: theme.border },
                                        item.unlocked && { opacity: 1 },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.achievementBadge,
                                            item.unlocked
                                                ? { backgroundColor: theme.accent }
                                                : { backgroundColor: theme.surfaceSubtle },
                                        ]}
                                    >
                                        <Ionicons
                                            name={item.unlocked ? 'checkmark' : 'lock-closed'}
                                            size={14}
                                            color={item.unlocked ? '#FFFFFF' : theme.textMuted}
                                        />
                                    </View>
                                    <View style={styles.achievementTextWrapper}>
                                        <Text style={[styles.achievementTitle, { color: theme.text }]}>
                                            {item.title}
                                        </Text>
                                        <Text style={[styles.achievementDesc, { color: theme.textMuted }]}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </RNModal>

            {/* Confirm New Game Dialog */}
            <RNModal
                visible={confirmNewGame}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmNewGame(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setConfirmNewGame(false)} />
                    <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border, maxWidth: 360 }]}>
                        <Text style={[styles.modalTitle, { color: theme.text, marginBottom: 8 }]}>Start New Game?</Text>
                        <Text style={[styles.modalSubtitle, { color: theme.textMuted, marginBottom: 20 }]}>
                            Starting a new game will reset your current board and score of {game.score.toLocaleString()} points.
                        </Text>
                        <View style={styles.confirmRow}>
                            <Pressable
                                style={[styles.confirmBtn, { backgroundColor: theme.surfaceSubtle }]}
                                onPress={() => setConfirmNewGame(false)}
                            >
                                <Text style={[styles.confirmBtnText, { color: theme.text }]}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.confirmBtn, { backgroundColor: theme.accent }]}
                                onPress={handleConfirmNewGame}
                            >
                                <Text style={[styles.confirmBtnText, { color: '#FFFFFF' }]}>New Game</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </RNModal>
        </SafeAreaView>
    );
}

function ShowcaseTile({ value, color, isGlow }: { value: string; color: string; isGlow?: boolean }) {
    return (
        <View
            style={[
                styles.showcaseTile,
                { backgroundColor: color },
                isGlow && styles.showcaseGlow,
            ]}
        >
            <Text style={styles.showcaseTileText}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        justifyContent: 'space-between',
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    brandTitle: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 2,
    },
    brandSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 1,
    },

    /* Showcase */
    heroSection: {
        alignItems: 'center',
        marginVertical: 12,
    },
    showcaseBoard: {
        width: 200,
        height: 200,
        borderRadius: 24,
        padding: 12,
        borderWidth: 1,
        justifyContent: 'space-between',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
    },
    showcaseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '47%',
    },
    showcaseTile: {
        width: '47%',
        height: '100%',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    showcaseGlow: {
        shadowColor: '#7C3AED',
        shadowOpacity: 0.5,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    showcaseTileText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },

    /* Stats HUD */
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    statCard: {
        flex: 1,
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    statCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    statCardLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
    },
    statCardValue: {
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -1,
    },
    maxTileBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#7C3AED',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 2,
    },
    maxTileText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },

    /* Resume Banner */
    resumeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 8,
    },
    resumeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    resumeText: {
        fontSize: 13,
        fontWeight: '700',
    },
    resumeScore: {
        fontSize: 14,
        fontWeight: '800',
    },

    /* Actions */
    actions: {
        width: '100%',
        gap: 10,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: '#7C3AED',
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 14,
    },
    secondaryBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },
    btnIcon: {
        marginRight: 8,
    },
    btnPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    utilityRow: {
        flexDirection: 'row',
        gap: 10,
    },
    utilityBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 13,
        gap: 6,
    },
    utilityBtnText: {
        fontSize: 14,
        fontWeight: '700',
    },

    /* Modal */
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    modalCard: {
        width: '100%',
        maxWidth: 440,
        maxHeight: '80%',
        borderRadius: 24,
        borderWidth: 1,
        padding: 24,
        elevation: 16,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 12 },
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    modalSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
    },
    modalScroll: {
        flexGrow: 0,
    },
    statGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    metricCell: {
        flexBasis: '48%',
        flexGrow: 1,
        borderRadius: 14,
        padding: 12,
    },
    metricLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 4,
    },
    metricVal: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 12,
        marginTop: 4,
    },
    achievementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    achievementBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    achievementTextWrapper: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    achievementDesc: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 1,
    },
    confirmRow: {
        flexDirection: 'row',
        gap: 12,
    },
    confirmBtn: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },
});
