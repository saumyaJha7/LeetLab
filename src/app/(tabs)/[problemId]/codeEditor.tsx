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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button, useThemeColor } from "heroui-native";
import { Screen, EmptyState, LoadingState } from "../../../components/ui";
import { ProblemTags } from "../../../components/problems";
import {
  LanguageSelect,
  type LanguageOption,
} from "../../../components/editor";
import { useProblem } from "../../../hooks/useProblem";
import { colors } from "../../../theme";

const FALLBACK_LANGUAGE = "JavaScript";

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
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (problem && !selected) {
      const first = problem.languages?.[0] ?? FALLBACK_LANGUAGE;
      setSelected({ value: first, label: first });
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
      setSelected(next);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen>
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

        {/* Editor frame */}
        <View className="min-h-65 flex-1 overflow-hidden rounded-2xl border border-border bg-surface">
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
              setStatus(null);
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

        {/* Footer */}
        <View
          style={{
            paddingTop: 14,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          {status ? (
            <Text
              className="mb-2 text-center text-muted"
              style={{ fontSize: 12 }}
            >
              {status}
            </Text>
          ) : null}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onPress={() =>
              setStatus(
                code.trim() ? "Draft ready to submit" : "Write some code first"
              )
            }
          >
            <Button.Label>Submit</Button.Label>
            <Ionicons
              name="send"
              size={16}
              color={accentForeground}
            />
          </Button>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
