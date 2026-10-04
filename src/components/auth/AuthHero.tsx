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
    <View className="mb-6">
      <View className="mb-4 self-start flex-row items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
        <View className="h-1.5 w-1.5 rounded-full bg-accent" />
        <Text
          className="text-accent"
          style={{
            fontFamily: fontFamily.extraBold,
            fontSize: 11,
            letterSpacing: 1.6,
          }}
        >
          {eyebrow.toUpperCase()}
        </Text>
      </View>
      <Text
        className="mb-2.5 text-foreground"
        style={{
          fontFamily: fontFamily.extraBold,
          fontSize: 32,
          lineHeight: 38,
          letterSpacing: -0.4,
        }}
      >
        {title}
      </Text>
      <Text
        className="text-muted"
        style={{
          fontFamily: fontFamily.regular,
          fontSize: 15,
          lineHeight: 22,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
