import { Board } from './types';

export function mergeLine(line: Array<number | null>): { mergedLine: Array<number | null>; scoreGain: number } {
  const filtered = line.filter((value): value is number => value !== null);
  const merged: Array<number | null> = [];
  let scoreGain = 0;

  for (let index = 0; index < filtered.length; index += 1) {
    const current = filtered[index];
    const next = filtered[index + 1];

    if (next !== undefined && next === current) {
      const value = current * 2;
      merged.push(value);
      scoreGain += value;
      index += 1;
    } else {
      merged.push(current);
    }
  }

  while (merged.length < line.length) {
    merged.push(null);
  }

  return { mergedLine: merged, scoreGain };
}

export function transpose(board: Board): Board {
  return board[0].map((_, column) => board.map((row) => row[column]));
}
