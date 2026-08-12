export type Direction = 'up' | 'down' | 'left' | 'right';

export type TileValue = number | null;
export type Board = Array<Array<TileValue>>;

export interface GameSnapshot {
  board: Board;
  score: number;
  won: boolean;
  over: boolean;
  keepPlaying: boolean;
  moveCount: number;
  maxTile: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface GameState extends GameSnapshot {
  bestScore: number;
  history: GameSnapshot[];
  achievements: Achievement[];
  status: 'idle' | 'playing' | 'won' | 'over';
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface PersistedState {
  game: GameState;
  settings: GameSettings;
}
