import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SubmitVerdict } from "../../lib/submit";
import { colors, fontFamily } from "../../theme";

type VerdictCardProps = {
  verdict: SubmitVerdict;
};

/** Main verdict card: status icon + status text + passed count. */
export function VerdictCard({ verdict }: VerdictCardProps) {
  const verdictColor = verdict.solved ? colors.success : colors.danger;

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-border bg-surface">
      <View className="flex-row items-center gap-3 px-4 py-4">
        <Ionicons
          name={
            verdict.solved
              ? "checkmark-circle"
              : verdict.status === "Error"
                ? "alert-circle"
                : "close-circle"
          }
          size={28}
          color={verdictColor}
        />
        <View className="flex-1">
          <Text
            style={{
              fontFamily: fontFamily.extraBold,
              fontSize: 18,
              color: verdictColor,
            }}
          >
            {verdict.status}
          </Text>
          <Text
            className="text-muted"
            style={{ fontFamily: fontFamily.regular, fontSize: 13 }}
          >
            {verdict.passed}/{verdict.total} passed
          </Text>
        </View>
      </View>
    </View>
  );
}
