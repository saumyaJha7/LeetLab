import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import type { ComponentProps } from "react";
import { colors } from "../../theme";

type FeatureTone = {
  /** Translucent tile fill (theme hex + alpha). */
  tile: string;
  /** Icon color (theme hex). */
  icon: string;
};

export type AuthFeature = {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  tone: FeatureTone;
};

/** Fixed feature list — identical on login and signup. */
export const AUTH_FEATURES: AuthFeature[] = [
  {
    icon: "flash",
    title: "Daily practice",
    subtitle: "Quick problems that fit your day",
    tone: { tile: `${colors.primary}1F`, icon: colors.primary },
  },
  {
    icon: "trophy",
    title: "Track progress",
    subtitle: "Streaks, topics and solved history",
    tone: { tile: `${colors.warning}1F`, icon: colors.warning },
  },
  {
    icon: "shield-checkmark",
    title: "Private & secure",
    subtitle: "Supabase Auth · secure sessions",
    tone: { tile: `${colors.secondary}1F`, icon: colors.secondary },
  },
];

/** Feature card: icon tile + title + subtitle rows with dividers. */
export function AuthFeatures() {
  return (
    <Card className="mb-6">
      <Card.Body>
        {AUTH_FEATURES.map((feature, index) => (
          <View
            key={feature.title}
            className={`flex-row items-center gap-3 py-3 ${
              index < AUTH_FEATURES.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: feature.tone.tile }}
            >
              <Ionicons name={feature.icon} size={20} color={feature.tone.icon} />
            </View>
            <View className="flex-1 gap-0.5">
              <Text
                className="text-foreground"
                style={{ fontSize: 14, fontWeight: "700" }}
              >
                {feature.title}
              </Text>
              <Text className="text-muted" style={{ fontSize: 13 }}>
                {feature.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </Card.Body>
    </Card>
  );
}
