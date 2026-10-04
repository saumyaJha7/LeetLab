import { Text, View } from "react-native";
import { fontFamily } from "../../theme";

/** Consent caption under the Google button. Plain text by design —
 * no dead links to Terms/Privacy pages that don't exist yet. */
export function AuthTerms() {
  return (
    <View className="mt-5 items-center px-6">
      <Text
        className="text-center text-muted"
        style={{
          fontFamily: fontFamily.regular,
          fontSize: 12,
          lineHeight: 17,
        }}
      >
        By continuing you agree to LeetLab&apos;s Terms &amp; Privacy Policy.
      </Text>
    </View>
  );
}
