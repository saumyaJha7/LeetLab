import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "heroui-native";
import { ErrorState, LoadingState, PressableScale } from "../ui";
import { ProblemRow } from "../problems";
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
        <PressableScale
          onPress={() => router.push("/(tabs)/problems")}
          hitSlop={8}
        >
          <Text
            className="text-link"
            style={{ fontSize: 14, fontWeight: "700" }}
          >
            View all
          </Text>
        </PressableScale>
      </View>

      <Card>
        <Card.Body>
          {loading ? (
            <LoadingState label="Finding problems…" />
          ) : error ? (
            <ErrorState description={error} onRetry={onRetry} />
          ) : problems.length === 0 ? (
            <Text className="py-6 text-center text-muted" style={{ fontSize: 14 }}>
              No problems yet. Check back soon.
            </Text>
          ) : (
            problems.map((problem, index) => (
              <ProblemRow
                key={problem.problem_id}
                problem={problem}
                showDivider={index < problems.length - 1}
              />
            ))
          )}
        </Card.Body>
      </Card>
    </View>
  );
}
