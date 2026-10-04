import { Text, View } from "react-native";
import { Card } from "heroui-native";
import { fontFamily, colors } from "../../theme";

type WeekStat = {
  label: string;
  value: number;
  dot: string;
};

// TODO: replace with real per-user stats when the backend lands.
// Hardcoded for the new-home preview.
const STATS: WeekStat[] = [
  { label: "Solved", value: 1, dot: colors.primary },
  { label: "Streak", value: 0, dot: colors.warning },
  { label: "Saved", value: 0, dot: colors.secondary },
];

/** "This week" metric tiles: colored dot + big number + label. */
export function WeekStats() {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text
          className="text-foreground"
          style={{ fontFamily: fontFamily.semiBold, fontSize: 17 }}
        >
          This week
        </Text>
      </View>
      <View className="flex-row gap-3">
        {STATS.map((stat) => (
          <Card key={stat.label} className="flex-1">
            <Card.Body className="items-center gap-1 py-4">
              <View
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: stat.dot }}
              />
              <Text
                className="text-foreground"
                style={{ fontFamily: fontFamily.extraBold, fontSize: 20 }}
              >
                {stat.value}
              </Text>
              <Text
                className="text-muted"
                style={{ fontFamily: fontFamily.regular, fontSize: 12 }}
              >
                {stat.label}
              </Text>
            </Card.Body>
          </Card>
        ))}
      </View>
    </View>
  );
}
