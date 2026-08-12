import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
  const unlockedCount = game.achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <SafeAreaView style={[styles.safeArea, isDark ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(320)} style={styles.hero}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>Infinity 2048</Text>
          <Text style={[styles.subtitle, isDark ? styles.mutedDarkText : styles.mutedLightText]}>A native mobile take on the classic tile-merging challenge.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(320)} style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.scoreLabel, isDark ? styles.darkText : styles.lightText]}>High score</Text>
          <Text style={[styles.scoreValue, isDark ? styles.darkText : styles.lightText]}>{game.bestScore}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(320)} style={styles.actions}>
          <Button label="Play" onPress={() => router.push('/game')} />
          <Button label="Continue" variant="secondary" onPress={() => router.push('/game')} disabled={!hasProgress} />
          <Button label="Settings" variant="ghost" onPress={() => router.push('/settings')} />
          <Button label="Stats" variant="ghost" onPress={() => setStatsVisible(true)} />
        </Animated.View>
      </View>

      <Modal visible={statsVisible} title="Game stats" onClose={() => setStatsVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Current score: {game.score}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Best score: {game.bestScore}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Highest tile: {game.maxTile}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Moves taken: {game.moveCount}</Text>
          <Text style={[styles.modalText, isDark ? styles.darkText : styles.lightText]}>Achievements unlocked: {unlockedCount}</Text>
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
  card: { borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1 },
  lightCard: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  darkCard: { backgroundColor: '#1f2937', borderColor: '#374151' },
  scoreLabel: { fontSize: 16, fontWeight: '600' },
  scoreValue: { fontSize: 30, fontWeight: '800' },
  actions: { gap: 12 },
  modalContent: { gap: 8 },
  modalText: { fontSize: 16 },
});
