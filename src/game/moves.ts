import { Board, Direction } from './types';
import { mergeLine, transpose } from './merge';

function normalizeLine(line: Array<number | null>, direction: Direction): Array<number | null> {
  if (direction === 'left' || direction === 'up') {
    return line;
  }

  return [...line].reverse();
}

function restoreLine(line: Array<number | null>, direction: Direction): Array<number | null> {
  if (direction === 'left' || direction === 'up') {
    return line;
  }

  return [...line].reverse();
}

export function applyMove(board: Board, direction: Direction): { board: Board; scoreGain: number; moved: boolean } {
  const size = board.length;
  let nextBoard = board.map((row) => [...row]);
  let scoreGain = 0;
  let moved = false;

  const processLine = (line: Array<number | null>): Array<number | null> => {
    const normalized = normalizeLine(line, direction);
    const { mergedLine, scoreGain: gain } = mergeLine(normalized);
    scoreGain += gain;
    const restored = restoreLine(mergedLine, direction);
    return restored;
  };

  if (direction === 'left' || direction === 'right') {
    for (let row = 0; row < size; row += 1) {
      const processed = processLine(nextBoard[row]);
      if (processed.some((value, index) => value !== nextBoard[row][index])) {
        moved = true;
      }
      nextBoard[row] = processed;
    }
  } else {
    const transposed = transpose(nextBoard);
    const processedRows = transposed.map((row) => processLine(row));
    if (processedRows.some((row, rowIndex) => row.some((value, index) => value !== transposed[rowIndex][index]))) {
      moved = true;
    }
    nextBoard = transpose(processedRows);
  }

  return { board: nextBoard, scoreGain, moved };
}
