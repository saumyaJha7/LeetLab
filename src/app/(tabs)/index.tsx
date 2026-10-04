import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../components/ui";
import {
  HomeBrand,
  HomeProfileRow,
  QuickPractice,
  SessionBanner,
  WeekStats,
} from "../../components/home";
import { useProblemsStore } from "../../stores/useProblemsStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { useSessionStore } from "../../stores/useSessionStore";
import { colors } from "../../theme";

export default function HomeScreen() {
  const router = useRouter();
  const email = useSessionStore((s) => s.session?.user?.email ?? null);
  const profile = useProfileStore((s) => s.profile);
  const profileInitialized = useProfileStore((s) => s.initialized);
  const [refreshing, setRefreshing] = useState(false);

  // Shared stores fetch once — top up here only when entering
  // with an empty cache (cold deep link, fresh sign-in).
  useEffect(() => {
    if (!useProblemsStore.getState().initialized) {
      void useProblemsStore.getState().fetchProblems();
    }
    if (!useProfileStore.getState().initialized) {
      void useProfileStore.getState().fetchProfile();
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        useProblemsStore.getState().fetchProblems(),
        useProfileStore.getState().fetchProfile(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const goToDailyChallenge = useCallback(() => {
    const { problems } = useProblemsStore.getState();
    const daily =
      problems.find((p) => p.title.toLowerCase().includes("two sum")) ??
      problems[0];
    if (daily) {
      router.push(`/(tabs)/${daily.problem_id}`);
    }
  }, [router]);

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
        <HomeBrand />
        <HomeProfileRow
          name={profile?.name ?? null}
          email={email}
          avatarUrl={profile?.avatar_url ?? null}
          loading={!profileInitialized}
        />
        <SessionBanner />
        <QuickPractice
          onBrowse={() => router.push("/(tabs)/problems")}
          onDaily={goToDailyChallenge}
        />
        <WeekStats />
      </ScrollView>
    </Screen>
  );
}
