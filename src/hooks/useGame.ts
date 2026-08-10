import { useGameStore } from '../store/gameStore';
import { Direction } from '../game/types';

export function useGame() {
  const game = useGameStore((state) => state.game);
  const settings = useGameStore((state) => state.settings);
  const isHydrated = useGameStore((state) => state.isHydrated);
  const move = useGameStore((state) => state.move);
  const undo = useGameStore((state) => state.undo);
  const restart = useGameStore((state) => state.restart);
  const continueAfterWin = useGameStore((state) => state.continueAfterWin);

  return {
    game,
    settings,
    isHydrated,
    move: (direction: Direction) => move(direction),
    undo,
    restart,
    continueAfterWin,
  };
}
