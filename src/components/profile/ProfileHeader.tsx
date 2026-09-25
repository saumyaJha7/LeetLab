import { Text, View } from "react-native";
import { Avatar } from "heroui-native";

function initialsFor(name: string | null, email: string | null): string {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

type ProfileHeaderProps = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

/** Avatar + name + email block. */
export function ProfileHeader({ name, email, avatarUrl }: ProfileHeaderProps) {
  const displayName = name?.trim() || "Coder";

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
        style={{ fontSize: 22, fontWeight: "800" }}
      >
        {displayName}
      </Text>
      {email ? (
        <Text className="mt-1 text-muted" style={{ fontSize: 14 }}>
          {email}
        </Text>
      ) : null}
    </View>
  );
}
