import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DetailSection } from "./DetailSection";
import { colors, fontFamily } from "../../theme";

type HintsListProps = {
  hints: string[];
};

/** Hints section: bulb icon + muted text per hint.
 * Returns null when there are no hints so callers can
 * render it unconditionally. */
export function HintsList({ hints }: HintsListProps) {
  if (!hints || hints.length === 0) {
    return null;
  }

  return (
    <DetailSection title="Hints">
      {hints.map((hint, index) => (
        <View key={index} className="flex-row items-start gap-2.5">
          <Ionicons
            name="bulb-outline"
            size={16}
            color={colors.primary}
            style={{ marginTop: 3 }}
          />
          <Text
            className="flex-1 text-muted"
            style={{ fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 22 }}
          >
            {hint}
          </Text>
        </View>
      ))}
    </DetailSection>
  );
}
