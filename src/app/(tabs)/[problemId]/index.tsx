import { ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, useThemeColor } from "heroui-native";
import { Screen, EmptyState, LoadingState } from "../../../components/ui";
import {
  DetailSection,
  ExampleBlock,
  HintsList,
  ConstraintsList,
  ProblemDescription,
  ProblemDetailHeader,
  ProblemTags,
  ProblemTitleBlock,
} from "../../../components/problems";
import { useProblem } from "../../../hooks/useProblem";

export default function ProblemDetailScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();
  const router = useRouter();
  const accentForeground = useThemeColor("accent-foreground");
  const { problem, loading } = useProblem(problemId);

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading problem…" />
      </Screen>
    );
  }

  if (!problem) {
    return (
      <Screen>
        <EmptyState
          title="Problem not found"
          description="It may have been removed or the link is wrong."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <ProblemDetailHeader onBack={() => router.back()} />

        <ProblemTitleBlock
          title={problem.title}
          tags={problem.tags ?? []}
          acceptanceRate={problem.acceptance_rate}
        />

        <ProblemDescription text={problem.description} />

        {problem.examples && problem.examples.length > 0 ? (
          <DetailSection title="Examples">
            {problem.examples.map((example, index) => (
              <ExampleBlock
                key={index}
                example={example}
                index={index}
              />
            ))}
          </DetailSection>
        ) : null}

        <HintsList hints={problem.hints ?? []} />
        <ConstraintsList constraints={problem.constraints ?? []} />

        {problem.languages && problem.languages.length > 0 ? (
          <DetailSection title="Supported languages">
            <ProblemTags tags={problem.languages} size="md" />
          </DetailSection>
        ) : null}

        <Button
          variant="primary"
          size="lg"
          className="mt-1 w-full"
          onPress={() => router.push(`/(tabs)/${problemId}/codeEditor`)}
        >
          <Ionicons name="code-slash" size={18} color={accentForeground} />
          <Button.Label>Open Code Editor</Button.Label>
        </Button>
      </ScrollView>
    </Screen>
  );
}
