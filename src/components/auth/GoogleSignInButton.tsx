import { Image } from "react-native";
import { Button, Spinner, useThemeColor } from "heroui-native";

type GoogleSignInButtonProps = {
  busy: boolean;
  isGoogleLoading: boolean;
  onPress: () => void;
};

/** Outline Google button with the official "G" mark + loading state. */
export function GoogleSignInButton({
  busy,
  isGoogleLoading,
  onPress,
}: GoogleSignInButtonProps) {
  const foreground = useThemeColor("foreground");

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full rounded-2xl bg-surface"
      isDisabled={busy}
      onPress={onPress}
    >
      {isGoogleLoading ? (
        <Spinner color={foreground} />
      ) : (
        <Image
          source={require("../../../assets/images/google-g.png")}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      )}
      <Button.Label className="font-bold">Continue with Google</Button.Label>
    </Button>
  );
}
