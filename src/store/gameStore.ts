import { create } from 'zustand';
import { clearProgress, createDefaultSettings, createInitialGameState, keepPlaying, loadState, makeMove, restartGame, saveState, undoMove } from '../game/engine';
import { Direction, GameSettings, GameState } from '../game/types';

interface GameStore {
  game: GameState;
  settings: GameSettings;
  isHydrated: boolean;
  initialize: () => Promise<void>;
  move: (direction: Direction) => void;
  undo: () => void;
  restart: () => void;
  continueAfterWin: () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  setTheme: (theme: GameSettings['theme']) => void;
  resetProgress: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: createInitialGameState(),
  settings: createDefaultSettings(),
  isHydrated: false,
  initialize: async () => {
    const persisted = await loadState();
    if (persisted) {
      set({ game: persisted.game, settings: persisted.settings, isHydrated: true });
      return;
    }

    set({ isHydrated: true });
  },
  move: (direction) => {
    const next = makeMove(get().game, direction);
    const updatedGame = next !== get().game ? next : get().game;
    set({ game: updatedGame });
    void saveState(updatedGame, get().settings);
  },
  undo: () => {
    const next = undoMove(get().game);
    set({ game: next });
    void saveState(next, get().settings);
  },
  restart: () => {
    const next = restartGame(get().game);
    set({ game: next });
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
    const initial = createInitialGameState();
    set({ game: initial });
    await clearProgress();
  },
}));
