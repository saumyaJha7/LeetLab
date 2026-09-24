import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      
      <View style={styles.floatingContainer}>
        <Link href="/(tabs)/problems" asChild>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>prblm</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/profile" asChild>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>profile</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111111",
    position: "absolute",
    top: 120,
    letterSpacing: -1,
  },
  floatingContainer: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  buttonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.6,
    backgroundColor: "#F9F9F9",
  },
});
