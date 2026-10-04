import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, useThemeColor } from "heroui-native";
import { colors, fontFamily } from "../../theme";

type EditorHeaderProps = {
  problemTitle: string;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

/** Editor top bar: back button, "Code Editor" + problem title,
 * and the Submit action. */
export function EditorHeader({
  problemTitle,
  submitting,
  onBack,
  onSubmit,
}: EditorHeaderProps) {
  const accentForeground = useThemeColor("accent-foreground");

  return (
    <View className="mb-4 flex-row items-center gap-3">
      <Button
        variant="ghost"
        isIconOnly
        accessibilityLabel="Go back"
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </Button>
      <View className="flex-1">
        <Text
          className="text-foreground"
          style={{ fontFamily: fontFamily.extraBold, fontSize: 20 }}
        >
          Code Editor
        </Text>
        <Text
          className="mt-0.5 text-muted"
          style={{ fontFamily: fontFamily.regular, fontSize: 13 }}
          numberOfLines={1}
        >
          {problemTitle}
        </Text>
      </View>
      <Button
        variant="primary"
        size="sm"
        accessibilityLabel="Submit solution"
        isDisabled={submitting}
        onPress={onSubmit}
      >
        <Button.Label>{submitting ? "Running…" : "Submit"}</Button.Label>
        <Ionicons name="send" size={14} color={accentForeground} />
      </Button>
    </View>
  );
}
