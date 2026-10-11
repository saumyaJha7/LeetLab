import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { fontFamily } from "../../theme";

type AuthHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
};

/** Welcome hero: pill eyebrow, two-line title and subtitle.
 * Screens compose `title`/`subtitle` with accent-highlighted segments. */
export function AuthHero({ eyebrow, title, subtitle }: AuthHeroProps) {
  return (
    <View className="mb-7">
      <View className="mb-3 self-start flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full bg-accent" />
        <Text
          className="text-muted"
          style={{
            fontFamily: fontFamily.semiBold,
            fontSize: 11,
            letterSpacing: 0,
          }}
        >
          {eyebrow.toUpperCase()}
        </Text>
      </View>
      <Text
        className="mb-2.5 text-foreground"
        style={{
          fontFamily: fontFamily.bold,
          fontSize: 34,
          lineHeight: 41,
          letterSpacing: 0,
        }}
      >
        {title}
      </Text>
      <Text
        className="text-muted"
        style={{
          fontFamily: fontFamily.regular,
          fontSize: 15,
          lineHeight: 23,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
