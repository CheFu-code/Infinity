import * as Sentry from '@sentry/react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const audioReady = setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    interruptionMode: 'mixWithOthers',
}).catch((error) => {
    Sentry.captureException(error, {
        extra: { context: 'Failed to configure game audio' },
    });
});

const mergePlayer = createAudioPlayer(require('../assets/merge.wav'));
const winPlayer = createAudioPlayer(require('../assets/win.wav'));

async function playPlayer(player: ReturnType<typeof createAudioPlayer>): Promise<void> {
    try {
        await audioReady;
        player.seekTo(0);
        player.play();
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                context: 'Failed to play game sound',
                loaded: player.isLoaded,
            },
        });
    }
}

export async function playMergeSound(): Promise<void> {
    await playPlayer(mergePlayer);
}

export async function playWinSound(): Promise<void> {
    await playPlayer(winPlayer);
}