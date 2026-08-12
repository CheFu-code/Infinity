import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAchievements } from './achievements';
import { getRandomEmptyCell, pickRandomTileValue } from './random';
import { applyMove } from './moves';
import { Achievement, Board, Direction, GameSettings, GameSnapshot, GameState, PersistedState } from './types';

const BOARD_SIZE = 4;
const STORAGE_KEY = 'infinity-2048-state';

function createEmptyBoard(size = BOARD_SIZE): Board {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function getMaxTile(board: Board): number {
  return board.reduce<number>((maxValue, row) => {
    return row.reduce<number>((maxRow, cell) => Math.max(maxRow, cell ?? 0), maxValue);
  }, 0);
}

function createSnapshot(
  board: Board,
  score: number,
  won: boolean,
  over: boolean,
  keepPlaying: boolean,
  moveCount: number,
  maxTile: number,
): GameSnapshot {
  return { board, score, won, over, keepPlaying, moveCount, maxTile };
}

function getStatus(snapshot: GameSnapshot): GameState['status'] {
  if (snapshot.won && !snapshot.keepPlaying) {
    return 'won';
  }

  if (snapshot.over) {
    return 'over';
  }

  return 'playing';
}

export function createInitialGameState(): GameState {
  const board = createEmptyBoard();
  const firstCell = getRandomEmptyCell(board);

  if (firstCell) {
    board[firstCell.x][firstCell.y] = pickRandomTileValue();
  }

  const secondCell = getRandomEmptyCell(board);
  if (secondCell) {
    board[secondCell.x][secondCell.y] = pickRandomTileValue();
  }

  const initialMaxTile = getMaxTile(board);
  const snapshot = createSnapshot(board, 0, false, false, false, 0, initialMaxTile);

  return {
    ...snapshot,
    bestScore: 0,
    history: [],
    achievements: getAchievements(0, false, false, 0, initialMaxTile, false),
    status: getStatus(snapshot),
  };
}

export function createDefaultSettings(): GameSettings {
  return {
    soundEnabled: true,
    vibrationEnabled: true,
    theme: 'system',
  };
}

function hasAvailableMoves(board: Board): boolean {
  if (board.some((row) => row.some((cell) => cell === null))) {
    return true;
  }

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const current = board[row][col];
      if (current === null) {
        continue;
      }

      const neighbors = [
        board[row - 1]?.[col],
        board[row + 1]?.[col],
        board[row]?.[col - 1],
        board[row]?.[col + 1],
      ];

      if (neighbors.some((value) => value === current)) {
        return true;
      }
    }
  }

  return false;
}
export function makeMove(state: GameState, direction: Direction): GameState {
  if (state.won && !state.keepPlaying) {
    return state;
  }

  const previous = createSnapshot(
    cloneBoard(state.board),
    state.score,
    state.won,
    state.over,
    state.keepPlaying,
    state.moveCount,
    state.maxTile,
  );
  const result = applyMove(state.board, direction);

  if (!result.moved) {
    return state;
  }

  const nextBoard = cloneBoard(result.board);
  const spawnCell = getRandomEmptyCell(nextBoard);

  if (spawnCell) {
    nextBoard[spawnCell.x][spawnCell.y] = pickRandomTileValue();
  }

  const nextScore = state.score + result.scoreGain;
  const nextMoveCount = state.moveCount + 1;
  const nextMaxTile = getMaxTile(nextBoard);
  const won = nextBoard.some((row) => row.some((cell) => cell !== null && cell >= 2048));
  const over = !hasAvailableMoves(nextBoard);
  const keepPlaying = state.keepPlaying || false;
  const snapshot = createSnapshot(nextBoard, nextScore, won, over, keepPlaying, nextMoveCount, nextMaxTile);

  return {
    ...snapshot,
    bestScore: Math.max(state.bestScore, nextScore),
    // Keep full history to allow unlimited undos (may increase memory usage).
    history: [previous, ...state.history],
    achievements: getAchievements(nextScore, won, over, nextMoveCount, nextMaxTile, keepPlaying),
    status: getStatus(snapshot),
  };
}

export function undoMove(state: GameState): GameState {
  const previous = state.history[0];
  if (!previous) {
    return state;
  }

  return {
    ...previous,
    bestScore: state.bestScore,
    history: state.history.slice(1),
    achievements: getAchievements(previous.score, previous.won, previous.over, previous.moveCount, previous.maxTile, previous.keepPlaying),
    status: getStatus(previous),
  };
}

export function restartGame(state: GameState): GameState {
  const initial = createInitialGameState();
  return {
    ...initial,
    bestScore: state.bestScore,
  };
}

export function keepPlaying(state: GameState): GameState {
  return {
    ...state,
    keepPlaying: true,
    achievements: getAchievements(state.score, state.won, state.over, state.moveCount, state.maxTile, true),
    status: 'playing',
  };
}

export async function saveState(state: GameState, settings: GameSettings): Promise<void> {
  const payload: PersistedState = { game: state, settings };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function isBoard(value: unknown): value is Board {
  return (
    Array.isArray(value) &&
    value.length === BOARD_SIZE &&
    value.every((row) => Array.isArray(row) && row.length === BOARD_SIZE && row.every((cell) => typeof cell === 'number' || cell === null))
  );
}

function isGameSnapshot(value: unknown): value is GameSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<GameSnapshot>;
  return (
    typeof candidate.score === 'number' &&
    isBoard(candidate.board) &&
    typeof candidate.won === 'boolean' &&
    typeof candidate.over === 'boolean' &&
    typeof candidate.keepPlaying === 'boolean' &&
    typeof candidate.moveCount === 'number' &&
    typeof candidate.maxTile === 'number'
  );
}

function isAchievement(value: unknown): value is Achievement {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Achievement>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.unlocked === 'boolean'
  );
}

function normalizePersistedState(value: unknown): PersistedState | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<PersistedState>;
  if (!candidate.game || !candidate.settings) {
    return null;
  }

  const game = candidate.game;
  const settings = candidate.settings;

  if (
    typeof game.score !== 'number' ||
    !isBoard(game.board) ||
    typeof game.won !== 'boolean' ||
    typeof game.over !== 'boolean' ||
    typeof game.keepPlaying !== 'boolean' ||
    typeof game.moveCount !== 'number' ||
    typeof game.maxTile !== 'number' ||
    typeof game.bestScore !== 'number' ||
    !Array.isArray(game.history) ||
    !game.history.every((entry) => isGameSnapshot(entry)) ||
    (game.status !== 'idle' && game.status !== 'playing' && game.status !== 'won' && game.status !== 'over') ||
    typeof settings.soundEnabled !== 'boolean' ||
    typeof settings.vibrationEnabled !== 'boolean' ||
    (settings.theme !== 'light' && settings.theme !== 'dark' && settings.theme !== 'system')
  ) {
    return null;
  }

  const achievements = Array.isArray(game.achievements)
    ? game.achievements.every((entry) => isAchievement(entry))
      ? game.achievements
      : null
    : game.achievements === undefined
      ? getAchievements(game.score, game.won, game.over, game.moveCount ?? 0, game.maxTile ?? 0, game.keepPlaying ?? false)
      : null;

  if (!achievements) {
    return null;
  }

  return {
    game: {
      ...game,
      achievements,
    },
    settings: {
      ...settings,
    },
  };
}

export async function loadState(): Promise<PersistedState | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    return normalizePersistedState(parsed);
  } catch {
    return null;
  }
}

export async function clearProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
