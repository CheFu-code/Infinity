import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useGameStore } from '../store/gameStore';

export default function HomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const game = useGameStore((state) => state.game);
    const settings = useGameStore((state) => state.settings);

    const [statsVisible, setStatsVisible] = useState(false);

    const resolvedTheme = useMemo(() => {
        if (settings.theme === 'system') {
            return colorScheme ?? 'light';
        }

        return settings.theme;
    }, [colorScheme, settings.theme]);

    const isDark = resolvedTheme === 'dark';

    const hasProgress =
        game.score > 0 ||
        game.board.some((row) => row.some((cell) => cell !== null));

    const unlockedCount = game.achievements.filter(
        (achievement) => achievement.unlocked
    ).length;

    const theme = {
        background: isDark ? '#09090B' : '#F7F7F8',
        surface: isDark ? '#141416' : '#FFFFFF',
        surfaceElevated: isDark ? '#1C1C20' : '#FFFFFF',
        text: isDark ? '#FAFAFA' : '#111113',
        muted: isDark ? '#D1D5DB' : '#71717A',
        subtle: isDark ? '#52525B' : '#A1A1AA',
        border: isDark ? '#27272A' : '#E4E4E7',
        accent: '#7C3AED',
        accentSoft: isDark ? '#24153F' : '#F1EAFE',
    };

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: theme.background }]}
        >
            <View style={styles.container}>
                {/* Header */}
                <Animated.View
                    entering={FadeIn.duration(400)}
                    style={styles.header}
                >
                    <View style={styles.brandMark}>
                        <Ionicons
                            name="infinite"
                            size={28}
                            color={theme.accent}
                        />
                    </View>

                    <View>
                        <Text style={[styles.eyebrow, { color: theme.muted }]}>
                            THE ENDLESS PUZZLE
                        </Text>

                        <Text style={[styles.title, { color: theme.text }]}>
                            Infinity
                        </Text>
                    </View>
                </Animated.View>

                {/* Score */}
                <Animated.View
                    entering={FadeInDown.delay(100).duration(450)}
                    style={[
                        styles.scoreCard,
                        {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.scoreHeader}>
                        <View>
                            <Text style={[styles.scoreCaption, { color: theme.muted }]}>
                                BEST SCORE
                            </Text>

                            <Text style={[styles.scoreValue, { color: theme.text }]}>
                                {game.bestScore.toLocaleString()}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.scoreIcon,
                                { backgroundColor: theme.accentSoft },
                            ]}
                        >
                            <Ionicons
                                name="trophy-outline"
                                size={22}
                                color={theme.accent}
                            />
                        </View>
                    </View>

                    <View style={[styles.scoreDivider, { backgroundColor: theme.border }]} />

                    <View style={styles.scoreFooter}>
                        <Text style={[styles.scoreFooterLabel, { color: theme.muted }]}>
                            Keep going. There is no limit.
                        </Text>

                        <Ionicons
                            name="arrow-up"
                            size={16}
                            color={theme.accent}
                        />
                    </View>
                </Animated.View>

                {/* Main actions */}
                <Animated.View
                    entering={FadeInDown.delay(180).duration(450)}
                    style={styles.actions}
                >
                    <View style={styles.primaryAction}>
                        <Button
                            label="Play"
                            onPress={() => router.push('/game')}
                        />
                    </View>

                    <View style={styles.secondaryActions}>
                        <View style={styles.secondaryAction}>
                            <Button
                                label="Continue"
                                variant="secondary"
                                onPress={() => router.push('/game')}
                                disabled={!hasProgress}
                            />
                        </View>

                        <View style={styles.secondaryAction}>
                            <Button
                                label="Stats"
                                variant="ghost"
                                onPress={() => setStatsVisible(true)}
                            />
                        </View>
                    </View>

                    <View style={styles.settingsAction}>
                        <Button
                            label="Settings"
                            variant="ghost"
                            onPress={() => router.push('/settings')}
                        />
                    </View>
                </Animated.View>

                {/* Footer */}
                <Animated.View
                    entering={FadeIn.delay(450).duration(500)}
                    style={styles.footer}
                >
                    <View
                        style={[
                            styles.footerDot,
                            { backgroundColor: theme.accent },
                        ]}
                    />

                    <Text style={[styles.footerText, { color: theme.muted }]}>
                        Merge. Think. Repeat.
                    </Text>
                </Animated.View>
            </View>

            {/* Stats modal */}
            <Modal
                visible={statsVisible}
                title="Game statistics"
                onClose={() => setStatsVisible(false)}
            >
                <View style={styles.modalContent}>
                    <StatRow
                        label="Current score"
                        value={game.score.toLocaleString()}
                        theme={theme}
                    />

                    <StatRow
                        label="Best score"
                        value={game.bestScore.toLocaleString()}
                        theme={theme}
                    />

                    <StatRow
                        label="Highest tile"
                        value={game.maxTile.toLocaleString()}
                        theme={theme}
                    />

                    <StatRow
                        label="Moves taken"
                        value={game.moveCount.toString()}
                        theme={theme}
                    />

                    <StatRow
                        label="Achievements"
                        value={unlockedCount.toString()}
                        theme={theme}
                    />

                    <StatRow
                        label="Status"
                        value={game.status}
                        theme={theme}
                    />

                    <StatRow
                        label="Sound"
                        value={settings.soundEnabled ? 'On' : 'Off'}
                        theme={theme}
                    />

                    <StatRow
                        label="Theme"
                        value={settings.theme}
                        theme={theme}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function StatRow({
    label,
    value,
    theme,
}: {
    label: string;
    value: string;
    theme: {
        text: string;
        muted: string;
        border: string;
    };
}) {
    const isSurfaceLight = theme && (theme as any).surface === '#FFFFFF';
    const labelColor = isSurfaceLight ? '#0f172a' : theme.muted;
    const valueColor = isSurfaceLight ? '#0f172a' : theme.text;

    return (
        <View
            style={[
                styles.statRow,
                { borderBottomColor: theme.border },
            ]}
        >
            <Text style={[styles.statLabel, { color: labelColor }]}> 
                {label}
            </Text>

            <Text style={[styles.statValue, { color: valueColor }]}> 
                {value}
            </Text>
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
        paddingTop: 20,
        paddingBottom: 18,
        justifyContent: 'center',
    },

    /* Header */

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 34,
    },

    brandMark: {
        width: 52,
        height: 52,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1EAFE',
        marginRight: 14,
    },

    eyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.8,
        marginBottom: 2,
    },

    title: {
        fontSize: 36,
        lineHeight: 40,
        fontWeight: '900',
        letterSpacing: -1.5,
    },

    /* Score */

    scoreCard: {
        borderRadius: 26,
        borderWidth: 1,
        padding: 22,
        marginBottom: 24,

        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 10,
        },

        elevation: 4,
    },

    scoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    scoreCaption: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.4,
        marginBottom: 5,
    },

    scoreValue: {
        fontSize: 42,
        lineHeight: 46,
        fontWeight: '900',
        letterSpacing: -1.5,
    },

    scoreIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scoreDivider: {
        height: 1,
        marginVertical: 18,
    },

    scoreFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    scoreFooterLabel: {
        fontSize: 13,
        fontWeight: '500',
    },

    /* Actions */

    actions: {
        width: '100%',
    },

    primaryAction: {
        width: '100%',
        marginBottom: 12,
    },

    secondaryActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },

    secondaryAction: {
        flex: 1,
    },

    settingsAction: {
        width: '100%',
    },

    /* Footer */

    footer: {
        position: 'absolute',
        bottom: 18,
        left: 24,
        right: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    footerDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginRight: 8,
    },

    footerText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.2,
    },

    /* Modal */

    modalContent: {
        gap: 0,
    },

    statRow: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    statLabel: {
        fontSize: 14,
        fontWeight: '500',
    },

    statValue: {
        fontSize: 14,
        fontWeight: '800',
    },
});