export function pickRandomTileValue(fourTileChance = 0.1): number {
  return Math.random() < fourTileChance ? 4 : 2;
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
