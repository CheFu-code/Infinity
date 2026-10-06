import type { ComponentType } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import { useGameStore } from '../store/gameStore';
import { Tile } from './Tile';

const PanGestureHandlerAny =
    PanGestureHandler as unknown as ComponentType<any>;

interface BoardProps {
    onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Keeps the board large while leaving comfortable margins
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 32, 430);

const BOARD_PADDING = 8;
const CELL_GAP = 6;

export function Board({ onSwipe }: BoardProps) {
    const board = useGameStore((state) => state.game.board);
    const cellRadius = board.length >= 8 ? 7 : board.length >= 5 ? 11 : 18;

    const handleGesture = (dx: number, dy: number) => {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // Ignore accidental / tiny movements
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
            activeOffsetX={[-15, 15]}
            activeOffsetY={[-15, 15]}
            onHandlerStateChange={(event: any) => {
                if (event.nativeEvent.state !== State.END) {
                    return;
                }

                handleGesture(
                    event.nativeEvent.translationX,
                    event.nativeEvent.translationY
                );
            }}
        >
            <View style={styles.shadowWrapper}>
                <View style={styles.board}>
                    {board.map((row, rowIndex) => (
                        <View
                            key={`row-${rowIndex}`}
                            style={styles.row}
                        >
                            {row.map((cell, colIndex) => (
                                <View
                                    key={`${rowIndex}-${colIndex}`}
                                    style={[styles.cell, { borderRadius: cellRadius }]}
                                >
                                    <Tile value={cell} compact={board.length >= 8} />
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </PanGestureHandlerAny>
    );
}

const styles = StyleSheet.create({
    shadowWrapper: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        alignSelf: 'center',

        borderRadius: 22,

        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: {
            width: 0,
            height: 12,
        },

        elevation: 10,
    },

    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,

        padding: BOARD_PADDING,

        borderRadius: 22,

        backgroundColor: '#27272A',

        gap: CELL_GAP,

        overflow: 'hidden',
    },

    row: {
        flex: 1,

        flexDirection: 'row',

        gap: CELL_GAP,
    },

    cell: {
        flex: 1,

        aspectRatio: 1,

        borderRadius: 18,

        backgroundColor: '#3F3F46',

        alignItems: 'center',
        justifyContent: 'center',
    },
});