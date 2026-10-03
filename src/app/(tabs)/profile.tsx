import { ScrollView, View } from "react-native";
import { Screen, LoadingState, ScreenHeader } from "../../components/ui";
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
        <ScreenHeader title="Profile" subtitle="Manage your account" />

        {loading ? (
          <LoadingState label="Loading profile…" />
        ) : (
          <>
            <ProfileHeader
              name={profile?.name ?? null}
              email={email}
              avatarUrl={profile?.avatar_url ?? null}
            />
            <View className="mb-5">
              <AccountDetails email={email} memberSince={memberSince} />
            </View>
            <SignOutButton />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
