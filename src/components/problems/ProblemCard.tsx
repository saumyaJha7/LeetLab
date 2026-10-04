import { Text } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "heroui-native";
import { PressableScale } from "../ui";
import { DifficultyBadge } from "./DifficultyBadge";
import { ProblemTags } from "./ProblemTags";
import type { ProblemSummary } from "../../stores/useProblemsStore";

type ProblemCardProps = {
  problem: ProblemSummary;
};

/** Standalone problem card: title + difficulty badge + tag chips. */
export function ProblemCard({ problem }: ProblemCardProps) {
  const router = useRouter();

  return (
    <PressableScale
      onPress={() => router.push(`/(tabs)/${problem.problem_id}`)}
    >
      <Card>
        <Card.Body className="gap-2.5">
          <Text
            className="text-foreground"
            style={{ fontSize: 16, fontWeight: "600" }}
            numberOfLines={2}
          >
            {problem.title}
          </Text>
          <DifficultyBadge acceptanceRate={problem.acceptance_rate} />
          <ProblemTags tags={(problem.tags ?? []).slice(0, 3)} />
        </Card.Body>
      </Card>
    </PressableScale>
  );
}
