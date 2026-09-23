import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ProblemDetailScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Problem detail screen</Text>
      <Text style={styles.subText}>Problem ID: {problemId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
  subText: {
    marginTop: 12,
    fontSize: 16,
  },
});
