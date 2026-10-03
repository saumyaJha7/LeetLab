import { Text, View } from "react-native";
import { PressableScale } from "../ui";

type AuthFooterProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

/** Bottom prompt row: muted text + link action. */
export function AuthFooter({ prompt, actionLabel, onPress }: AuthFooterProps) {
  return (
    <View className="mt-6 flex-row items-center justify-center">
      <Text className="text-muted" style={{ fontSize: 14 }}>
        {prompt}{" "}
      </Text>
      <PressableScale onPress={onPress} hitSlop={8}>
        <Text className="text-link" style={{ fontSize: 14, fontWeight: "800" }}>
          {actionLabel}
        </Text>
      </PressableScale>
    </View>
  );
}
