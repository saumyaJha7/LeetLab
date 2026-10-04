import { Text, View } from "react-native";
import { Avatar } from "heroui-native";
import { displayNameFor, initialsFor } from "../../lib/display-name";
import { fontFamily } from "../../theme";

type ProfileHeaderProps = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

/** Avatar + name + email block. */
export function ProfileHeader({ name, email, avatarUrl }: ProfileHeaderProps) {
  const displayName = displayNameFor(name);

  return (
    <View className="mb-6 items-center">
      <Avatar size="lg" color="accent" alt={displayName}>
        {avatarUrl ? <Avatar.Image source={{ uri: avatarUrl }} /> : null}
        <Avatar.Fallback delayMs={300}>
          {initialsFor(name, email)}
        </Avatar.Fallback>
      </Avatar>
      <Text
        className="mt-4 text-foreground"
        style={{ fontFamily: fontFamily.extraBold, fontSize: 22 }}
      >
        {displayName}
      </Text>
      {email ? (
        <Text
          className="mt-1 text-muted"
          style={{ fontFamily: fontFamily.regular, fontSize: 14 }}
        >
          {email}
        </Text>
      ) : null}
    </View>
  );
}
