import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true, // Displays banner at the top of the screen
        shouldShowList: true, // Displays notification in the notification center
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * Requests push notification permissions and configures Android notification channels.
 */
export async function registerForNotificationsAsync(): Promise<boolean> {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("game-reminders", {
            name: "Game Reminders",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#6366f1",
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === "granted";
}

/**
 * Cancels existing inactivity reminders and schedules a new one for 24 hours later.
 */
export async function scheduleInactivityNotification(
    bestScore: number,
): Promise<void> {
    try {
        const hasPermission = await registerForNotificationsAsync();
        if (!hasPermission) return;

        // Clear existing scheduled notifications so timer resets on every open/background event
        await Notifications.cancelAllScheduledNotificationsAsync();

        const formattedScore = (bestScore ?? 0).toLocaleString();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Your active game is waiting! 🎮",
                body: `Can you beat your high score of ${formattedScore}?`,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 24 * 60 * 60,
                repeats: false,
                channelId: "game-reminders",
            },
        });
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                context: "Failed to schedule inactivity notification",
            },
        });
    }
}