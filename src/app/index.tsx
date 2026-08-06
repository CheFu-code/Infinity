import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useGameStore } from '../store/gameStore';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const game = useGameStore((state) => state.game);
  const settings = useGameStore((state) => state.settings);
  const [statsVisible, setStatsVisible] = useState(false);

  const resolvedTheme = useMemo(() => {
    if (settings.theme === 'system') {
      return colorScheme ?? 'light';
    }
    return settings.theme;
  }, [colorScheme, settings.theme]);

  const isDark = resolvedTheme === 'dark';
  const hasProgress = game.score > 0 || game.board.some((row) => row.some((cell) => cell !== null));

  return (
    <SafeAreaView style={[styles.safeArea, isDark ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>Infinity 2048</Text>
          <Text style={[styles.subtitle, isDark ? styles.mutedDarkText : styles.mutedLightText]}>A native mobile take on the classic tile-merging challenge.</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.scoreLabel, isDark ? styles.darkText : styles.lightText]}>High score</Text>
          <Text style={[styles.scoreValue, isDark ? styles.darkText : styles.lightText]}>{game.bestScore}</Text>
        </View>

        <View style={styles.actions}>
          <Button label="Play" onPress={() => router.push('/game')} />
          <Button label="Continue" variant="secondary" onPress={() => router.push('/game')} disabled={!hasProgress} />
          <Button label="Settings" variant="ghost" onPress={() => router.push('/settings')} />
          <Button label="Stats" variant="ghost" onPress={() => setStatsVisible(true)} />
        </View>
      </View>

      <Modal visible={statsVisible} title="Game stats" onClose={() => setStatsVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Current score: {game.score}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Best score: {game.bestScore}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Status: {game.status}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Sound: {settings.soundEnabled ? 'On' : 'Off'}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Theme: {settings.theme}</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  lightBackground: { backgroundColor: '#f8fafc' },
  darkBackground: { backgroundColor: '#111827' },
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 20 },
  hero: { alignItems: 'center', gap: 8 },
  title: { fontSize: 34, fontWeight: '800' },
  subtitle: { fontSize: 16, textAlign: 'center' },
  lightText: { color: '#0f172a' },
  darkText: { color: '#f8fafc' },
  mutedLightText: { color: '#475569' },
  mutedDarkText: { color: '#94a3b8' },
  card: { borderRadius: 24, padding: 20, alignItems: 'center', backgroundColor: '#ffffff22', borderWidth: 1, borderColor: '#ffffff44' },
  scoreLabel: { fontSize: 16, fontWeight: '600' },
  scoreValue: { fontSize: 30, fontWeight: '800' },
  actions: { gap: 12 },
  modalContent: { gap: 8 },
  modalText: { fontSize: 16 },
});
