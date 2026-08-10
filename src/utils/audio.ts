import { createAudioPlayer } from 'expo-audio';

const mergeAsset = require('../assets/merge.wav');
const winAsset = require('../assets/win.wav');

export async function playMergeSound(): Promise<void> {
  let player: ReturnType<typeof createAudioPlayer> | undefined;

  try {
    player = createAudioPlayer(mergeAsset);
    player.play();
  } catch {
    // Ignore missing or unsupported assets and keep the app running.
  } finally {
    player?.remove();
  }
}

export async function playWinSound(): Promise<void> {
  let player: ReturnType<typeof createAudioPlayer> | undefined;

  try {
    player = createAudioPlayer(winAsset);
    player.play();
  } catch {
    // Ignore missing or unsupported assets and keep the app running.
  } finally {
    player?.remove();
  }
}
