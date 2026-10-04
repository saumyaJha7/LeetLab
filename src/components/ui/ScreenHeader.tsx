import { Text, View } from "react-native";
import { fontFamily } from "../../theme";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string | null;
};

/** Shared screen heading: 24/800 title + 14 muted subtitle.
 * Used by Problems, Profile and other top-level screens so the
 * type scale stays identical everywhere. */
export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View className="mb-6">
      <Text
        className="text-foreground"
        style={{ fontFamily: fontFamily.extraBold, fontSize: 24 }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="mt-1 text-muted"
          style={{ fontFamily: fontFamily.regular, fontSize: 14 }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
