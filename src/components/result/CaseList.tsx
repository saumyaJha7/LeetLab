import { Platform, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SubmitVerdict } from "../../lib/submit";
import { colors } from "../../theme";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

type CaseListProps = {
  results: SubmitVerdict["results"];
};

function CaseRow({ result }: { result: SubmitVerdict["results"][number] }) {
  const passed = result.outcome === "accepted";

  return (
    <View className="border-b border-border px-4 py-3">
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
        <Text className="text-foreground" style={{ fontSize: 13, fontWeight: "600" }}>
          Case {result.index + 1}
        </Text>
        {result.timeSec != null ? (
          <Text className="ml-auto text-muted" style={{ fontSize: 12 }}>
            {result.timeSec.toFixed(3)} s
          </Text>
        ) : null}
      </View>
      {passed ? null : (
        <Text
          className="mt-1 text-muted"
          style={{ fontSize: 12, lineHeight: 18, fontFamily: monoFont }}
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
}

/** Per-case breakdown list inside a rounded card shell. */
export function CaseList({ results }: CaseListProps) {
  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-surface">
      {results.map((result) => (
        <CaseRow key={result.index} result={result} />
      ))}
    </View>
  );
}
