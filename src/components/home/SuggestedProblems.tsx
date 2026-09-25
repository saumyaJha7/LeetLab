import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import { colors } from "../../theme";
import { ErrorState, LoadingState } from "../ui";
import type { ProblemSummary } from "../../hooks/useProblemList";

type SuggestedProblemsProps = {
  problems: ProblemSummary[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

/** "Suggested for you" card with tappable problem rows. */
export function SuggestedProblems({
  problems,
  loading,
  error,
  onRetry,
}: SuggestedProblemsProps) {
  const router = useRouter();

  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text
          className="text-foreground"
          style={{ fontSize: 17, fontWeight: "700" }}
        >
          Suggested for you
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/(tabs)/problems")}
          hitSlop={8}
        >
          {({ pressed }) => (
            <Text
              className="text-link"
              style={{
                fontSize: 14,
                fontWeight: "700",
                opacity: pressed ? 0.7 : 1,
              }}
            >
              View all
            </Text>
          )}
        </Pressable>
      </View>

      <Card>
        <Card.Body>
          {loading ? (
            <LoadingState label="Finding problems…" />
          ) : error ? (
            <ErrorState description={error} onRetry={onRetry} />
          ) : problems.length === 0 ? (
            <Text
              className="py-6 text-center text-muted"
              style={{ fontSize: 14 }}
            >
              No problems yet. Check back soon.
            </Text>
          ) : (
            problems.map((problem, index) => {
              const isLast = index === problems.length - 1;
              const tags = (problem.tags ?? []).slice(0, 2).join("  •  ");

              return (
                <Pressable
                  key={problem.problem_id}
                  accessibilityRole="button"
                  onPress={() => router.push(`/(tabs)/${problem.problem_id}`)}
                  className={`flex-row items-center gap-3 py-4 ${
                    isLast ? "" : "border-b border-border"
                  }`}
                >
                  {({ pressed }) => (
                    <>
                      <View className="flex-1 gap-1" style={{ opacity: pressed ? 0.7 : 1 }}>
                        <Text
                          className="text-foreground"
                          style={{ fontSize: 16, fontWeight: "600" }}
                          numberOfLines={1}
                        >
                          {problem.title}
                        </Text>
                        <Text
                          className="text-muted"
                          style={{ fontSize: 13 }}
                          numberOfLines={1}
                        >
                          {tags ? `${tags}   ` : ""}
                          {problem.acceptance_rate}% acceptance
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.muted}
                      />
                    </>
                  )}
                </Pressable>
              );
            })
          )}
        </Card.Body>
      </Card>
    </View>
  );
}
