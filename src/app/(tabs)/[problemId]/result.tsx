import { Platform, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, useThemeColor } from "heroui-native";
import { Screen, EmptyState } from "../../../components/ui";
import type { SubmitVerdict } from "../../../lib/submit";
import { colors } from "../../../theme";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

function parseVerdict(raw?: string): SubmitVerdict | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SubmitVerdict;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.status === "string" &&
      Array.isArray(parsed.results)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function ResultScreen() {
  const { problemId, verdict: verdictParam, title, submitError } =
    useLocalSearchParams<{
      problemId: string;
      verdict?: string;
      title?: string;
      submitError?: string;
    }>();
  const router = useRouter();
  const accentForeground = useThemeColor("accent-foreground");

  const goBackToEditor = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    const id = Array.isArray(problemId) ? problemId[0] : problemId;
    if (id) {
      router.replace({
        pathname: "/(tabs)/[problemId]/codeEditor",
        params: { problemId: id },
      });
    }
  };

  const verdict = parseVerdict(
    Array.isArray(verdictParam) ? verdictParam[0] : verdictParam,
  );
  const submitErrorText = Array.isArray(submitError)
    ? submitError[0]
    : submitError;

  // Client-side failure (network/auth) — no verdict object to show.
  if (!verdict) {
    return (
      <Screen>
        <View className="mb-5 flex-row items-center gap-3">
          <Button
            variant="ghost"
            isIconOnly
            accessibilityLabel="Back to editor"
            onPress={goBackToEditor}
          >
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </Button>
          <Text
            className="text-foreground"
            style={{ fontSize: 20, fontWeight: "800" }}
          >
            Result
          </Text>
        </View>
        <EmptyState
          title={submitErrorText ? "Submission failed" : "No result yet"}
          description={
            submitErrorText ??
            "Submit your code from the editor to see the verdict here."
          }
          actionLabel="Back to Editor"
          onAction={goBackToEditor}
        />
      </Screen>
    );
  }

  const verdictColor = verdict.solved ? colors.success : colors.danger;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back to editor */}
        <View className="mb-5 flex-row items-center gap-3">
          <Button
            variant="ghost"
            isIconOnly
            accessibilityLabel="Back to editor"
            onPress={goBackToEditor}
          >
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </Button>
          <View className="flex-1">
            <Text
              className="text-foreground"
              style={{ fontSize: 20, fontWeight: "800" }}
            >
              Result
            </Text>
            {title ? (
              <Text
                className="mt-0.5 text-muted"
                style={{ fontSize: 13 }}
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Main verdict section */}
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
                style={{ fontSize: 18, fontWeight: "800", color: verdictColor }}
              >
                {verdict.status}
              </Text>
              <Text className="text-muted" style={{ fontSize: 13 }}>
                {verdict.passed}/{verdict.total} passed
              </Text>
            </View>
          </View>
        </View>

        {/* Per-case breakdown */}
        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          {verdict.results.map((result) => {
            const passed = result.outcome === "accepted";
            return (
              <View
                key={result.index}
                className="border-b border-border px-4 py-3"
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={
                      passed
                        ? "checkmark-circle"
                        : result.outcome === "wrong-answer"
                          ? "close-circle"
                          : "alert-circle"
                    }
                    size={15}
                    color={passed ? colors.success : colors.danger}
                  />
                  <Text
                    className="text-foreground"
                    style={{ fontSize: 13, fontWeight: "600" }}
                  >
                    Case {result.index + 1}
                  </Text>
                  {result.timeSec != null ? (
                    <Text
                      className="ml-auto text-muted"
                      style={{ fontSize: 12 }}
                    >
                      {result.timeSec.toFixed(3)} s
                    </Text>
                  ) : null}
                </View>
                {passed ? null : (
                  <Text
                    className="mt-1 text-muted"
                    style={{
                      fontSize: 12,
                      lineHeight: 18,
                      fontFamily: monoFont,
                    }}
                  >
                    expected {result.expectedOutput} · got{" "}
                    {result.actualOutput || result.stderr || "∅"}
                    {result.outcome === "error" && result.status?.description
                      ? ` (${result.status.description})`
                      : ""}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        <Button
          variant="primary"
          size="lg"
          className="mt-4 w-full"
          onPress={goBackToEditor}
        >
          <Ionicons name="code-slash" size={18} color={accentForeground} />
          <Button.Label>Back to Editor</Button.Label>
        </Button>
      </ScrollView>
    </Screen>
  );
}
