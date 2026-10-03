import { ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, useThemeColor } from "heroui-native";
import { Screen, EmptyState } from "../../../components/ui";
import { CaseList, ResultHeader, VerdictCard } from "../../../components/result";
import type { SubmitVerdict } from "../../../lib/submit";

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
        <ResultHeader onBack={goBackToEditor} />
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

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <ResultHeader
          problemTitle={Array.isArray(title) ? title[0] : title}
          onBack={goBackToEditor}
        />

        <VerdictCard verdict={verdict} />
        <CaseList results={verdict.results} />

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
