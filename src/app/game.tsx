import { useMemo, useState } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { ScoreBoard } from "../components/ScoreBoard";
import { useGame } from "../hooks/useGame";

export default function GameScreen() {
    const colorScheme = useColorScheme();
    const { game, settings, isHydrated, move, undo, restart, continueAfterWin } =
        useGame();
    const [paused, setPaused] = useState(false);

    const resolvedTheme = useMemo(() => {
        if (settings.theme === "system") {
            return colorScheme ?? "light";
        }
        return settings.theme;
    }, [colorScheme, settings.theme]);
    const isDark = resolvedTheme === "dark";

    if (!isHydrated) {
        return (
            <SafeAreaView
                style={[
                    styles.safeArea,
                    isDark ? styles.darkBackground : styles.lightBackground,
                ]}
            >
                <View style={styles.loading}>
                    <Text
                        style={[
                            styles.loadingText,
                            isDark ? styles.darkText : styles.lightText,
                        ]}
                    >
                        Loading game…
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                isDark ? styles.darkBackground : styles.lightBackground,
            ]}
        >
            <View style={styles.container}>
                <Animated.View entering={FadeInDown.duration(240)} style={styles.header}>
                    <Text
                        style={[styles.title, isDark ? styles.darkText : styles.lightText]}
                    >
                        Infinity
                    </Text>
                    {/**TODO: Add login functionality to save users history even when logged in on new device */}
                    {/* <Button label="Login" onPress={restart} /> */}
                </Animated.View>

                <ScoreBoard
                    score={game.score}
                    bestScore={game.bestScore}
                    moveCount={game.moveCount}
                    maxTile={game.maxTile}
                />

                <Animated.View
                    entering={FadeInDown.delay(80).duration(260)}
                    style={[
                        styles.boardCard,
                        isDark ? { backgroundColor: '#111827' } : { backgroundColor: '#ffffff' },
                    ]}
                >
                    <Board onSwipe={move} />
                </Animated.View>

                <View style={styles.actions}>
                    <Button label="Restart" onPress={restart} />
                    <Button
                        label="Undo"
                        variant="secondary"
                        onPress={undo}
                        disabled={game.history.length === 0}
                    />
                </View>

                {game.achievements.filter((achievement) => achievement.unlocked).length > 0 ? (
                    <Animated.View entering={FadeInDown.delay(120).duration(240)} style={styles.achievements}>
                        <Text style={[styles.achievementTitle, isDark ? styles.darkText : styles.lightText]}>
                            Achievements
                        </Text>
                        {game.achievements.filter((achievement) => achievement.unlocked).slice(0, 3).map((achievement) => (
                            <Text key={achievement.id} style={[styles.achievementText, isDark ? styles.mutedDarkText : styles.mutedLightText]}>
                                • {achievement.title}
                            </Text>
                        ))}
                    </Animated.View>
                ) : null}

                {game.status === "won" && !game.keepPlaying ? (
                    <Modal visible title="Victory" onClose={() => undefined} dismissible={false} theme={resolvedTheme}>
                        <View style={styles.modalContent}>
                            <Text
                                style={[
                                    styles.modalText,
                                    isDark ? styles.darkText : styles.lightText,
                                ]}
                            >
                                You reached 2048! Keep playing to chase a higher tile.
                            </Text>
                            <View style={styles.modalActions}>
                                <Button label="Keep playing" onPress={continueAfterWin} />
                                <Button label="Restart" variant="secondary" onPress={restart} />
                            </View>
                        </View>
                    </Modal>
                ) : null}

                {game.status === "over" ? (
                    <Modal visible title="Game Over" onClose={() => undefined} dismissible={false} theme={resolvedTheme}>
                        <View style={styles.gameOverContent}>
                            <View
                                style={[
                                    styles.gameOverIcon,
                                    isDark ? styles.gameOverIconDark : styles.gameOverIconLight,
                                ]}
                            >
                                <Ionicons name="refresh-outline" size={30} color="#7c3aed" />
                            </View>
                            <Text
                                style={[
                                    styles.gameOverText,
                                    isDark ? styles.darkText : styles.lightText,
                                ]}
                            >
                                No moves left. Your best tile was {game.maxTile}.
                            </Text>
                            <View
                                style={[
                                    styles.gameOverSummary,
                                    isDark ? styles.gameOverSummaryDark : styles.gameOverSummaryLight,
                                ]}
                            >
                                <View style={styles.gameOverMetric}>
                                    <Text style={[styles.gameOverMetricLabel, isDark ? styles.mutedDarkText : styles.mutedLightText]}>
                                        FINAL SCORE
                                    </Text>
                                    <Text style={[styles.gameOverMetricValue, isDark ? styles.darkText : styles.lightText]}>
                                        {game.score.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={[styles.gameOverDivider, isDark ? styles.gameOverDividerDark : styles.gameOverDividerLight]} />
                                <View style={styles.gameOverMetric}>
                                    <Text style={[styles.gameOverMetricLabel, isDark ? styles.mutedDarkText : styles.mutedLightText]}>
                                        BEST TILE
                                    </Text>
                                    <Text style={[styles.gameOverMetricValue, isDark ? styles.darkText : styles.lightText]}>
                                        {game.maxTile.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.gameOverAction}>
                                <Button label="Play again" onPress={restart} />
                            </View>
                        </View>
                    </Modal>
                ) : null}
            </View>

            <Modal visible={paused} title="Paused" onClose={() => setPaused(false)} theme={resolvedTheme}>
                <View style={styles.modalContent}>
                    <Text
                        style={[
                            styles.modalText,
                            isDark ? styles.darkText : styles.lightText,
                        ]}
                    >
                        Take a breather and jump back in when ready.
                    </Text>
                    <Button label="Resume" onPress={() => setPaused(false)} />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    lightBackground: { backgroundColor: "#f8fafc" },
    darkBackground: { backgroundColor: "#111827" },
    container: { flex: 1, padding: 20, gap: 16 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: 28, fontWeight: "700" },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
    mutedLightText: { color: "#64748b" },
    mutedDarkText: { color: "#94a3b8" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { fontSize: 18 },
    actions: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
    boardCard: {
        borderRadius: 24,
        overflow: "hidden",
        padding: 6,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    achievements: { borderRadius: 18, padding: 12, backgroundColor: "#11182711" },
    achievementTitle: { fontSize: 16, fontWeight: "700" },
    achievementText: { fontSize: 13, marginTop: 4 },
    banner: {
        borderRadius: 20,
        padding: 16,
        backgroundColor: "#7c3aed22",
        gap: 12,
        alignItems: "center",
    },
    bannerText: { fontSize: 16, fontWeight: "600", color: "#7c3aed" },
    modalContent: { gap: 12 },
    modalActions: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
    modalText: { fontSize: 16, lineHeight: 24 },
    gameOverContent: { alignItems: "center", gap: 18 },
    gameOverIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
    gameOverIconLight: { backgroundColor: "#f1eafe" },
    gameOverIconDark: { backgroundColor: "#2e1a4d" },
    gameOverText: { fontSize: 16, lineHeight: 24, textAlign: "center" },
    gameOverSummary: { width: "100%", flexDirection: "row", borderRadius: 16, padding: 16, borderWidth: 1 },
    gameOverSummaryLight: { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
    gameOverSummaryDark: { backgroundColor: "#111827", borderColor: "#334155" },
    gameOverMetric: { flex: 1, alignItems: "center", gap: 4 },
    gameOverMetricLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
    gameOverMetricValue: { fontSize: 22, fontWeight: "800" },
    gameOverDivider: { width: StyleSheet.hairlineWidth, alignSelf: "stretch", marginHorizontal: 8 },
    gameOverDividerLight: { backgroundColor: "#e2e8f0" },
    gameOverDividerDark: { backgroundColor: "#334155" },
    gameOverAction: { width: "100%" },
});
