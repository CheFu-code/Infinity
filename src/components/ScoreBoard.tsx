import { StyleSheet, Text, View } from 'react-native';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

export function ScoreBoard({ score, bestScore }: ScoreBoardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.scoreBox}>
        <Text style={styles.label}>Score</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <View style={styles.scoreBox}>
        <Text style={styles.label}>Best</Text>
        <Text style={styles.value}>{bestScore}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12 },
  scoreBox: { flex: 1, borderRadius: 16, padding: 12, backgroundColor: '#ffffff', alignItems: 'center' },
  label: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  value: { fontSize: 22, color: '#0f172a', fontWeight: '800' },
});
