import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "heroui-native";
import { colors, fontFamily } from "../../theme";

type ProblemDetailHeaderProps = {
  onBack: () => void;
};

/** Detail header: neutral back button + "Problem" label. */
export function ProblemDetailHeader({ onBack }: ProblemDetailHeaderProps) {
  return (
    <View className="mb-5 flex-row items-center gap-3">
      <Button
        variant="ghost"
        isIconOnly
        accessibilityLabel="Go back"
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </Button>
      <Text
        className="text-foreground"
        style={{ fontFamily: fontFamily.extraBold, fontSize: 20 }}
      >
        Problem
      </Text>
    </View>
  );
}
