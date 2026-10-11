import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontFamily } from "../../theme";

/** LeetLab brand row: accent tile with code mark + wordmark. */
export function AuthBrand() {
  return (
    <View className="mb-12 flex-row items-center gap-3">
      <View className="h-8.5 w-8.5 items-center justify-center rounded-[10px] bg-accent">
        <Ionicons name="code-slash" size={20} color={colors.onPrimary} />
      </View>
      <Text
        className="text-foreground"
        style={{
          fontFamily: fontFamily.bold,
          fontSize: 14,
          letterSpacing: 0,
        }}
      >
        LEETLAB
      </Text>
    </View>
  );
}
