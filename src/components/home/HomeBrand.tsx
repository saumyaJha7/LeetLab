import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontFamily } from "../../theme";

/** Compact brand row for the home top bar. */
export function HomeBrand() {
  return (
    <View className="mb-5 flex-row items-center gap-2">
      <View className="h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-accent">
        <Ionicons name="code-slash" size={18} color={colors.onPrimary} />
      </View>
      <Text
        className="text-foreground"
        style={{
          fontFamily: fontFamily.bold,
          fontSize: 13,
          letterSpacing: 0,
        }}
      >
        LEETLAB
      </Text>
    </View>
  );
}
