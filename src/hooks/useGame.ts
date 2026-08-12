import { useGameStore } from '../store/gameStore';
import { Direction } from '../game/types';

export function useGame() {
  const game = useGameStore((state) => state.game);
  const settings = useGameStore((state) => state.settings);
  const isHydrated = useGameStore((state) => state.isHydrated);
  const undoPressCount = useGameStore((state) => state.undoPressCount);
  const showRewardedAd = useGameStore((state) => state.showRewardedAd);
  const move = useGameStore((state) => state.move);
  const undo = useGameStore((state) => state.undo);
  const restart = useGameStore((state) => state.restart);
  const continueAfterWin = useGameStore((state) => state.continueAfterWin);
  const resetUndoCount = useGameStore((state) => state.resetUndoCount);
  const dismissRewardedAd = useGameStore((state) => state.dismissRewardedAd);

  return {
    game,
    settings,
    isHydrated,
    undoPressCount,
    showRewardedAd,
    move: (direction: Direction) => move(direction),
    undo,
    restart,
    continueAfterWin,
    resetUndoCount,
    dismissRewardedAd,
  };
}
