import { Text } from "react-native";
import type { AuthMessage } from "./authTypes";

/** Success / error banner below the form card. Null when no message. */
export function AuthMessageBanner({ message }: { message: AuthMessage }) {
  if (!message) {
    return null;
  }

  return (
    <Text
      accessibilityRole="alert"
      className={message.type === "error" ? "text-danger" : "text-success"}
      style={{ fontSize: 13, lineHeight: 19, marginTop: 14 }}
    >
      {message.text}
    </Text>
  );
}
