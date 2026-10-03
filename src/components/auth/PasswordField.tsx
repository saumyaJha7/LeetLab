import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, Label, TextField } from "heroui-native";
import { colors } from "../../theme";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  editable?: boolean;
  /** Autofill behavior: "current" for login, "new" for signup
   * (drives OS keychain prompts + strong-password suggestions). */
  kind?: "current" | "new";
};

/** Password input with show/hide toggle. */
export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  kind = "current",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField isRequired>
      <Label>{label}</Label>
      <View className="w-full flex-row items-center">
        <Input
          className="flex-1 pr-12"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={kind === "new" ? "new-password" : "current-password"}
          textContentType={kind === "new" ? "newPassword" : "password"}
          editable={editable}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? "Hide password" : "Show password"}
          className="absolute right-4"
          hitSlop={8}
          onPress={() => setVisible((v) => !v)}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={colors.muted}
          />
        </Pressable>
      </View>
    </TextField>
  );
}
