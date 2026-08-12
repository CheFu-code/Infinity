import { Audio } from 'expo-av';

const mergeAsset = require('../assets/merge.wav');
const winAsset = require('../assets/win.wav');

async function playSound(asset: any): Promise<void> {
  try {
    const sound = new Audio.Sound();
    // Load, play, and unload when finished. Fail silently if native module missing.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await sound.loadAsync(asset);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status?.didJustFinish) void sound.unloadAsync();
    });
  } catch {
    // Ignore missing native modules or other audio failures to keep the app running.
  }
}

export async function playMergeSound(): Promise<void> {
  await playSound(mergeAsset);
}

export async function playWinSound(): Promise<void> {
  await playSound(winAsset);
}
