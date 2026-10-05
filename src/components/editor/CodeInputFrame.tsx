import { useMemo } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  type TextStyle,
  View,
} from "react-native";
import { colors, fontFamily } from "../../theme";
import {
  highlightColors,
  tokenizeCode,
  type HighlightToken,
} from "../../lib/highlight";

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

const CODE_FONT_SIZE = 14;
const CODE_LINE_HEIGHT = 22;
const CODE_PADDING = 16;

const codeTextStyle: TextStyle = {
  fontFamily: monoFont,
  fontSize: CODE_FONT_SIZE,
  lineHeight: CODE_LINE_HEIGHT,
  letterSpacing: 0,
  padding: CODE_PADDING,
  textAlignVertical: "top",
};

type CodeInputFrameProps = {
  code: string;
  /** Language id used for highlighting (e.g. "python", "javascript"). */
  language: string;
  languageLabel: string;
  onCodeChange: (value: string) => void;
};

/**
 * Editor frame with syntax highlighting.
 *
 * Technique: the highlighted <Text> defines the layout height while a
 * transparent <TextInput> sits exactly on top of it (same font, size,
 * line-height and padding). The outer ScrollView scrolls both together,
 * so no scroll-syncing is needed and it works in Expo Go with zero
 * native dependencies.
 */
export function CodeInputFrame({
  code,
  language,
  languageLabel,
  onCodeChange,
}: CodeInputFrameProps) {
  const tokens: HighlightToken[] = useMemo(
    () => tokenizeCode(code, language),
    [code, language]
  );

  const lineCount = useMemo(
    () => (code ? code.split("\n").length : 1),
    [code]
  );
  const gutterWidth = Math.max(24, String(lineCount).length * 10 + 14);

  // A trailing newline collapses in <Text> — append a zero-width space
  // so the last empty line keeps its height and the gutter stays aligned.
  const needsTrailingSpace = code.endsWith("\n");

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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, minHeight: 280 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, flexDirection: "row", minHeight: 280 }}>
          {/* Gutter — line numbers aligned to the code's line-height. */}
          <View
            style={{
              width: gutterWidth,
              paddingTop: CODE_PADDING,
              paddingBottom: CODE_PADDING,
              paddingLeft: 10,
              paddingRight: 6,
              alignItems: "flex-end",
              borderRightWidth: 1,
              borderRightColor: colors.border,
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <Text
                key={i + 1}
                allowFontScaling={false}
                style={{
                  fontFamily: monoFont,
                  fontSize: 12,
                  lineHeight: CODE_LINE_HEIGHT,
                  color: colors.faint,
                }}
              >
                {i + 1}
              </Text>
            ))}
          </View>

          {/* Code area — highlight layer + transparent input overlay. */}
          <View style={{ flex: 1, position: "relative" }}>
            <Text
              allowFontScaling={false}
              selectable={false}
              style={[
                codeTextStyle,
                { color: highlightColors.plain, minHeight: 280 },
              ]}
            >
              {tokens.map((token, index) => (
                <Text
                  key={index}
                  style={{
                    color: highlightColors[token.type],
                    ...(token.type === "comment"
                      ? { fontStyle: "italic" as const }
                      : null),
                  }}
                >
                  {token.text}
                </Text>
              ))}
              {needsTrailingSpace ? <Text>{"\u200b"}</Text> : null}
              {code === "" ? <Text> </Text> : null}
            </Text>

            <TextInput
              value={code}
              onChangeText={onCodeChange}
              placeholder="Write your solution here…"
              placeholderTextColor={colors.faint}
              multiline
              scrollEnabled={false}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              allowFontScaling={false}
              underlineColorAndroid="transparent"
              accessibilityLabel="Code editor"
              selectionColor="rgba(0, 208, 158, 0.35)"
              cursorColor={colors.primary}
              style={[
                codeTextStyle,
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  color: "transparent",
                  backgroundColor: "transparent",
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
