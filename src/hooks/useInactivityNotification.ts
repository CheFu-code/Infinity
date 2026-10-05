import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { scheduleInactivityNotification } from "@/utils/notifications";

export function useInactivityNotification(bestScore: number) {
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        // Schedule initial 48h notification on app load
        if (bestScore > 0) {
            void scheduleInactivityNotification(bestScore);
        }

        // Reset 48h notification whenever player backgrounds the app
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState: AppStateStatus) => {
                if (
                    appState.current === "active" &&
                    nextAppState.match(/inactive|background/)
                ) {
                    void scheduleInactivityNotification(bestScore);
                }
                appState.current = nextAppState;
            }
        );

        return () => {
            subscription.remove();
        };
    }, [bestScore]);
}