import { Text, View } from "react-native";
import { Button, Spinner, useThemeColor } from "heroui-native";

type GoogleSignInButtonProps = {
  busy: boolean;
  isGoogleLoading: boolean;
  onPress: () => void;
};

/** Outline Google button with "G" badge + loading state. */
export function GoogleSignInButton({
  busy,
  isGoogleLoading,
  onPress,
}: GoogleSignInButtonProps) {
  const accentForeground = useThemeColor("accent-foreground");

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      isDisabled={busy}
      onPress={onPress}
    >
      {isGoogleLoading ? (
        <Spinner color={accentForeground} />
      ) : (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
          <Text style={{ color: "#4285F4", fontSize: 14, fontWeight: "900" }}>
            G
          </Text>
        </View>
      )}
      <Button.Label>Continue with Google</Button.Label>
    </Button>
  );
}
