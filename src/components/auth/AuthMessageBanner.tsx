import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontFamily } from "../../theme";
import type { AuthMessage } from "./authTypes";

/** Status banner below the form card: soft-tinted container with
 * a 1px border, status icon and high-contrast text.
 * Null when there is no message. */
export function AuthMessageBanner({ message }: { message: AuthMessage }) {
  if (!message) {
    return null;
  }

  const isError = message.type === "error";

  return (
    <View
      accessibilityRole="alert"
      className={`mt-4 flex-row items-start gap-2.5 rounded-2xl border border-border px-4 py-3 ${
        isError ? "bg-danger-soft" : "bg-success-soft"
      }`}
    >
      <Ionicons
        name={isError ? "alert-circle" : "checkmark-circle"}
        size={18}
        color={isError ? colors.danger : colors.success}
        style={{ marginTop: 1 }}
      />
      <Text
        className="flex-1 text-foreground"
        style={{
          fontFamily: fontFamily.medium,
          fontSize: 13,
          lineHeight: 19,
        }}
      >
        {message.text}
      </Text>
    </View>
  );
}
