import { Text, View } from "react-native";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function todayLabel(now: Date): string {
  return now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Greeting header: date eyebrow + personalised title. */
export function HomeHeader({ name }: { name: string | null }) {
  const now = new Date();
  const displayName = name?.trim() ? name.trim() : "there";

  return (
    <View className="mb-6">
      <View className="mb-2.5 flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full bg-accent" />
        <Text
          className="text-accent"
          style={{ fontSize: 11, fontWeight: "800", letterSpacing: 1.6 }}
        >
          {todayLabel(now).toUpperCase()}
        </Text>
      </View>
      <Text
        className="mb-2 text-foreground"
        style={{ fontSize: 28, fontWeight: "800", lineHeight: 34 }}
      >
        {greetingForHour(now.getHours())}, {displayName}.
      </Text>
      <Text className="text-muted" style={{ fontSize: 15, lineHeight: 22 }}>
        Let&apos;s solve something today.
      </Text>
    </View>
  );
}
