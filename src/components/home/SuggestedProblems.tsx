import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "heroui-native";
import { ErrorState, LoadingState, SectionTitle } from "../ui";
import { ProblemRow } from "../problems";
import type { ProblemSummary } from "../../stores/useProblemsStore";

type SuggestedProblemsProps = {
  problems: ProblemSummary[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

/** "Start here" card with tappable problem rows. */
export function SuggestedProblems({
  problems,
  loading,
  error,
  onRetry,
}: SuggestedProblemsProps) {
  const router = useRouter();

  return (
    <View className="mb-6">
      <SectionTitle
        title="Start here"
        actionLabel="View all"
        onAction={() => router.push("/(tabs)/problems")}
      />

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
