import { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface TileProps {
    value: number | null;
    compact?: boolean;
}

type TileTheme = {
    background: string;
    text: string;
    shadow?: string;
};

const DARK_TEXT = '#3F3A32';
const LIGHT_TEXT = '#FFFFFF';

const TILE_PALETTE: Record<number, TileTheme> = {
    2: { background: '#F4F1EA', text: DARK_TEXT },
    4: { background: '#E6D9BC', text: DARK_TEXT },
    8: { background: '#E8B86D', text: DARK_TEXT },
    16: { background: '#E49A4F', text: DARK_TEXT },
    32: { background: '#D0603A', text: LIGHT_TEXT },
    64: { background: '#C94C4C', text: LIGHT_TEXT },
    128: { background: '#9B59B6', text: LIGHT_TEXT },
    256: { background: '#7657C8', text: LIGHT_TEXT },
    512: { background: '#4C6FD7', text: LIGHT_TEXT },
    1024: { background: '#277DA1', text: LIGHT_TEXT },
    2048: { background: '#7C3AED', text: LIGHT_TEXT, shadow: '#7C3AED' },
};

const getTileTheme = (value: number): TileTheme => {
    const known = TILE_PALETTE[value];
    if (known) return known;

    // Beyond 2048: a distinct, always-visible color per power of two
    const hue = (Math.log2(value) * 47) % 360;
    const background = `hsl(${hue} 70% 40%)`;

    return { background, text: LIGHT_TEXT, shadow: background };
};
const getFontSize = (value: number) => {
    if (value >= 10000) return 22;
    if (value >= 1000) return 26;
    if (value >= 100) return 29;

    return 32;
};

export const Tile = memo(function Tile({ value, compact = false }: TileProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (value === null) {
            return;
        }

        scale.value = 0.78;
        opacity.value = 0;

        scale.value = withSequence(
            withTiming(1.08, { duration: 110 }),
            withTiming(1, { duration: 100 })
        );

        opacity.value = withTiming(1, {
            duration: 160,
        });
    }, [value, scale, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            {
                scale: scale.value,
            },
        ],
    }));

    if (value === null) {
        return <View style={styles.empty} />;
    }

    const theme = getTileTheme(value);
    const fontSize = compact ? Math.min(18, getFontSize(value)) : getFontSize(value);

    return (
        <Animated.View
            style={[
                styles.tile,
                {
                    backgroundColor: theme.background,
                },
                theme.shadow && {
                    shadowColor: theme.shadow,
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    shadowOffset: {
                        width: 0,
                        height: 6,
                    },
                    elevation: 6,
                },
                animatedStyle,
            ]}
        >
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                    styles.text,
                    {
                        color: theme.text,
                        fontSize,
                    },
                ]}
            >
                {value}
            </Text>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    empty: {
        flex: 1,
        borderRadius: 18,
        backgroundColor: '#3F3F46',
    },

    tile: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 18,

        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'hidden',
    },

    text: {
        fontWeight: '900',
        letterSpacing: -1,
        textAlign: 'center',
    },
});