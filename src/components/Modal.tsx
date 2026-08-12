import type { ReactNode } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  theme?: 'light' | 'dark';
  dismissible?: boolean;
}

export function Modal({ visible, title, onClose, children, theme, dismissible = true }: ModalProps) {
  const colorScheme = useColorScheme();
  const isDark = theme ? theme === 'dark' : colorScheme === 'dark';
  const handleClose = dismissible ? onClose : () => undefined;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={styles.root} accessibilityViewIsModal>
        <Pressable
          style={styles.backdrop}
          onPress={dismissible ? onClose : undefined}
          accessibilityRole={dismissible ? 'button' : undefined}
          accessibilityLabel={dismissible ? 'Close dialog' : undefined}
        />
        <View
          style={[
            styles.card,
            isDark ? styles.cardDark : styles.cardLight,
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>{title}</Text>
            {dismissible ? (
              <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton}>
                <Text style={[styles.close, isDark ? styles.closeDark : styles.closeLight]}>✕</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000066' },
  card: { width: '100%', maxWidth: 420, borderRadius: 20, padding: 20, elevation: 12, shadowColor: '#000', shadowOpacity: 0.24, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
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
