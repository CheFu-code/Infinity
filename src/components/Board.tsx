import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useGameStore } from '../store/gameStore';
import { Tile } from './Tile';

const PanGestureHandlerAny = PanGestureHandler as unknown as ComponentType<any>;

interface BoardProps {
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export function Board({ onSwipe }: BoardProps) {
  const board = useGameStore((state) => state.game.board);

  const handleGesture = (dx: number, dy: number) => {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 24) {
      return;
    }

    if (absDx > absDy) {
      onSwipe(dx > 0 ? 'right' : 'left');
    } else {
      onSwipe(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <PanGestureHandlerAny
      onHandlerStateChange={(event: any) => {
        if (event.nativeEvent.state !== State.END) {
          return;
        }

        handleGesture(event.nativeEvent.translationX, event.nativeEvent.translationY);
      }}
    >
      <View style={styles.container}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View key={`${rowIndex}-${colIndex}`} style={styles.cell}>
                <Tile value={cell} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </PanGestureHandlerAny>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 10, padding: 10, borderRadius: 24, backgroundColor: '#475569' },
  row: { flexDirection: 'row', flex: 1, gap: 10 },
  cell: { flex: 1, borderRadius: 16, backgroundColor: '#cbd5e1', justifyContent: 'center' },
});
