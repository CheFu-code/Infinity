export function pickRandomTileValue(): number {
  return Math.random() < 0.9 ? 2 : 4;
}

export function getRandomEmptyCell(board: Array<Array<number | null>>): {x: number; y: number} | null {
  const emptyCells: Array<{x: number; y: number}> = [];

  board.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell === null) {
        emptyCells.push({ x, y });
      }
    });
  });

  if (!emptyCells.length) {
    return null;
  }

  const index = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[index];
}
