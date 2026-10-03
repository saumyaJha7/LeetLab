import { Text, View } from "react-native";
import { colors } from "../../theme";

/** LeetLab brand row: accent "L" tile + wordmark. */
export function AuthBrand() {
  return (
    <View className="mb-10 flex-row items-center gap-2.5">
      <View className="h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent">
        <Text style={{ color: colors.onPrimary, fontSize: 20, fontWeight: "900" }}>
          L
        </Text>
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
