import { StyleSheet, View } from "react-native";
import { Button } from "./Button";

type Props = {
  onRestart: () => void;
  onUndo: () => void;
  canUndo: boolean;
};

export function GameActions({ onRestart, onUndo, canUndo }: Props) {
  return (
    <View style={styles.actions}>
      <Button variant="secondary" label="Restart" onPress={onRestart} />
      <Button label="Undo" onPress={onUndo} disabled={!canUndo} />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});