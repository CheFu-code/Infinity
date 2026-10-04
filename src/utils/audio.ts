import { createAudioPlayer } from 'expo-audio';

const mergeAsset = require('../assets/merge.wav');
const winAsset = require('../assets/win.wav');

async function playSound(asset: any): Promise<void> {
    try {
        const player = createAudioPlayer(asset);
        player.play();
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