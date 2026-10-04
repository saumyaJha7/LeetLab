import { Text, View } from "react-native";
import { Avatar } from "heroui-native";
import { fontFamily } from "../../theme";
import { displayNameFor, initialsFor } from "../../lib/display-name";

type HomeProfileRowProps = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  loading: boolean;
};

/** Identity row: avatar + "Welcome back" + name. Shows a skeleton
 * while the profile loads so no fallback name ever flashes. */
export function HomeProfileRow({
  name,
  email,
  avatarUrl,
  loading,
}: HomeProfileRowProps) {
  const displayName = displayNameFor(name);

  return (
    <View className="mb-5 flex-row items-center gap-3">
      <Avatar size="md" color="accent" alt={displayName}>
        {avatarUrl ? <Avatar.Image source={{ uri: avatarUrl }} /> : null}
        <Avatar.Fallback delayMs={300}>
          {initialsFor(name, email)}
        </Avatar.Fallback>
      </Avatar>
      <View className="flex-1">
        <Text
          className="text-muted"
          style={{ fontFamily: fontFamily.regular, fontSize: 12 }}
        >
          Welcome back
        </Text>
        {loading ? (
          <View className="mt-1 h-[26px] w-2/5 rounded-lg bg-surface-secondary" />
        ) : (
          <Text
            className="text-foreground"
            style={{ fontFamily: fontFamily.extraBold, fontSize: 20 }}
            numberOfLines={1}
          >
            {displayName}
          </Text>
        )}
      </View>
    </View>
  );
}
