import { Text, View } from "react-native";

type AuthHeadingsProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

/** Auth headings: eyebrow dot-row + large title + muted subtitle. */
export function AuthHeadings({ eyebrow, title, subtitle }: AuthHeadingsProps) {
  return (
    <View>
      <View className="mb-2.5 flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full bg-accent" />
        <Text
          className="text-accent"
          style={{ fontSize: 11, fontWeight: "800", letterSpacing: 1.6 }}
        >
          {eyebrow.toUpperCase()}
        </Text>
      </View>
      {/* Hero scale (32/800) is intentional — marketing header,
          not the 24/800 in-app ScreenHeader. Keep the two distinct. */}
      <Text
        className="mb-2.5 text-foreground"
        style={{ fontSize: 32, fontWeight: "800", lineHeight: 38 }}
      >
        {title}
      </Text>
      <Text className="mb-6 text-muted" style={{ fontSize: 15, lineHeight: 22 }}>
        {subtitle}
      </Text>
    </View>
  );
}
