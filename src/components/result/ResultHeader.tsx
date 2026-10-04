import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "heroui-native";
import { colors, fontFamily } from "../../theme";

type ResultHeaderProps = {
  problemTitle?: string | null;
  onBack: () => void;
};

/** Result header: back-to-editor button + "Result" title
 * with optional problem subtitle. */
export function ResultHeader({ problemTitle, onBack }: ResultHeaderProps) {
  return (
    <View className="mb-5 flex-row items-center gap-3">
      <Button
        variant="ghost"
        isIconOnly
        accessibilityLabel="Back to editor"
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </Button>
      <View className="flex-1">
        <Text
          className="text-foreground"
          style={{ fontFamily: fontFamily.extraBold, fontSize: 20 }}
        >
          Result
        </Text>
        {problemTitle ? (
          <Text
            className="mt-0.5 text-muted"
            style={{ fontFamily: fontFamily.regular, fontSize: 13 }}
            numberOfLines={1}
          >
            {problemTitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
