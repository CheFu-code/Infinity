import { LoadingScreen } from "@/components/LoadingScreen";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import mobileAds from "react-native-google-mobile-ads";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useInAppUpdates } from "../hooks/useInAppUpdates";
import { useGameStore } from "../store/gameStore";

Sentry.init({
  dsn: "https://357385c5b58bd4ce40006d7e7f82bffb@o4512011915296768.ingest.de.sentry.io/4512200301609040",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),
    Sentry.feedbackIntegration(),
  ],
});

function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useGameStore((state) => state.settings.theme);
  const isHydrated = useGameStore((state) => state.isHydrated);
  const initialize = useGameStore((state) => state.initialize);

  const { snackbarVisible, installUpdate } = useInAppUpdates();

  const resolvedTheme = useMemo(() => {
    if (theme === "system") {
      return colorScheme ?? "light";
    }
    return theme;
  }, [colorScheme, theme]);

  useEffect(() => {
    if (!isHydrated) {
      void initialize();
    }
  }, [initialize, isHydrated]);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log("AdMob initialized");
      });
  }, []);

  if (!isHydrated) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
          <LoadingScreen isDark={resolvedTheme === "dark"} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: resolvedTheme === "dark" ? "#111827" : "#f8fafc",
            },
          }}
        />

        {snackbarVisible && (
          <View style={styles.snackbarContainer}>
            <View
              style={[
                styles.snackbar,
                resolvedTheme === "dark"
                  ? styles.snackbarDark
                  : styles.snackbarLight,
              ]}
            >
              <Text
                style={[
                  styles.snackbarText,
                  resolvedTheme === "dark" ? styles.darkText : styles.lightText,
                ]}
              >
                Update downloaded! Restart to apply.
              </Text>
              <Pressable onPress={installUpdate} style={styles.snackbarButton}>
                <Text style={styles.snackbarButtonText}>Restart</Text>
              </Pressable>
            </View>
          </View>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
  },
  lightText: {
    color: "#0f172a",
  },
  darkText: {
    color: "#f8fafc",
  },
  snackbarContainer: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
  },
  snackbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  snackbarLight: {
    backgroundColor: "#1e293b",
  },
  snackbarDark: {
    backgroundColor: "#334155",
  },
  snackbarText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    marginRight: 12,
  },
  snackbarButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  snackbarButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Sentry.wrap(RootLayout);
