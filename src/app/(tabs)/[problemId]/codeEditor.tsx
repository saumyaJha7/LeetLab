import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase";

interface Problem {
  problem_id: number;
  title: string;
  tags?: string[];
  languages?: string[];
}

const FALLBACK_LANGUAGE = "JavaScript";

export default function CodeEditorScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(FALLBACK_LANGUAGE);
  const [code, setCode] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");

  useEffect(() => {
    if (!problemId) {
      setLoading(false);
      return;
    }

    const fetchProblem = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("problems")
        .select("problem_id, title, tags, languages")
        .eq("problem_id", problemId)
        .single();

      if (error) {
        console.error("Error fetching problem for editor:", error);
      } else if (data) {
        const fetchedProblem = data as Problem;
        setProblem(fetchedProblem);
        setSelectedLanguage(fetchedProblem.languages?.[0] ?? FALLBACK_LANGUAGE);
      }

      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  const languages = problem?.languages?.length ? problem.languages : [FALLBACK_LANGUAGE];

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(selectedLanguage);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % languages.length;
    setSelectedLanguage(languages[nextIndex]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#4DABF7" />
      </View>
    );
  }

  if (!problem) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Problem not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#FF6B6B" />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.screenTitle}>Code Editor</Text>
          <Text style={styles.problemTitle} numberOfLines={1}>{problem.title}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <Pressable
          onPress={cycleLanguage}
          style={({ pressed }) => [styles.languageButton, pressed && styles.pressedControl]}
        >
          <Feather name="code" size={15} color="#4DABF7" />
          <Text style={styles.controlText}>{selectedLanguage}</Text>
          <Feather name="chevron-down" size={15} color="#8B95A5" />
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContent}
          style={styles.tagsScroll}
        >
          {(problem.tags?.length ? problem.tags : ["Problem"]).map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.editorFrame}>
        <View style={styles.editorHeader}>
          <Text style={styles.editorLabel}>Solution</Text>
          <Text style={styles.editorHint}>Editable draft</Text>
        </View>
        <TextInput
          value={code}
          onChangeText={(value) => {
            setCode(value);
            setSubmissionStatus("");
          }}
          placeholder="Write your solution here..."
          placeholderTextColor="#687386"
          multiline
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          style={styles.editorInput}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {submissionStatus ? <Text style={styles.statusText}>{submissionStatus}</Text> : null}
        <Pressable
          onPress={() => setSubmissionStatus(code.trim() ? "Draft ready to submit" : "Write some code first")}
          style={({ pressed }) => [styles.submitButton, pressed && styles.pressedSubmitButton]}
        >
          <Text style={styles.submitText}>Submit</Text>
          <Feather name="arrow-up-right" size={18} color="#121212" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCopy: {
    flex: 1,
  },
  screenTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  problemTitle: {
    color: "#8B95A5",
    fontSize: 13,
    marginTop: 3,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 14,
  },
  languageButton: {
    minHeight: 38,
    borderWidth: 1,
    borderColor: "#4DABF7",
    borderRadius: 8,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  tagsScroll: {
    flex: 1,
  },
  tagsContent: {
    gap: 8,
    paddingRight: 2,
  },
  tagChip: {
    minHeight: 32,
    justifyContent: "center",
    backgroundColor: "rgba(81, 207, 102, 0.14)",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  tagText: {
    color: "#51CF66",
    fontSize: 12,
    fontWeight: "600",
  },
  controlText: {
    color: "#D7E3F4",
    fontSize: 13,
    fontWeight: "600",
  },
  pressedControl: {
    opacity: 0.7,
  },
  editorFrame: {
    flex: 1,
    minHeight: 260,
    marginHorizontal: 24,
    borderWidth: 1.5,
    borderColor: "#4DABF7",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#171B22",
  },
  editorHeader: {
    minHeight: 40,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#29313D",
  },
  editorLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  editorHint: {
    color: "#687386",
    fontSize: 12,
  },
  editorInput: {
    flex: 1,
    color: "#D7E3F4",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
    fontSize: 14,
    lineHeight: 22,
    padding: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  statusText: {
    color: "#8B95A5",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#51CF66",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  pressedSubmitButton: {
    opacity: 0.72,
  },
  submitText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#8B95A5",
    fontSize: 18,
    marginBottom: 16,
  },
  backLink: {
    paddingVertical: 8,
  },
  backLinkText: {
    color: "#4DABF7",
    fontSize: 16,
    fontWeight: "600",
  },
});