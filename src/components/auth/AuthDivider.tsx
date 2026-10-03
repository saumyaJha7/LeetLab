import { Text, View } from "react-native";

/** "OR" divider between the form and the Google button. */
export function AuthDivider() {
  return (
    <View className="my-6 flex-row items-center gap-3">
      <View className="h-px flex-1 bg-border" />
      <Text
        className="text-muted"
        style={{ fontSize: 11, fontWeight: "800", letterSpacing: 1 }}
      >
        OR
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
