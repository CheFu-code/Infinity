import { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface TileProps {
  value: number | null;
}

const getTileColor = (value: number | null) => {
  if (!value) {
    return '#f1f5f9';
  }

  const palette: Record<number, string> = {
    2: '#fef3c7',
    4: '#fde68a',
    8: '#fbbf24',
    16: '#fb923c',
    32: '#f97316',
    64: '#ef4444',
    128: '#ec4899',
    256: '#8b5cf6',
    512: '#3b82f6',
    1024: '#06b6d4',
    2048: '#14b8a6',
  };

  return palette[value] ?? '#0f172a';
};

export const Tile = memo(function Tile({ value }: TileProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.86);

  useEffect(() => {
    if (value === null) {
      return;
    }

    opacity.value = 0;
    scale.value = 0.86;
    opacity.value = withTiming(1, { duration: 180 });
    scale.value = withTiming(1, { duration: 180 });
  }, [value, opacity, scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (value === null) {
    return <View style={styles.empty} />;
  }

  return (
    <Animated.View style={[styles.tile, { backgroundColor: getTileColor(value) }, animatedStyle]}>
      <Text style={styles.text}>{value}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  tile: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  text: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '800',
  },
});
