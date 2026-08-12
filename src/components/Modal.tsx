import type { ReactNode } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ visible, title, onClose, children }: ModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            isDark ? styles.cardDark : styles.cardLight,
          ]}
          onPress={() => undefined}
        >
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton}>
              <Text style={[styles.close, isDark ? styles.closeDark : styles.closeLight]}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.content}>{children}</View>
        </Pressable>
        </Pressable>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000066' },
  card: { alignSelf: 'center', width: '86%', maxWidth: 420, borderRadius: 20, padding: 18 },
  cardLight: { backgroundColor: '#ffffff' },
  cardDark: { backgroundColor: '#0b1220' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '700' },
  titleLight: { color: '#0f172a' },
  titleDark: { color: '#f8fafc' },
  closeButton: { padding: 6, borderRadius: 8 },
  close: { fontSize: 18 },
  closeLight: { color: '#64748b' },
  closeDark: { color: '#94a3b8' },
  content: { paddingTop: 6 },
});
