import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Configure the audio session once at module load time.
// Without this, expo-audio is muted by default on iOS (silent-ring switch)
// and may not play at all on Android without an active audio focus.
setAudioModeAsync({ playsInSilentMode: true }).catch(() => {
    // non-fatal: device may not support the call
});

// Pre-create players so they are ready immediately when a move fires.
// expo-audio players are native objects — instantiating one per sound call
// leads to leaks and race conditions where the object is released before
// the audio engine can schedule playback.
const mergePlayer = createAudioPlayer(require('../assets/merge.wav'));
const winPlayer = createAudioPlayer(require('../assets/win.wav'));

function playPlayer(player: ReturnType<typeof createAudioPlayer>): void {
    try {
        // Seek to start before playing so rapid re-triggers work correctly.
        player.seekTo(0);
        player.play();
    } catch {
        // Ignore audio failures silently.
    }
}

export function playMergeSound(): void {
    playPlayer(mergePlayer);
}

export function playWinSound(): void {
    playPlayer(winPlayer);
}