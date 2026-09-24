import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";


export default function HomeScreen() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      
      <View style={styles.floatingContainer}>
        <Link href="/(tabs)/problems" asChild>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>problem</Text>
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

const CYAN_COLOR = "#4CB1F7";
const LIGHT_CYAN = "#E6F4FE";

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
    padding: 16,
    backgroundColor: LIGHT_CYAN,
    borderWidth: 4,
    borderColor: CYAN_COLOR,
    borderRadius: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: CYAN_COLOR,
  },
  buttonText: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: "#F0F0F0",
  },
});
