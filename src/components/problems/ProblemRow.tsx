import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";
import type { ProblemSummary } from "../../hooks/useProblemList";

type ProblemRowProps = {
  problem: ProblemSummary;
  showDivider?: boolean;
};

/** Tappable problem row: title + tags + acceptance. Navigates to detail. */
export function ProblemRow({ problem, showDivider = true }: ProblemRowProps) {
  const router = useRouter();
  const tags = (problem.tags ?? []).slice(0, 2).join("  •  ");

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/(tabs)/${problem.problem_id}`)}
      className={`flex-row items-center gap-3 py-4 ${
        showDivider ? "border-b border-border" : ""
      }`}
    >
      {({ pressed }) => (
        <>
          <View
            className="flex-1 gap-1"
            style={{ opacity: pressed ? 0.7 : 1 }}
          >
            <Text
              className="text-foreground"
              style={{ fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
            >
              {problem.title}
            </Text>
            <Text className="text-muted" style={{ fontSize: 13 }} numberOfLines={1}>
              {tags ? `${tags}   ` : ""}
              {problem.acceptance_rate}% acceptance
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </>
      )}
    </Pressable>
  );
}
