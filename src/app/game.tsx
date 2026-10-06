import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from "@/hooks/useGame";
import { useInfinityAuth } from "@/hooks/useInfinityAuth";
import { useGameStore } from "@/store/gameStore";

import { Board } from "@/components/Board";
import { GameActions } from "@/components/GameActions";
import { GameHeader } from "@/components/GameHeader";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScoreBoard } from "@/components/ScoreBoard";
import { BannerAdComponent } from "@/components/ads/BannerAdComponent";
import { rewardedAdManager } from "@/components/ads/RewardedAdManager";
import { MAX_REWARDED_UNDOS_PER_RUN } from "@/store/gameStore";
import { LEVELS } from "@/game/levels";
import AchievementsModal from "@/components/modals/AchievementsModal";
import { GameOverModal } from "@/components/modals/GameOverModal";
import { PauseModal } from "@/components/modals/PauseModal";
import { ProfileModal } from "@/components/modals/ProfileModal";
import { VictoryModal } from "@/components/modals/VictoryModal";
import { useInactivityNotification } from "@/hooks/useInactivityNotification";
import * as Sentry from "@sentry/react-native";

export default function GameScreen() {
    const colorScheme = useColorScheme();
    const { game, settings, isHydrated, move, undo, restart, continueAfterWin, rewardedUndoUses, preLossSnapshot } =
        useGame();
    const { session, isChecking, signIn, signOut } = useInfinityAuth();
    useInactivityNotification(game.bestScore);

    const [paused, setPaused] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const [achievementsVisible, setAchievementsVisible] = useState(false);
    const [authBusy, setAuthBusy] = useState(false);
    const [authError, setAuthError] = useState("");
    const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);
    const [rewardedAdShowing, setRewardedAdShowing] = useState(false);

    useEffect(() => {
        const unsubscribe = rewardedAdManager.subscribe(setRewardedAdLoaded);
        rewardedAdManager.preload();
        return unsubscribe;
    }, []);

    const resolvedTheme = useMemo(() => {
        if (settings.theme === "system") {
            return colorScheme === "dark" ? "dark" : "light";
        }
        return settings.theme;
    }, [colorScheme, settings.theme]);

    const isDark = resolvedTheme === "dark";
    const rewardedUndoEligible =
        game.status === "over" &&
        Boolean(preLossSnapshot) &&
        rewardedUndoUses < MAX_REWARDED_UNDOS_PER_RUN;
    const canOfferRewardedUndo =
        rewardedUndoEligible && rewardedAdLoaded && !rewardedAdShowing;

    useEffect(() => {
        if (rewardedUndoEligible) {
            Sentry.captureMessage("Rewarded undo offer shown", "info");
        }
    }, [rewardedUndoEligible]);

    const handleWatchAd = () => {
        if (!canOfferRewardedUndo || rewardedAdShowing) {
            return;
        }
        setRewardedAdShowing(true);
        const shown = rewardedAdManager.show({
            onReward: () => {
                useGameStore.getState().useRewardedUndo();
            },
            onFinished: () => {
                setRewardedAdShowing(false);
            },
        });
        if (!shown) {
            setRewardedAdShowing(false);
        }
    };

    useEffect(() => {
        if (isHydrated && session) {
            void useGameStore
                .getState()
                .syncRemote(session.accessToken)
                .catch(() => undefined);
        }
    }, [isHydrated, session]);

    const handleLogin = async () => {
        setAuthError("");
        setAuthBusy(true);
        try {
            await signIn();
        } catch (error) {
            setAuthError(
                error instanceof Error
                    ? error.message
                    : "Sign in could not be completed.",
            );
        } finally {
            setAuthBusy(false);
        }
    };

    const handleSignOut = async () => {
        setAuthBusy(true);
        await signOut();
        useGameStore.setState({ accessToken: undefined });
        setProfileVisible(false);
        setAuthBusy(false);
    };

    if (!isHydrated) {
        return <LoadingScreen isDark={isDark} />;
    }

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                isDark ? styles.darkBackground : styles.lightBackground,
            ]}
            edges={["top", "left", "right", "bottom"]}
        >
            <View style={styles.mainWrapper}>
                <View style={styles.container}>
                    <GameHeader
                        isDark={isDark}
                        session={session}
                        authBusy={authBusy}
                        isChecking={isChecking}
                        onLogin={handleLogin}
                        onOpenProfile={() => setProfileVisible(true)}
                    />

                    {authError ? <Text style={styles.authError}>{authError}</Text> : null}

                    <ScoreBoard
                        score={game.score}
                        bestScore={game.bestScore}
                        moveCount={game.moveCount}
                        maxTile={game.maxTile}
                    />
                    <Text style={[styles.levelText, isDark ? styles.darkText : styles.lightText]}>
                        {LEVELS[game.level].label} · {game.board.length}×{game.board.length}
                    </Text>

                    <Animated.View
                        entering={FadeInDown.delay(80).duration(260)}
                        style={[
                            styles.boardCard,
                            isDark
                                ? { backgroundColor: "#111827" }
                                : { backgroundColor: "#ffffff" },
                        ]}
                    >
                        <Board onSwipe={move} />
                    </Animated.View>

                    <GameActions
                        onRestart={restart}
                        onUndo={undo}
                        canUndo={game.history.length > 0}
                    />

                    <TouchableOpacity
                        style={[
                            styles.achievementsButton,
                            isDark ? styles.buttonDark : styles.buttonLight,
                        ]}
                        onPress={() => setAchievementsVisible(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.buttonContent}>
                            <Ionicons
                                name="trophy"
                                size={18}
                                color={isDark ? "#f59e0b" : "#d97706"}
                            />
                            <Text
                                style={[
                                    styles.achievementsButtonText,
                                    isDark ? styles.darkText : styles.lightText,
                                ]}
                            >
                                Achievements (
                                {game.achievements.filter((a) => a.unlocked).length}/
                                {game.achievements.length})
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <BannerAdComponent />
            </View>

            <AchievementsModal
                achievementsVisible={achievementsVisible}
                setAchievementsVisible={setAchievementsVisible}
                game={game}
                isDark={isDark}
            />

            <VictoryModal
                visible={game.status === "won" && !game.keepPlaying}
                theme={resolvedTheme}
                onContinue={continueAfterWin}
                onRestart={restart}
            />

            <GameOverModal
                visible={game.status === "over"}
                theme={resolvedTheme}
                score={game.score}
                maxTile={game.maxTile}
                onRestart={restart}
                onNoThanks={() => undefined}
                onWatchAd={handleWatchAd}
                canWatchAd={canOfferRewardedUndo}
                undoUsesRemaining={MAX_REWARDED_UNDOS_PER_RUN - rewardedUndoUses}
            />

            <PauseModal
                visible={paused}
                theme={resolvedTheme}
                onResume={() => setPaused(false)}
            />

            <ProfileModal
                visible={profileVisible}
                theme={resolvedTheme}
                session={session}
                authBusy={authBusy}
                onClose={() => setProfileVisible(false)}
                onSignOut={handleSignOut}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    lightBackground: { backgroundColor: "#f8fafc" },
    darkBackground: { backgroundColor: "#111827" },
    mainWrapper: {
        flex: 1,
        justifyContent: "space-between",
    },
    container: {
        flex: 1,
        padding: 20,
        gap: 16,
        justifyContent: "space-between",
    },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { fontSize: 18 },
    lightText: { color: "#0f172a" },
    darkText: { color: "#f8fafc" },
    levelText: { fontSize: 14, fontWeight: "700", textAlign: "center" },
    boardCard: {
        borderRadius: 24,
        overflow: "hidden",
        padding: 6,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    authError: { color: "#dc2626", fontSize: 13, textAlign: "right" },

    achievementsButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    buttonLight: { backgroundColor: "#e2e8f0" },
    buttonDark: { backgroundColor: "#1f2937" },
    achievementsButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
