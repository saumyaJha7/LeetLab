import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  problem_id: number;
  title: string;
  description: string;
  tags: string[];
  examples: Example[];
  hints: string[];
  constraints: string[];
  languages: string[];
  acceptance_rate: number;
}

export default function ProblemDetailScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (problemId) fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("problems")
      .select("*")
      .eq("problem_id", problemId)
      .single();

    if (error) {
      console.error("Error fetching problem:", error);
    } else {
      setProblem(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#4DABF7" style={{ marginTop: 50 }} />
      </View>
    );
  }

  if (!problem) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Problem not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header: back button + screen title */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#FF6B6B" />
          </Pressable>
          <Text style={styles.screenTitle}>Problem Detail</Text>
        </View>

        {/* Title card */}
        <View style={styles.titleCard}>
          <Text style={styles.problemTitle}>{problem.title}</Text>
          <View style={styles.titleMeta}>
            <View style={styles.tagsRow}>
              {problem.tags?.map((tag, i) => (
                <View key={i} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.acceptance}>{problem.acceptance_rate}%</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{problem.description}</Text>
        </View>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Examples</Text>
            {problem.examples.map((ex, i) => (
              <View key={i} style={styles.exampleCard}>
                <Text style={styles.exampleLabel}>Example {i + 1}:</Text>
                <Text style={styles.exampleLine}>
                  <Text style={styles.exampleKey}>Input: </Text>
                  {ex.input}
                </Text>
                <Text style={styles.exampleLine}>
                  <Text style={styles.exampleKey}>Output: </Text>
                  {ex.output}
                </Text>
                {ex.explanation && (
                  <Text style={styles.exampleLine}>
                    <Text style={styles.exampleKey}>Explanation: </Text>
                    {ex.explanation}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hints</Text>
            {problem.hints.map((hint, i) => (
              <View key={i} style={styles.hintRow}>
                <Text style={styles.hintBullet}>💡</Text>
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Constraints</Text>
            {problem.constraints.map((c, i) => (
              <Text key={i} style={styles.constraintText}>• {c}</Text>
            ))}
          </View>
        )}

        {/* Languages / Code */}
        {problem.languages && problem.languages.length > 0 && (
          <View style={styles.codeCard}>
            <Text style={styles.codeTitle}>Supported Languages</Text>
            <View style={styles.langRow}>
              {problem.languages.map((lang, i) => (
                <View key={i} style={styles.langChip}>
                  <Text style={styles.langText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Pressable
          onPress={() => router.push(`/(tabs)/problems/${problemId}/codeEditor`)}
          style={({ pressed }) => [styles.codeButton, pressed && styles.pressedCodeButton]}
        >
          <Feather name="code" size={18} color="#121212" />
          <Text style={styles.codeButtonText}>Open Code Editor</Text>
        </Pressable>
      </ScrollView>
    </View>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
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
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  /* Title card */
  titleCard: {
    borderWidth: 1.5,
    borderColor: "#4DABF7",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  problemTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  titleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    backgroundColor: "rgba(81, 207, 102, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    color: "#51CF66",
    fontWeight: "600",
  },
  acceptance: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFB800",
  },

  /* Sections */
  section: {
    borderWidth: 1.5,
    borderColor: "#333",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4DABF7",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: "#CCCCCC",
    lineHeight: 24,
  },

  /* Examples */
  exampleCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  exampleLine: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
    marginBottom: 4,
  },
  exampleKey: {
    fontWeight: "700",
    color: "#4DABF7",
  },

  /* Hints */
  hintRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  hintBullet: {
    fontSize: 16,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
  },

  /* Constraints */
  constraintText: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
    marginBottom: 4,
  },

  /* Code / Languages */
  codeCard: {
    borderWidth: 1.5,
    borderColor: "#4DABF7",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  langRow: {
    flexDirection: "row",
    gap: 12,
  },
  langChip: {
    backgroundColor: "rgba(77, 171, 247, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  langText: {
    fontSize: 14,
    color: "#4DABF7",
    fontWeight: "600",
  },
  codeButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#4DABF7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  pressedCodeButton: {
    opacity: 0.72,
  },
  codeButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Error / empty */
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
