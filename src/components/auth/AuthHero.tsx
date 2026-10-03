import type { ReactNode } from "react";
import { Text, View } from "react-native";

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
          style={{ fontSize: 11, fontWeight: "800", letterSpacing: 1.6 }}
        >
          {eyebrow.toUpperCase()}
        </Text>
      </View>
      <Text
        className="mb-2.5 text-foreground"
        style={{ fontSize: 32, fontWeight: "800", lineHeight: 38 }}
      >
        {title}
      </Text>
      <Text className="text-muted" style={{ fontSize: 15, lineHeight: 22 }}>
        {subtitle}
      </Text>
    </View>
  );
}
