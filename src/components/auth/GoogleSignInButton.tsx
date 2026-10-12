import { ActivityIndicator, Image, Text, View } from "react-native";
import { fontFamily } from "../../theme";
import { PressableScale } from "../ui";

type GoogleSignInButtonProps = {
  busy: boolean;
  isGoogleLoading: boolean;
  onPress: () => void;
};

/** Pill Google button from the sign-in mock: cornflower blue,
 * white "G" mark + loading state. Custom-built (not HeroUI Button)
 * so the label can never truncate inside the pill. */
export function GoogleSignInButton({
  busy,
  isGoogleLoading,
  onPress,
}: GoogleSignInButtonProps) {
  return (
    <PressableScale
      onPress={busy ? undefined : onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
    >
      <View
        style={{
          height: 56,
          borderRadius: 999,
          backgroundColor: "#5B8DEF",
          opacity: busy ? 0.7 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          paddingHorizontal: 24,
        }}
      >
        {isGoogleLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Image
            source={require("../../../assets/images/google-g.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        )}
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fontFamily.semiBold,
            fontSize: 16,
            color: "#FFFFFF",
            flexShrink: 1,
          }}
        >
          Continue with Google
        </Text>
      </View>
    </PressableScale>
  );
}
