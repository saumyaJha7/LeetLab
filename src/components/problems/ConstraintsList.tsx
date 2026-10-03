import { Platform, Text } from "react-native";
import { DetailSection } from "./DetailSection";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

type ConstraintsListProps = {
  constraints: string[];
};

/** Constraints section: mono bullet lines.
 * Returns null when empty so callers can render unconditionally. */
export function ConstraintsList({ constraints }: ConstraintsListProps) {
  if (!constraints || constraints.length === 0) {
    return null;
  }

  return (
    <DetailSection title="Constraints">
      {constraints.map((constraint, index) => (
        <Text
          key={index}
          className="text-muted"
          style={{ fontSize: 14, lineHeight: 22, fontFamily: monoFont }}
        >
          • {constraint}
        </Text>
      ))}
    </DetailSection>
  );
}
