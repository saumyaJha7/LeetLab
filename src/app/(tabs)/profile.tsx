import { ScrollView, Text, View } from "react-native";
import { EnteringView, Screen, LoadingState } from "../../components/ui";
import {
  AccountDetails,
  ProfileHeader,
  SignOutButton,
} from "../../components/profile";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

function memberSinceLabel(createdAt: string | undefined): string | null {
  if (!createdAt) {
    return null;
  }
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileScreen() {
  const { session } = useAuth();
  const { profile, loading } = useProfile();

  const email = session?.user?.email ?? null;
  const memberSince = memberSinceLabel(session?.user?.created_at);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text
            className="text-foreground"
            style={{ fontSize: 24, fontWeight: "800" }}
          >
            Profile
          </Text>
          <Text className="mt-1 text-muted" style={{ fontSize: 14 }}>
            Manage your account
          </Text>
        </View>

        {loading ? (
          <LoadingState label="Loading profile…" />
        ) : (
          <>
            <EnteringView index={0}>
              <ProfileHeader
                name={profile?.name ?? null}
                email={email}
                avatarUrl={profile?.avatar_url ?? null}
              />
            </EnteringView>
            <EnteringView index={1}>
              <View className="mb-5">
                <AccountDetails email={email} memberSince={memberSince} />
              </View>
            </EnteringView>
            <EnteringView index={2}>
              <SignOutButton />
            </EnteringView>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
