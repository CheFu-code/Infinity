import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "./Modal";
import { Button } from "../Button";

type Props = {
    visible: boolean;
    theme: "light" | "dark";
    score: number;
    maxTile: number;
    onRestart: () => void;
    onNoThanks: () => void;
    onWatchAd: () => void;
    canWatchAd: boolean;
    undoUsesRemaining: number;
};

export function GameOverModal({
    visible,
    theme,
    score,
    maxTile,
    onRestart,
    onNoThanks,
    onWatchAd,
    canWatchAd,
    undoUsesRemaining,
}: Props) {
    const isDark = theme === "dark";

    return (
        <Modal
            visible={visible}
            title="Game Over"
            onClose={() => undefined}
            dismissible={false}
            theme={theme}
        >
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
                    No moves left. Your best tile was {maxTile}.
                </Text>

                <View
                    style={[
                        styles.gameOverSummary,
                        isDark ? styles.gameOverSummaryDark : styles.gameOverSummaryLight,
                    ]}
                >
                    <View style={styles.gameOverMetric}>
                        <Text
                            style={[
                                styles.gameOverMetricLabel,
                                isDark ? styles.mutedDarkText : styles.mutedLightText,
                            ]}
                        >
                            FINAL SCORE
                        </Text>
                        <Text
                            style={[
                                styles.gameOverMetricValue,
                                isDark ? styles.darkText : styles.lightText,
                            ]}
                        >
                            {score.toLocaleString()}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.gameOverDivider,
                            isDark ? styles.gameOverDividerDark : styles.gameOverDividerLight,
                        ]}
                    />

                    <View style={styles.gameOverMetric}>
                        <Text
                            style={[
                                styles.gameOverMetricLabel,
                                isDark ? styles.mutedDarkText : styles.mutedLightText,
                            ]}
                        >
                            BEST TILE
                        </Text>
                        <Text
                            style={[
                                styles.gameOverMetricValue,
                                isDark ? styles.darkText : styles.lightText,
                            ]}
                        >
                            {maxTile.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.gameOverAction}>
                    {canWatchAd ? (
                        <>
                            <Text style={[styles.rewardText, isDark ? styles.darkText : styles.lightText]}>
                                Watch a short ad to undo your last move ({undoUsesRemaining} undo left)
                            </Text>
                            <Button label="Watch ad to undo & continue" onPress={onWatchAd} />
                        </>
                    ) : null}
                    <Button label="Restart" onPress={onRestart} variant="secondary" />
                    <Button label="No thanks" onPress={onNoThanks} variant="ghost" themeMode={isDark ? "dark" : "light"} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    gameOverContent: { alignItems: "center", gap: 18 },
    gameOverIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    gameOverIconLight: { backgroundColor: "#f1eafe" },
    gameOverIconDark: { backgroundColor: "#2e1a4d" },
    gameOverText: { fontSize: 16, lineHeight: 24, textAlign: "center" },
    gameOverSummary: {
        width: "100%",
        flexDirection: "row",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    gameOverSummaryLight: { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
    gameOverSummaryDark: { backgroundColor: "#111827", borderColor: "#334155" },
    gameOverMetric: { flex: 1, alignItems: "center", gap: 4 },
    gameOverMetricLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
    gameOverMetricValue: { fontSize: 22, fontWeight: "800" },
    gameOverDivider: {
        width: StyleSheet.hairlineWidth,
        alignSelf: "stretch",
        marginHorizontal: 8,
    },
    gameOverDividerLight: { backgroundColor: "#e2e8f0" },
    gameOverDividerDark: { backgroundColor: "#334155" },
    gameOverAction: { width: "100%", gap: 10 },
    rewardText: { fontSize: 13, lineHeight: 19, textAlign: "center" },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
    mutedLightText: { color: "#64748b" },
    mutedDarkText: { color: "#94a3b8" },
});
