import { StyleSheet, Text, View } from "react-native";
import { Button } from "../Button";
import { Modal } from "./Modal";

type Props = {
    visible: boolean;
    theme: "light" | "dark";
    onContinue: () => void;
    onRestart: () => void;
};

export function VictoryModal({ visible, theme, onContinue, onRestart }: Props) {
    const isDark = theme === "dark";

    return (
        <Modal
            visible={visible}
            title="Victory"
            onClose={() => undefined}
            dismissible={false}
            theme={theme}
        >
            <View style={styles.modalContent}>
                <Text
                    style={[
                        styles.modalText,
                        isDark ? styles.darkText : styles.lightText,
                    ]}
                >
                    Congratulations! You reached 2048! Keep playing to chase a higher
                    tile.
                </Text>
                <View style={styles.modalActions}>
                    <Button label="Keep playing" onPress={onContinue} />
                    <Button label="Restart" variant="secondary" onPress={onRestart} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: { gap: 12 },
    modalActions: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
    },
    modalText: { fontSize: 16, lineHeight: 24 },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
});
