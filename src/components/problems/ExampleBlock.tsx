import { Platform, Text, View } from "react-native";
import type { Example } from "../../hooks/useProblem";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

function ExampleLine({ label, value }: { label: string; value: string }) {
  return (
    <Text
      className="text-foreground"
      style={{ fontSize: 14, lineHeight: 22 }}
    >
      <Text className="text-muted" style={{ fontWeight: "700" }}>
        {label}:{" "}
      </Text>
      <Text style={{ fontFamily: monoFont }}>{value}</Text>
    </Text>
  );
}

/** Single example block: Input / Output / optional Explanation. */
export function ExampleBlock({
  example,
  index,
}: {
  example: Example;
  index: number;
}) {
  return (
    <View className="gap-1.5 rounded-xl bg-surface-secondary p-3.5">
      <Text
        className="text-foreground"
        style={{ fontSize: 14, fontWeight: "700" }}
      >
        Example {index + 1}
      </Text>
      <ExampleLine label="Input" value={example.input} />
      <ExampleLine label="Output" value={example.output} />
      {example.explanation ? (
        <ExampleLine label="Explanation" value={example.explanation} />
      ) : null}
    </View>
  );
}
