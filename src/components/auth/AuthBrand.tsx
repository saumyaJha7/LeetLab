import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontFamily } from "../../theme";

/** LeetLab brand row: accent tile with code mark + wordmark. */
export function AuthBrand() {
  return (
    <View className="mb-10 flex-row items-center gap-2.5">
      <View className="h-8.5 w-8.5 items-center justify-center rounded-[10px] bg-accent">
        <Ionicons name="code-slash" size={20} color={colors.onPrimary} />
      </View>
      <Text
        className="text-foreground"
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          fontFamily: fontFamily.bold,
          fontSize: 13,
          letterSpacing: 0,
          flexShrink: 0,
          paddingRight: 4,
        }}
      >
        LEETLAB
      </Text>
    </View>
  );
}
