import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
    isDark: boolean;
    session: any;
    authBusy: boolean;
    isChecking: boolean;
    onLogin: () => void;
    onOpenProfile: () => void;
};

export function GameHeader({
    isDark,
    session,
    authBusy,
    isChecking,
    onLogin,
    onOpenProfile,
}: Props) {
    return (
        <Animated.View entering={FadeInDown.duration(240)} style={styles.header}>
            <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
                Infinity
            </Text>

            {/* Uncomment when you want to show login/profile */}
            {/* {session ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={onOpenProfile}
          style={({ pressed }) => [styles.profileTrigger, pressed && styles.profilePressed]}
        >
          {session.user.photoURL ? (
            <Image source={{ uri: session.user.photoURL }} style={styles.profileAvatar} />
          ) : (
            <Text style={styles.profileInitials}>
              {getInitials(session.user.displayName, session.user.email)}
            </Text>
          )}
          <Ionicons name="chevron-down" size={16} color={isDark ? "#f8fafc" : "#334155"} />
        </Pressable>
      ) : (
        <Button
          label={authBusy || isChecking ? "Loading..." : "Login"}
          onPress={onLogin}
          disabled={authBusy || isChecking}
        />
      )} */}
        </Animated.View>
    );
}

function getInitials(displayName: string | undefined, email: string) {
    const source = displayName?.trim() || email;
    const parts = source.split(/[\s._-]+/).filter(Boolean);
    return (
        parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)
    ).toUpperCase();
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: 28, fontWeight: "700" },
    profileTrigger: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 4,
        borderRadius: 999,
    },
    profilePressed: { opacity: 0.7 },
    profileAvatar: { width: 38, height: 38, borderRadius: 19 },
    profileInitials: {
        width: 38,
        height: 38,
        borderRadius: 19,
        textAlign: "center",
        textAlignVertical: "center",
        backgroundColor: "#7c3aed",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "800",
        overflow: "hidden",
        paddingTop: 10,
    },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
});
