import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Achievement = {
    id: string;
    title: string;
    unlocked: boolean;
};

type Props = {
    achievements: Achievement[];
    isDark: boolean;
};

export function AchievementsList({ achievements, isDark }: Props) {
    const unlocked = achievements.filter((a) => a.unlocked).slice(0, 3);

    if (unlocked.length === 0) return null;

    return (
        <Animated.View
            entering={FadeInDown.delay(120).duration(240)}
            style={styles.achievements}
        >
            <Text
                style={[
                    styles.achievementTitle,
                    isDark ? styles.darkText : styles.lightText,
                ]}
            >
                Achievements
            </Text>
            {unlocked.map((achievement) => (
                <Text
                    key={achievement.id}
                    style={[
                        styles.achievementText,
                        isDark ? styles.mutedDarkText : styles.mutedLightText,
                    ]}
                >
                    • {achievement.title}
                </Text>
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    achievements: {
        borderRadius: 18,
        padding: 12,
        backgroundColor: "#11182711",
    },
    achievementTitle: { fontSize: 16, fontWeight: "700" },
    achievementText: { fontSize: 13, marginTop: 4 },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
    mutedLightText: { color: "#64748b" },
    mutedDarkText: { color: "#94a3b8" },
});
