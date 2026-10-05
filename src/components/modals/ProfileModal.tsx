import { Image, StyleSheet, Text, View } from "react-native";
import { Modal } from "./Modal";
import { Button } from "../Button";

type Props = {
  visible: boolean;
  theme: "light" | "dark";
  session: any;
  authBusy: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

export function ProfileModal({ visible, theme, session, authBusy, onClose, onSignOut }: Props) {
  const isDark = theme === "dark";

  if (!session) return null;

  return (
    <Modal visible={visible} title="Your profile" onClose={onClose} theme={theme}>
      <View style={styles.profileContent}>
        {session.user.photoURL ? (
          <Image source={{ uri: session.user.photoURL }} style={styles.profileLargeAvatar} />
        ) : (
          <View style={styles.profileLargeAvatarFallback}>
            <Text style={styles.profileLargeInitials}>
              {getInitials(session.user.displayName, session.user.email)}
            </Text>
          </View>
        )}

        <View style={styles.profileDetails}>
          <Text style={[styles.profileName, isDark ? styles.darkText : styles.lightText]}>
            {session.user.displayName || "Infinity player"}
          </Text>
          <Text style={isDark ? styles.mutedDarkText : styles.mutedLightText}>
            {session.user.email}
          </Text>
        </View>

        <Button
          label={authBusy ? "Signing out..." : "Sign out"}
          variant="secondary"
          onPress={onSignOut}
          disabled={authBusy}
        />
      </View>
    </Modal>
  );
}

function getInitials(displayName: string | undefined, email: string) {
  const source = displayName?.trim() || email;
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)).toUpperCase();
}

const styles = StyleSheet.create({
  profileContent: { alignItems: "center", gap: 14 },
  profileLargeAvatar: { width: 76, height: 76, borderRadius: 38 },
  profileLargeAvatarFallback: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7c3aed",
  },
  profileLargeInitials: { color: "#ffffff", fontSize: 24, fontWeight: "800" },
  profileDetails: { alignItems: "center", gap: 4 },
  profileName: { fontSize: 18, fontWeight: "700" },
  lightText: { color: "#0f172a" },
  darkText: { color: "#f8fafc" },
  mutedLightText: { color: "#64748b" },
  mutedDarkText: { color: "#94a3b8" },
});