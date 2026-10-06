import { GameLevel } from "./types";

export const LEVELS: Record<GameLevel, {
  label: string;
  boardSize: number;
  fourTileChance: number;
  promotionTile: number | null;
  promotionWindowDays: number | null;
}> = {
  easy: { label: "Easy", boardSize: 4, fourTileChance: 0.1, promotionTile: 512, promotionWindowDays: 7 },
  medium: { label: "Medium", boardSize: 4, fourTileChance: 0.15, promotionTile: 1024, promotionWindowDays: 14 },
  hard: { label: "Hard", boardSize: 4, fourTileChance: 0.25, promotionTile: null, promotionWindowDays: null },
};

export const LEVEL_ORDER: GameLevel[] = ["easy", "medium", "hard"];
export const APP_INACTIVITY_DEMOTION_MS = 24 * 60 * 60 * 1000;

export function getPreviousLevel(level: GameLevel): GameLevel {
  const index = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER[Math.max(0, index - 1)];
}

export function getNextLevel(level: GameLevel): GameLevel | null {
  const index = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER[index + 1] ?? null;
}
