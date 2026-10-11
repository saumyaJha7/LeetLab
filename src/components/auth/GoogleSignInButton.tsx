import { Image } from "react-native";
import { Button, Spinner, useThemeColor } from "heroui-native";
import { fontFamily } from "../../theme";

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
  const onAccent = useThemeColor("accent-foreground");

  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full rounded-xl"
      isDisabled={busy}
      onPress={onPress}
    >
      {isGoogleLoading ? (
        <Spinner color={onAccent} />
      ) : (
        <Image
          source={require("../../../assets/images/google-g.png")}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      )}
      <Button.Label style={{ fontFamily: fontFamily.semiBold }}>
        Continue with Google
      </Button.Label>
    </Button>
  );
}
