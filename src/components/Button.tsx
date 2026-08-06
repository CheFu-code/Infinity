import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 999, paddingHorizontal: 20, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#7c3aed' },
  secondary: { backgroundColor: '#e2e8f0' },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#cbd5e1' },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.98 }] },
  text: { color: '#ffffff', fontWeight: '700' },
  ghostText: { color: '#334155' },
});
