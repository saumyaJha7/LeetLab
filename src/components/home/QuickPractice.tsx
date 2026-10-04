import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import type { ComponentProps } from "react";
import { fontFamily, colors } from "../../theme";
import { PressableScale } from "../ui";

type PracticeAction = {
  key: "browse" | "daily" | "saved";
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  tile: string;
  iconColor: string;
};

const ACTIONS: PracticeAction[] = [
  {
    key: "browse",
    icon: "library-outline",
    title: "Browse problems",
    subtitle: "Pick from the problem set",
    tile: `${colors.primary}1F`,
    iconColor: colors.primary,
  },
  {
    key: "daily",
    icon: "flag-outline",
    title: "Daily challenge",
    subtitle: "Start with the first challenge",
    tile: `${colors.warning}1F`,
    iconColor: colors.warning,
  },
  {
    key: "saved",
    icon: "bookmark-outline",
    title: "Saved problems",
    subtitle: "Bookmarks are coming soon",
    tile: `${colors.secondary}1F`,
    iconColor: colors.secondary,
  },
];

type QuickPracticeProps = {
  onBrowse: () => void;
  onDaily: () => void;
  /** Saved has no destination yet — renders as a dummy row for now. */
  onSaved?: () => void;
};

/** Quick practice section: hint header + three action rows in one card. */
export function QuickPractice({ onBrowse, onDaily, onSaved }: QuickPracticeProps) {
  const handlers = {
    browse: onBrowse,
    daily: onDaily,
    // TODO: wire to saved/bookmarks when the feature lands.
    saved: onSaved ?? (() => {}),
  } as const;

  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text
          className="text-foreground"
          style={{ fontFamily: fontFamily.semiBold, fontSize: 17 }}
        >
          Quick practice
        </Text>
        <Text
          className="text-muted"
          style={{ fontFamily: fontFamily.regular, fontSize: 13 }}
        >
          Tap to start
        </Text>
      </View>
      <Card>
        <Card.Body>
          {ACTIONS.map((action, index) => (
            <PressableScale
              key={action.key}
              onPress={handlers[action.key]}
            >
              <View
                className={`flex-row items-center gap-3 py-3 ${
                  index < ACTIONS.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: action.tile }}
                >
                  <Ionicons
                    name={action.icon}
                    size={20}
                    color={action.iconColor}
                  />
                </View>
                <View className="flex-1 gap-0.5">
                  <Text
                    className="text-foreground"
                    style={{ fontFamily: fontFamily.semiBold, fontSize: 14 }}
                  >
                    {action.title}
                  </Text>
                  <Text
                    className="text-muted"
                    style={{ fontFamily: fontFamily.regular, fontSize: 13 }}
                    numberOfLines={1}
                  >
                    {action.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.muted}
                />
              </View>
            </PressableScale>
          ))}
        </Card.Body>
      </Card>
    </View>
  );
}
