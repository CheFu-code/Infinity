import { GameState } from "@/game/types";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AchievementsList } from "../AchievementsList";

const AchievementsModal = ({
    achievementsVisible,
    setAchievementsVisible,
    game,
    isDark,
}: {
    achievementsVisible: boolean;
    setAchievementsVisible: (visible: boolean) => void;
    game: GameState;
    isDark: boolean;
}) => {
    return (
        <Modal
            visible={achievementsVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setAchievementsVisible(false)}
        >
            <Pressable
                style={styles.modalOverlay}
                onPress={() => setAchievementsVisible(false)}
            >
                <Pressable
                    style={[
                        styles.modalCard,
                        isDark ? styles.modalDark : styles.modalLight,
                    ]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.modalHeader}>
                        <View style={styles.modalTitleRow}>
                            <Ionicons
                                name="trophy"
                                size={22}
                                color={isDark ? "#f59e0b" : "#d97706"}
                            />
                            <Text
                                style={[
                                    styles.modalTitle,
                                    isDark ? styles.darkText : styles.lightText,
                                ]}
                            >
                                Achievements
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setAchievementsVisible(false)}>
                            <Ionicons
                                name="close"
                                size={22}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                        </TouchableOpacity>
                    </View>

                    <AchievementsList achievements={game.achievements} isDark={isDark} />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default AchievementsModal;


const styles = StyleSheet.create({
   modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalCard: {
        width: "100%",
        maxHeight: "80%",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    modalDark: { backgroundColor: "#1f2937" },
    modalLight: { backgroundColor: "#ffffff" },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
    },
    darkText: {
        color: "#f8fafc",
    },
    lightText: {
        color: "#1e293b",
    },
});