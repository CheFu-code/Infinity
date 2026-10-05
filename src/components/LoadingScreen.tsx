import {
    ActivityIndicator,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEMES = {
    light: { background: "#f8fafc", spinner: "#7c3aed", text: "#0f172a" },
    dark: { background: "#111827", spinner: "#f8fafc", text: "#f8fafc" },
} as const;

interface LoadingScreenProps {
    /** Force a theme. When omitted, follows the device color scheme. */
    isDark?: boolean;
    /** Text under the spinner. Pass an empty string to show only the spinner. */
    message?: string;
    testID?: string;
}

export function LoadingScreen({
    isDark,
    message = "Loading game…",
    testID,
}: LoadingScreenProps) {
    const systemScheme = useColorScheme();
    const dark = isDark ?? systemScheme === "dark";
    const theme = dark ? THEMES.dark : THEMES.light;

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
            testID={testID}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={message || "Loading"}
            accessibilityState={{ busy: true }}
            accessibilityLiveRegion="polite"
        >
            <View style={styles.content}>
                <ActivityIndicator size="large" color={theme.spinner} />
                {message ? (
                    <Text style={[styles.text, { color: theme.text }]}>
                        {message}
                    </Text>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});