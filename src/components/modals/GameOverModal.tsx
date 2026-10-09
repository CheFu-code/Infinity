import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../Button";
import { Modal } from "./Modal";

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
                        <View
                            style={[
                                styles.rewardCard,
                                isDark ? styles.rewardCardDark : styles.rewardCardLight,
                            ]}
                        >
                            <View style={styles.rewardHeader}>
                                <View style={styles.rewardBadge}>
                                    <Ionicons name="play" size={14} color="#ffffff" />
                                </View>
                                <View style={styles.rewardCopy}>
                                    <Text style={[styles.rewardTitle, isDark ? styles.darkText : styles.lightText]}>
                                        Save this run
                                    </Text>
                                    <Text style={[styles.rewardText, isDark ? styles.mutedDarkText : styles.mutedLightText]}>
                                        Watch a quick video for one more chance.
                                    </Text>
                                </View>
                            </View>
                            <Button label="Continue" onPress={onWatchAd} />
                        </View>
                    ) : null}
                    <View style={styles.secondaryActions}>
                        <View style={canWatchAd ? styles.secondaryAction : styles.secondaryActionFull}>
                            <Button label="Restart" onPress={onRestart} variant="secondary" />
                        </View>
                        {canWatchAd ? (
                            <View style={styles.secondaryAction}>
                                <Button label="No thanks" onPress={onNoThanks} variant="ghost" themeMode={isDark ? "dark" : "light"} />
                            </View>
                        ) : null}
                    </View>
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
    gameOverAction: { width: "100%", gap: 12 },
    rewardCard: { width: "100%", borderRadius: 16, padding: 14, gap: 12, borderWidth: 1 },
    rewardCardLight: { backgroundColor: "#faf5ff", borderColor: "#ddd6fe" },
    rewardCardDark: { backgroundColor: "#211538", borderColor: "#5b3b88" },
    rewardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
    rewardBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#7c3aed",
        alignItems: "center",
        justifyContent: "center",
    },
    rewardCopy: { flex: 1, gap: 2 },
    rewardTitle: { fontSize: 15, fontWeight: "800" },
    rewardText: { fontSize: 12, lineHeight: 17 },
    secondaryActions: { flexDirection: "row", gap: 10 },
    secondaryAction: { flex: 1 },
    secondaryActionFull: { width: "100%" },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
    mutedLightText: { color: "#64748b" },
    mutedDarkText: { color: "#94a3b8" },
});
