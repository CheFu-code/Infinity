import { StyleSheet, Text, View } from "react-native";
import { Modal } from "./Modal";
import { Button } from "../Button";

type Props = {
    visible: boolean;
    theme: "light" | "dark";
    onResume: () => void;
};

export function PauseModal({ visible, theme, onResume }: Props) {
    const isDark = theme === "dark";

    return (
        <Modal visible={visible} title="Paused" onClose={onResume} theme={theme}>
            <View style={styles.modalContent}>
                <Text
                    style={[
                        styles.modalText,
                        isDark ? styles.darkText : styles.lightText,
                    ]}
                >
                    Take a breather and jump back in when ready.
                </Text>
                <Button label="Resume" onPress={onResume} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: { gap: 12 },
    modalText: { fontSize: 16, lineHeight: 24 },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
});
