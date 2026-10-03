import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

/** LeetLab brand row: accent tile with code mark + wordmark. */
export function AuthBrand() {
  return (
    <View className="mb-10 flex-row items-center gap-2.5">
      <View className="h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent">
        <Ionicons name="code-slash" size={20} color={colors.onPrimary} />
      </View>
      <Text
        className="text-foreground"
        style={{ fontSize: 13, fontWeight: "800", letterSpacing: 2.4 }}
      >
        LEETLAB
      </Text>
    </View>
  );
}
