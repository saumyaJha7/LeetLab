import { Image } from "react-native";
import { Button, Spinner } from "heroui-native";
import { fontFamily } from "../../theme";

type GoogleSignInButtonProps = {
  busy: boolean;
  isGoogleLoading: boolean;
  onPress: () => void;
};

/** Pill Google button from the sign-in mock: cornflower blue,
 * white "G" mark + loading state. */
export function GoogleSignInButton({
  busy,
  isGoogleLoading,
  onPress,
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full rounded-full"
      style={{ backgroundColor: "#5B8DEF" }}
      isDisabled={busy}
      onPress={onPress}
    >
      {isGoogleLoading ? (
        <Spinner color="#FFFFFF" />
      ) : (
        <Image
          source={require("../../../assets/images/google-g.png")}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      )}
      <Button.Label
        style={{
          fontFamily: fontFamily.semiBold,
          color: "#FFFFFF",
        }}
      >
        Continue with Google
      </Button.Label>
    </Button>
  );
}
