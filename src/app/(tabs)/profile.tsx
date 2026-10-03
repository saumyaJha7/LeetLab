import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Screen, LoadingState, ScreenHeader } from "../../components/ui";
import {
  AccountDetails,
  ProfileHeader,
  SignOutButton,
} from "../../components/profile";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { colors } from "../../theme";

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
  const { profile, loading, refetch } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const email = session?.user?.email ?? null;
  const memberSince = memberSinceLabel(session?.user?.created_at);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.muted}
            colors={[colors.muted]}
          />
        }
      >
        <ScreenHeader title="Profile" subtitle="Manage your account" />

        {loading && !refreshing ? (
          <LoadingState label="Loading profile…" />
        ) : (
          <>
            <ProfileHeader
              name={profile?.name ?? null}
              email={email}
              avatarUrl={profile?.avatar_url ?? null}
            />
            {/* mb-2 here + DetailSection's mb-4 = 24px, matching
                the mb-6 block rhythm used across the app. */}
            <View className="mb-2">
              <AccountDetails email={email} memberSince={memberSince} />
            </View>
            <SignOutButton />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
