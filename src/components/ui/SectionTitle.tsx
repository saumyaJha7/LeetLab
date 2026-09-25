import { Pressable, Text, View } from "react-native";

type SectionTitleProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Section heading row with an optional right-aligned action. */
export function SectionTitle({
  title,
  actionLabel,
  onAction,
}: SectionTitleProps) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text
        className="text-foreground"
        style={{ fontSize: 17, fontWeight: "700" }}
      >
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          hitSlop={8}
        >
          {({ pressed }) => (
            <Text
              className="text-link"
              style={{
                fontSize: 14,
                fontWeight: "700",
                opacity: pressed ? 0.7 : 1,
              }}
            >
              {actionLabel}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
