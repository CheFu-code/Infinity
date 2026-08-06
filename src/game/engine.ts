import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomEmptyCell, pickRandomTileValue } from './random';
import { applyMove } from './moves';
import { Board, Direction, GameSettings, GameSnapshot, GameState, PersistedState } from './types';

const BOARD_SIZE = 4;
const STORAGE_KEY = 'infinity-2048-state';

function createEmptyBoard(size = BOARD_SIZE): Board {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function createSnapshot(board: Board, score: number, won: boolean, over: boolean, keepPlaying: boolean): GameSnapshot {
  return { board, score, won, over, keepPlaying };
}

function getStatus(snapshot: GameSnapshot): GameState['status'] {
  if (snapshot.over) {
    return 'over';
  }

  if (snapshot.won && !snapshot.keepPlaying) {
    return 'won';
  }

  return 'playing';
}

export function createInitialGameState(): GameState {
  const board = createEmptyBoard();
  const firstCell = getRandomEmptyCell(board);
  const secondCell = getRandomEmptyCell(board);

  if (firstCell) {
    board[firstCell.x][firstCell.y] = pickRandomTileValue();
  }

  if (secondCell) {
    board[secondCell.x][secondCell.y] = pickRandomTileValue();
  }

  const snapshot = createSnapshot(board, 0, false, false, false);

  return {
    ...snapshot,
    bestScore: 0,
    history: [],
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
  const previous = createSnapshot(cloneBoard(state.board), state.score, state.won, state.over, state.keepPlaying);
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
  const won = nextScore >= 2048 || nextBoard.some((row) => row.some((cell) => cell === 2048));
  const over = !hasAvailableMoves(nextBoard);
  const keepPlaying = state.keepPlaying || false;
  const snapshot = createSnapshot(nextBoard, nextScore, won, over, keepPlaying);

  return {
    ...snapshot,
    bestScore: Math.max(state.bestScore, nextScore),
    history: [previous, ...state.history].slice(0, 10),
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
    status: 'playing',
  };
}

export async function saveState(state: GameState, settings: GameSettings): Promise<void> {
  const payload: PersistedState = { game: state, settings };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function loadState(): Promise<PersistedState | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as PersistedState;
  } catch {
    return null;
  }
}

export async function clearProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
