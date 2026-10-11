import { Text, View } from "react-native";
import { fontFamily } from "../../theme";
import { PressableScale } from "../ui";

type AuthFooterProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

/** Bottom prompt row: muted text + link action. */
export function AuthFooter({ prompt, actionLabel, onPress }: AuthFooterProps) {
  return (
    <View className="mt-7 items-center gap-1.5">
      <Text
        className="text-muted"
        style={{
          fontFamily: fontFamily.regular,
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {prompt}
      </Text>
      <PressableScale onPress={onPress} hitSlop={8}>
        <Text
          className="text-link"
          style={{ fontFamily: fontFamily.bold, fontSize: 14, textAlign: "center" }}
        >
          {actionLabel}
        </Text>
      </PressableScale>
    </View>
  );
}
