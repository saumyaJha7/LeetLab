import { Text, View } from "react-native";

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
      <Text className="text-foreground" style={{ fontSize: 24, fontWeight: "800" }}>
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-muted" style={{ fontSize: 14 }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
