import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button, Spinner, useThemeColor } from "heroui-native";
import { Screen, EmptyState, LoadingState } from "../../../components/ui";
import { ProblemTags } from "../../../components/problems";
import {
  LanguageSelect,
  type LanguageOption,
} from "../../../components/editor";
import { useProblem } from "../../../hooks/useProblem";
import { isJudgeLanguage } from "../../../lib/judge";
import { submitSolution, type SubmitVerdict } from "../../../lib/submit";
import { colors, spacing } from "../../../theme";

const FALLBACK_LANGUAGE = "javascript";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

export default function CodeEditorScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const accentForeground = useThemeColor("accent-foreground");
  const { problem, loading } = useProblem(problemId);

  const [selected, setSelected] = useState<LanguageOption | undefined>(
    undefined
  );
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState<SubmitVerdict | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /** Starter code for a language — "" when the problem ships none. */
  const snippetFor = (language: string | undefined) =>
    (language && problem?.code_snippets?.[language]) || "";

  useEffect(() => {
    if (problem && !selected) {
      const first = problem.languages?.[0] ?? FALLBACK_LANGUAGE;
      setSelected({ value: first, label: first });
      setCode(problem.code_snippets?.[first] || "");
    }
  }, [problem, selected]);

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading editor…" />
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

  const languages =
    problem.languages?.length ? problem.languages : [FALLBACK_LANGUAGE];

  const handleLanguageChange = (next: LanguageOption | undefined) => {
    if (next) {
      // Swap in the new language's starter code only when the user
      // hasn't typed anything of their own (empty or untouched snippet).
      setCode((prev) => {
        if (!prev.trim() || prev === snippetFor(selected?.value)) {
          return snippetFor(next.value);
        }
        return prev;
      });
      setSelected(next);
      setVerdict(null);
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!code.trim()) {
      setSubmitError("Write some code first");
      return;
    }
    const language = selected?.value ?? FALLBACK_LANGUAGE;
    if (!isJudgeLanguage(language)) {
      setSubmitError(`"${language}" isn't runnable yet`);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setVerdict(null);
    try {
      const result = await submitSolution({
        problemId: problem.problem_id,
        language,
        sourceCode: code,
      });
      setVerdict(result);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Submit failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const verdictColor = !verdict
    ? colors.muted
    : verdict.solved
      ? colors.success
      : colors.danger;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center gap-3">
          <Button
            variant="ghost"
            isIconOnly
            accessibilityLabel="Go back"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </Button>
          <View className="flex-1">
            <Text
              className="text-foreground"
              style={{ fontSize: 20, fontWeight: "800" }}
            >
              Code Editor
            </Text>
            <Text
              className="mt-0.5 text-muted"
              style={{ fontSize: 13 }}
              numberOfLines={1}
            >
              {problem.title}
            </Text>
          </View>
          <Button
            variant="primary"
            size="sm"
            accessibilityLabel="Submit solution"
            isDisabled={submitting}
            onPress={handleSubmit}
          >
            <Button.Label>{submitting ? "Running…" : "Submit"}</Button.Label>
            <Ionicons name="send" size={14} color={accentForeground} />
          </Button>
        </View>

        {/* Toolbar: language + tags */}
        <View className="mb-3 flex-row items-center gap-2.5">
          <LanguageSelect
            languages={languages}
            selected={selected}
            onChange={handleLanguageChange}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 4 }}
            style={{ flex: 1 }}
          >
            <ProblemTags tags={problem.tags ?? []} />
          </ScrollView>
        </View>

        {/* Editor frame — no min-height: flex shrinks it when the
            keyboard opens so the footer stays visible above it.
            TextInput scrolls internally at small heights. */}
        <View className="flex-1 overflow-hidden rounded-2xl border border-border bg-surface">
          <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <Text
              className="text-foreground"
              style={{ fontSize: 13, fontWeight: "700" }}
            >
              Solution
            </Text>
            <Text className="text-muted" style={{ fontSize: 12 }}>
              {selected?.label ?? FALLBACK_LANGUAGE}
            </Text>
          </View>
          <TextInput
            value={code}
            onChangeText={(value) => {
              setCode(value);
              setVerdict(null);
              setSubmitError(null);
            }}
            placeholder="Write your solution here…"
            placeholderTextColor={colors.faint}
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            style={{
              flex: 1,
              padding: 16,
              color: colors.foreground,
              fontFamily: monoFont,
              fontSize: 14,
              lineHeight: 22,
            }}
          />
        </View>

        {/* Verdict area — only renders during/after a submit attempt */}
        {submitting ? (
          <View
            style={{ paddingTop: 14 }}
            className="flex-row items-center justify-center gap-2"
          >
            <Spinner color={colors.secondary} />
            <Text className="text-muted" style={{ fontSize: 12 }}>
              Running test cases…
            </Text>
          </View>
        ) : null}

        {submitError ? (
          <View className="mt-3 flex-row items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <Ionicons
              name="alert-circle"
              size={18}
              color={colors.danger}
            />
            <Text
              className="flex-1"
              style={{ fontSize: 13, color: colors.danger }}
              numberOfLines={2}
            >
              {submitError}
            </Text>
            <Button variant="secondary" size="sm" onPress={handleSubmit}>
              <Button.Label>Retry</Button.Label>
            </Button>
          </View>
        ) : null}

        {verdict ? (
          <View className="mt-3 overflow-hidden rounded-2xl border border-border bg-surface">
            <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
              <Text style={{ fontSize: 14, fontWeight: "800", color: verdictColor }}>
                {verdict.status}
              </Text>
              <Text className="text-muted" style={{ fontSize: 12 }}>
                {verdict.passed}/{verdict.total} passed
              </Text>
            </View>
            <ScrollView style={{ maxHeight: 180 }}>
              {verdict.results.map((result) => {
                const passed = result.outcome === "accepted";
                return (
                  <View
                    key={result.index}
                    className="border-b border-border px-4 py-2.5"
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
                        numberOfLines={3}
                      >
                        expected {result.expectedOutput} · got{" "}
                        {result.actualOutput || result.stderr || "∅"}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
