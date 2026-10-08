import * as Haptics from 'expo-haptics';
import { create } from 'zustand';
import { clearProgress, createDefaultSettings, createInitialGameState, keepPlaying, loadState, makeMove, restartGame, restoreSnapshot, saveState, undoMove } from '../game/engine';
import { Direction, GameSettings, GameSnapshot, GameState } from '../game/types';
import { APP_INACTIVITY_DEMOTION_MS, getNextLevel, getPreviousLevel, LEVELS } from '../game/levels';
import { playMergeSound, playWinSound } from '../utils/audio';

export const MAX_REWARDED_UNDOS_PER_RUN = 1;
export const MIN_REWARDED_UNDO_SCORE = 100;

interface GameStore {
    game: GameState;
    settings: GameSettings;
    isHydrated: boolean;
    rewardedUndoUses: number;
    preLossSnapshot?: GameSnapshot;
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
}

export const useGameStore = create<GameStore>((set, get) => ({
    game: createInitialGameState(),
    settings: createDefaultSettings(),
    isHydrated: false,
    rewardedUndoUses: 0,
    initialize: async () => {
        const persisted = await loadState();
        if (persisted) {
            const now = Date.now();
            const shouldDemote = now - persisted.game.lastOpenedAt >= APP_INACTIVITY_DEMOTION_MS;
            const level = shouldDemote ? getPreviousLevel(persisted.game.level) : persisted.game.level;
            const game = shouldDemote && level !== persisted.game.level
                ? { ...createInitialGameState(level, now), bestScore: persisted.game.bestScore }
                : { ...persisted.game, lastOpenedAt: now };
            set({ game, settings: persisted.settings, isHydrated: true });
            await saveState(game, persisted.settings);
            return;
        }

        const game = createInitialGameState();
        set({ game, isHydrated: true });
    },
    move: (direction) => {
        const previousGame = get().game;
        const settings = get().settings;
        const next = makeMove(previousGame, direction);
        let updatedGame = next !== previousGame ? next : previousGame;
        const nextLevel = getNextLevel(previousGame.level);
        const levelConfig = LEVELS[previousGame.level];
        const withinPromotionWindow =
            levelConfig.promotionWindowDays === null ||
            Date.now() - previousGame.levelStartedAt <= levelConfig.promotionWindowDays * 24 * 60 * 60 * 1000;
        if (
            updatedGame !== previousGame &&
            nextLevel &&
            levelConfig.promotionTile &&
            updatedGame.maxTile >= levelConfig.promotionTile &&
            withinPromotionWindow
        ) {
            updatedGame = {
                ...createInitialGameState(nextLevel),
                bestScore: updatedGame.bestScore,
            };
        }
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
    },
    undo: () => {
        const next = undoMove(get().game);
        set({ game: next });

        void saveState(next, get().settings);
    },
    restart: () => {
        const next = restartGame(get().game);
        set({ game: next, rewardedUndoUses: 0, preLossSnapshot: undefined });
        void saveState(next, get().settings);
    },
    continueAfterWin: () => {
        const next = keepPlaying(get().game);
        set({ game: next });
        void saveState(next, get().settings);
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
    },
}));
