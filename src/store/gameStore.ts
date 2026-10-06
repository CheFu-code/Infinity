import * as Haptics from 'expo-haptics';
import { create } from 'zustand';
import { clearProgress, createDefaultSettings, createInitialGameState, keepPlaying, loadState, makeMove, restartGame, restoreSnapshot, saveState, undoMove } from '../game/engine';
import { Direction, GameSettings, GameSnapshot, GameState } from '../game/types';
import { playMergeSound, playWinSound } from '../utils/audio';
import { fetchInfinityState, saveInfinityState } from '../lib/infinityAuth';

export const MAX_REWARDED_UNDOS_PER_RUN = 1;
export const MIN_REWARDED_UNDO_SCORE = 100;

interface GameStore {
    game: GameState;
    settings: GameSettings;
    isHydrated: boolean;
    rewardedUndoUses: number;
    preLossSnapshot?: GameSnapshot;
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
    useRewardedUndo: () => void;
    syncRemote: (accessToken: string) => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
    game: createInitialGameState(),
    settings: createDefaultSettings(),
    isHydrated: false,
    rewardedUndoUses: 0,
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
        const preLossSnapshot =
            updatedGame.status === 'over' &&
            previousGame.status === 'playing' &&
            previousGame.score >= MIN_REWARDED_UNDO_SCORE &&
            get().rewardedUndoUses < MAX_REWARDED_UNDOS_PER_RUN
                ? updatedGame.history[0]
                : get().preLossSnapshot;
        set({ game: updatedGame, preLossSnapshot });

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
        set({ game: next });

        void saveState(next, get().settings);
        if (get().accessToken) void saveInfinityState(get().accessToken!, { game: next, settings: get().settings });
    },
    restart: () => {
        const next = restartGame(get().game);
        set({ game: next, rewardedUndoUses: 0, preLossSnapshot: undefined });
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
        set({ game: initial, rewardedUndoUses: 0, preLossSnapshot: undefined });
    },
    useRewardedUndo: () => {
        const { game, preLossSnapshot, rewardedUndoUses } = get();
        if (!preLossSnapshot || rewardedUndoUses >= MAX_REWARDED_UNDOS_PER_RUN) {
            return;
        }

        const next = restoreSnapshot(game, preLossSnapshot);
        set({
            game: next,
            rewardedUndoUses: rewardedUndoUses + 1,
            preLossSnapshot: undefined,
        });
        void saveState(next, get().settings);
        if (get().accessToken) void saveInfinityState(get().accessToken!, { game: next, settings: get().settings });
    },
}));
