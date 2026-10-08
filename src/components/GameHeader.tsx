import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
    isDark: boolean;
};

export function GameHeader({ isDark }: Props) {
    return (
        <Animated.View entering={FadeInDown.duration(240)} style={styles.header}>
            <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
                Infinity
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: 28, fontWeight: "700" },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
});
