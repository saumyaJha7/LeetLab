import { Platform, Text, TextInput, View } from "react-native";
import { colors, fontFamily } from "../../theme";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

type CodeInputFrameProps = {
  code: string;
  languageLabel: string;
  onCodeChange: (value: string) => void;
};

/** Editor frame: "Solution" header + mono multiline input.
 * Flex-shrinks when the keyboard opens so the footer stays
 * visible above it; the TextInput scrolls internally. */
export function CodeInputFrame({
  code,
  languageLabel,
  onCodeChange,
}: CodeInputFrameProps) {
  return (
    <View className="flex-1 overflow-hidden rounded-2xl border border-border bg-surface">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Text
          className="text-foreground"
          style={{ fontFamily: fontFamily.bold, fontSize: 13 }}
        >
          Solution
        </Text>
        <Text
          className="text-muted"
          style={{ fontFamily: fontFamily.regular, fontSize: 12 }}
        >
          {languageLabel}
        </Text>
      </View>
      <TextInput
        value={code}
        onChangeText={onCodeChange}
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
  );
}
