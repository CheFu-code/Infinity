import { StyleSheet, Text, View } from 'react-native';
import { Modal } from '../Modal';
import type { GameSettings, GameState } from '../../game/types';
import type { HomeTheme } from './types';

type Props = { visible: boolean; onClose: () => void; themeName: 'light' | 'dark'; theme: HomeTheme; game: GameState; settings: GameSettings };
const StatRow = ({ label, value, theme }: { label: string; value: string; theme: HomeTheme }) => <View style={[styles.row, { borderBottomColor: theme.border }]}><Text style={[styles.label, { color: theme.muted }]}>{label}</Text><Text style={[styles.value, { color: theme.text }]}>{value}</Text></View>;

export function StatsModal({ visible, onClose, themeName, theme, game, settings }: Props) {
    const stats: [string, string][] = [['Current score', game.score.toLocaleString()], ['Best score', game.bestScore.toLocaleString()], ['Highest tile', game.maxTile.toLocaleString()], ['Moves taken', game.moveCount.toString()], ['Achievements', game.achievements.filter(item => item.unlocked).length.toString()], ['Status', game.status], ['Sound', settings.soundEnabled ? 'On' : 'Off'], ['Theme', settings.theme]];
    return <Modal visible={visible} title="Game statistics" onClose={onClose} theme={themeName}><View style={styles.content}>{stats.map(([label, value]) => <StatRow key={label} label={label} value={value} theme={theme} />)}</View></Modal>;
}

const styles = StyleSheet.create({ content: { gap: 0 }, row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth }, label: { fontSize: 14, fontWeight: '500' }, value: { fontSize: 14, fontWeight: '800' } });