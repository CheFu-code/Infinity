import * as Haptics from 'expo-haptics';
import { create } from 'zustand';
import { clearProgress, createDefaultSettings, createInitialGameState, keepPlaying, loadState, makeMove, restartGame, saveState, undoMove } from '../game/engine';
import { Direction, GameSettings, GameState } from '../game/types';
import { playMergeSound, playWinSound } from '../utils/audio';
import { fetchInfinityState, saveInfinityState } from '../lib/infinityAuth';

interface GameStore {
    game: GameState;
    settings: GameSettings;
    isHydrated: boolean;
    undoPressCount: number;
    showRewardedAd: boolean;
    accessToken?: string;
    initialize: () => Promise<void>;
    move: (direction: Direction) => void;
    undo: () => void;
    restart: () => void;
    continueAfterWin: () => void;
    toggleSound: () => void;
    toggleVibration: () => void;
    setTheme: (theme: GameSettings['theme']) => void;
    resetProgress: () => Promise<void>;
    resetUndoCount: () => void;
    dismissRewardedAd: () => void;
    syncRemote: (accessToken: string) => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
    game: createInitialGameState(),
    settings: createDefaultSettings(),
    isHydrated: false,
    undoPressCount: 0,
    showRewardedAd: false,
    accessToken: undefined as string | undefined,
    initialize: async () => {
        const persisted = await loadState();
        if (persisted) {
            set({ game: persisted.game, settings: persisted.settings, isHydrated: true });
            return;
        }

        set({ isHydrated: true });
    },
    syncRemote: async (accessToken) => {
        const remote = await fetchInfinityState(accessToken);
        const local = { game: get().game, settings: get().settings };
        set({ accessToken });
        if (remote) {
            set({ game: remote.game, settings: remote.settings });
            await saveState(remote.game, remote.settings);
        } else {
            await saveInfinityState(accessToken, local);
        }
    },
    move: (direction) => {
        const previousGame = get().game;
        const settings = get().settings;
        const next = makeMove(previousGame, direction);
        const updatedGame = next !== previousGame ? next : previousGame;
        set({ game: updatedGame, undoPressCount: 0 }); // Reset undo count on move

        if (updatedGame.score > previousGame.score && settings.soundEnabled) {
            void playMergeSound();
        }

        if (updatedGame.won && !previousGame.won && settings.soundEnabled) {
            void playWinSound();
        }

        if (updatedGame !== previousGame && settings.vibrationEnabled) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        void saveState(updatedGame, settings);
        if (get().accessToken) void saveInfinityState(get().accessToken!, { game: updatedGame, settings });
    },
    undo: () => {
        const next = undoMove(get().game);
        const newUndoCount = get().undoPressCount + 1;
        
        set({ game: next, undoPressCount: newUndoCount });
        
        // Show rewarded ad after 3 undo presses
        if (newUndoCount > 3 && !get().showRewardedAd) {
            set({ showRewardedAd: true });
        }
        
        void saveState(next, get().settings);
        if (get().accessToken) void saveInfinityState(get().accessToken!, { game: next, settings: get().settings });
    },
    restart: () => {
        const next = restartGame(get().game);
        set({ game: next, undoPressCount: 0 }); // Reset undo count on restart
        void saveState(next, get().settings);
        if (get().accessToken) void saveInfinityState(get().accessToken!, { game: next, settings: get().settings });
    },
    continueAfterWin: () => {
        const next = keepPlaying(get().game);
        set({ game: next });
        void saveState(next, get().settings);
        if (get().accessToken) void saveInfinityState(get().accessToken!, { game: next, settings: get().settings });
    },
    toggleSound: () => {
        const settings = { ...get().settings, soundEnabled: !get().settings.soundEnabled };
        set({ settings });
        void saveState(get().game, settings);
    },
    toggleVibration: () => {
        const settings = { ...get().settings, vibrationEnabled: !get().settings.vibrationEnabled };
        set({ settings });
        void saveState(get().game, settings);
    },
    setTheme: (theme) => {
        const settings = { ...get().settings, theme };
        set({ settings });
        void saveState(get().game, settings);
    },
    resetProgress: async () => {
        await clearProgress();
        const initial = createInitialGameState();
        set({ game: initial, undoPressCount: 0 });
    },
    resetUndoCount: () => {
        set({ undoPressCount: 0 });
    },
    dismissRewardedAd: () => {
        set({ showRewardedAd: false });
    },
}));
