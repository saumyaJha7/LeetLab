import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Screen, EmptyState, LoadingState } from "../../../components/ui";
import {
  CodeInputFrame,
  EditorHeader,
  EditorToolbar,
  type LanguageOption,
} from "../../../components/editor";
import { useProblem } from "../../../hooks/useProblem";
import { isJudgeLanguage } from "../../../lib/judge";
import { submitSolution } from "../../../lib/submit";
import { SubmitFeedback } from "../../../components/editor";
import { colors, spacing } from "../../../theme";

const FALLBACK_LANGUAGE = "javascript";

export default function CodeEditorScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { problem, loading } = useProblem(problemId);

  const [selected, setSelected] = useState<LanguageOption | undefined>(
    undefined
  );
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
    try {
      const result = await submitSolution({
        problemId: problem.problem_id,
        language,
        sourceCode: code,
      });
      setSubmitting(false);
      router.push({
        pathname: "/(tabs)/[problemId]/result",
        params: {
          problemId: String(problem.problem_id),
          verdict: JSON.stringify(result),
          title: problem.title,
        },
      });
    } catch (err) {
      setSubmitting(false);
      router.push({
        pathname: "/(tabs)/[problemId]/result",
        params: {
          problemId: String(problem.problem_id),
          title: problem.title,
          submitError:
            err instanceof Error ? err.message : "Submit failed. Please try again.",
        },
      });
    }
  };

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
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 960,
            alignSelf: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          <EditorHeader
            problemTitle={problem.title}
            submitting={submitting}
            onBack={() => router.back()}
            onSubmit={handleSubmit}
          />

          <EditorToolbar
            languages={languages}
            selected={selected}
            onLanguageChange={handleLanguageChange}
            tags={problem.tags ?? []}
          />

          <CodeInputFrame
            code={code}
            language={selected?.value ?? FALLBACK_LANGUAGE}
            languageLabel={selected?.label ?? FALLBACK_LANGUAGE}
            onCodeChange={(value) => {
              setCode(value);
              setSubmitError(null);
            }}
          />

          <SubmitFeedback
            submitting={submitting}
            submitError={submitError}
            onRetry={handleSubmit}
          />

          {/* Verdict now lives on the dedicated result screen. */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
