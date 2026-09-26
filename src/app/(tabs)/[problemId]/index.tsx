import { Platform, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, useThemeColor } from "heroui-native";
import { Screen, EmptyState, EnteringView, LoadingState } from "../../../components/ui";
import {
  DetailSection,
  ExampleBlock,
  ProblemTags,
} from "../../../components/problems";
import { useProblem } from "../../../hooks/useProblem";
import { colors } from "../../../theme";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

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
        {/* Header: neutral back + title */}
        <View className="mb-5 flex-row items-center gap-3">
          <Button
            variant="ghost"
            isIconOnly
            accessibilityLabel="Go back"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </Button>
          <Text
            className="text-foreground"
            style={{ fontSize: 20, fontWeight: "800" }}
          >
            Problem
          </Text>
        </View>

        {/* Title block */}
        <EnteringView index={0}>
          <View className="mb-5 gap-3">
            <Text
              className="text-foreground"
              style={{ fontSize: 24, fontWeight: "800", lineHeight: 30 }}
            >
              {problem.title}
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              <ProblemTags tags={problem.tags ?? []} />
              <Text className="text-muted" style={{ fontSize: 13 }}>
                {problem.acceptance_rate}% acceptance
              </Text>
            </View>
          </View>
        </EnteringView>

        <DetailSection title="Description" index={1}>
          <Text
            className="text-foreground"
            style={{ fontSize: 15, lineHeight: 24 }}
          >
            {problem.description}
          </Text>
        </DetailSection>

        {problem.examples && problem.examples.length > 0 ? (
          <DetailSection title="Examples" index={2}>
            {problem.examples.map((example, index) => (
              <ExampleBlock
                key={index}
                example={example}
                index={index}
              />
            ))}
          </DetailSection>
        ) : null}

        {problem.hints && problem.hints.length > 0 ? (
          <DetailSection title="Hints" index={3}>
            {problem.hints.map((hint, index) => (
              <View key={index} className="flex-row items-start gap-2.5">
                <Ionicons
                  name="bulb-outline"
                  size={16}
                  color={colors.primary}
                  style={{ marginTop: 3 }}
                />
                <Text
                  className="flex-1 text-muted"
                  style={{ fontSize: 14, lineHeight: 22 }}
                >
                  {hint}
                </Text>
              </View>
            ))}
          </DetailSection>
        ) : null}

        {problem.constraints && problem.constraints.length > 0 ? (
          <DetailSection title="Constraints" index={4}>
            {problem.constraints.map((constraint, index) => (
              <Text
                key={index}
                className="text-muted"
                style={{ fontSize: 14, lineHeight: 22, fontFamily: monoFont }}
              >
                • {constraint}
              </Text>
            ))}
          </DetailSection>
        ) : null}

        {problem.languages && problem.languages.length > 0 ? (
          <DetailSection title="Supported languages" index={4}>
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
