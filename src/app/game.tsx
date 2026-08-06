import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Board } from '../components/Board';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ScoreBoard } from '../components/ScoreBoard';
import { useGameStore } from '../store/gameStore';
import { useGame } from '../hooks/useGame';

export default function GameScreen() {
  const colorScheme = useColorScheme();
  const { game, settings, isHydrated, move, undo, restart, continueAfterWin } = useGame();
  const [paused, setPaused] = useState(false);

  const resolvedTheme = useMemo(() => {
    if (settings.theme === 'system') {
      return colorScheme ?? 'light';
    }
    return settings.theme;
  }, [colorScheme, settings.theme]);
  const isDark = resolvedTheme === 'dark';

  if (!isHydrated) {
    return (
      <SafeAreaView style={[styles.safeArea, isDark ? styles.darkBackground : styles.lightBackground]}>
        <View style={styles.loading}><Text style={[styles.loadingText, isDark ? styles.darkText : styles.lightText]}>Loading game…</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, isDark ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>Play</Text>
          <Button label="Pause" variant="secondary" onPress={() => setPaused(true)} />
        </View>

        <ScoreBoard score={game.score} bestScore={game.bestScore} />

        <Board onSwipe={move} />

        <View style={styles.actions}>
          <Button label="Restart" onPress={restart} />
          <Button label="Undo" variant="secondary" onPress={undo} disabled={game.history.length === 0} />
        </View>

        {game.status === 'won' && !game.keepPlaying ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>You reached 2048! Keep going?</Text>
            <Button label="Keep playing" onPress={continueAfterWin} />
          </View>
        ) : null}

        {game.status === 'over' ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>No moves left — restart to try again.</Text>
          </View>
        ) : null}
      </View>

      <Modal visible={paused} title="Paused" onClose={() => setPaused(false)}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Take a breather and jump back in when ready.</Text>
          <Button label="Resume" onPress={() => setPaused(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  lightBackground: { backgroundColor: '#f8fafc' },
  darkBackground: { backgroundColor: '#111827' },
  container: { flex: 1, padding: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700' },
  lightText: { color: '#0f172a' },
  darkText: { color: '#f8fafc' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  banner: { borderRadius: 20, padding: 16, backgroundColor: '#7c3aed22', gap: 12, alignItems: 'center' },
  bannerText: { fontSize: 16, fontWeight: '600', color: '#7c3aed' },
  modalContent: { gap: 12 },
  modalText: { fontSize: 16 },
});
