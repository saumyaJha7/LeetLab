import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Screen, LoadingState, ScreenHeader } from "../../components/ui";
import {
  AccountDetails,
  ProfileHeader,
  SignOutButton,
} from "../../components/profile";
import { useSessionStore } from "../../stores/useSessionStore";
import { useProfileStore } from "../../stores/useProfileStore";
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
  const email = useSessionStore((s) => s.session?.user?.email ?? null);
  const createdAt = useSessionStore((s) => s.session?.user?.created_at);
  const profile = useProfileStore((s) => s.profile);
  const initialized = useProfileStore((s) => s.initialized);
  const [refreshing, setRefreshing] = useState(false);

  // The profile is shared with home — fetch here only when
  // entering with an empty cache (cold deep link).
  useEffect(() => {
    if (!useProfileStore.getState().initialized) {
      void useProfileStore.getState().fetchProfile();
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await useProfileStore.getState().fetchProfile();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const memberSince = memberSinceLabel(createdAt);

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

        {!initialized ? (
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
