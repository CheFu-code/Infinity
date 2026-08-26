import { Audio } from 'expo-av';

const mergeAsset = require('../assets/merge.wav');
const winAsset = require('../assets/win.wav');

async function playSound(asset: any): Promise<void> {
    try {
        const sound = new Audio.Sound();

        await sound.loadAsync(asset);
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                void sound.unloadAsync();
            }
        });
    } catch {
        // Ignore audio failures so they don't crash the app.
    }
}

export async function playMergeSound(): Promise<void> {
    await playSound(mergeAsset);
}

export async function playWinSound(): Promise<void> {
    await playSound(winAsset);
}