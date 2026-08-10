import { useMemo, useState } from "react";
import { StyleSheet, Switch, Text, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { useGameStore } from "../store/gameStore";

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const settings = useGameStore((state) => state.settings);
    const toggleSound = useGameStore((state) => state.toggleSound);
    const toggleVibration = useGameStore((state) => state.toggleVibration);
    const setTheme = useGameStore((state) => state.setTheme);
    const resetProgress = useGameStore((state) => state.resetProgress);
    const [confirmReset, setConfirmReset] = useState(false);

    const resolvedTheme = useMemo(() => {
        if (settings.theme === "system") {
            return colorScheme ?? "light";
        }
        return settings.theme;
    }, [colorScheme, settings.theme]);
    const isDark = resolvedTheme === "dark";

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                isDark ? styles.darkBackground : styles.lightBackground,
            ]}
        >
            <View style={styles.container}>
                <Text
                    style={[styles.title, isDark ? styles.darkText : styles.lightText]}
                >
                    Settings
                </Text>

                <View
                    style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
                >
                    <View style={styles.row}>
                        <Text
                            style={[
                                styles.label,
                                isDark ? styles.darkText : styles.lightText,
                            ]}
                        >
                            Sound effects
                        </Text>
                        <Switch value={settings.soundEnabled} onValueChange={toggleSound} />
                    </View>
                    <View style={styles.row}>
                        <Text
                            style={[
                                styles.label,
                                isDark ? styles.darkText : styles.lightText,
                            ]}
                        >
                            Vibration
                        </Text>
                        <Switch
                            value={settings.vibrationEnabled}
                            onValueChange={toggleVibration}
                        />
                    </View>
                </View>

                <View
                    style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
                >
                    <Text
                        style={[styles.label, isDark ? styles.darkText : styles.lightText]}
                    >
                        Theme
                    </Text>
                    <View style={styles.pillRow}>
                        {(["light", "dark", "system"] as const).map((theme) => (
                            <Button
                                key={theme}
                                label={theme}
                                variant={settings.theme === theme ? "primary" : "secondary"}
                                onPress={() => setTheme(theme)}
                            />
                        ))}
                    </View>
                </View>

                <Button
                    label="Reset progress"
                    variant="secondary"
                    onPress={() => setConfirmReset(true)}
                />
            </View>

            <Modal
                visible={confirmReset}
                title="Reset progress"
                onClose={() => setConfirmReset(false)}
            >
                <View style={styles.modalContent}>
                    <Text
                        style={[
                            styles.modalText,
                            isDark ? styles.darkText : styles.lightText,
                        ]}
                    >
                        This will clear your current save and start over.
                    </Text>
                    <Button
                        label="Confirm reset"
                        onPress={() => {
                            void resetProgress();
                            setConfirmReset(false);
                        }}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    lightBackground: { backgroundColor: "#f8fafc" },
    darkBackground: { backgroundColor: "#111827" },
    container: { flex: 1, padding: 20, gap: 20 },
    title: { fontSize: 28, fontWeight: "700" },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
    card: { borderRadius: 24, padding: 16, gap: 16 },
    lightCard: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    darkCard: {
        backgroundColor: "#1f2937",
        borderWidth: 1,
        borderColor: "#374151",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: { fontSize: 16, fontWeight: "600" },
    pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    modalContent: { gap: 12 },
    modalText: { fontSize: 16 },
});
