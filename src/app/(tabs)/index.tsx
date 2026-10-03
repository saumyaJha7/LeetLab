import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Screen } from "../../components/ui";
import { HomeHeader, LibraryCard, SuggestedProblems } from "../../components/home";
import { useProblemsStore } from "../../stores/useProblemsStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { colors } from "../../theme";

export default function HomeScreen() {
  const profile = useProfileStore((s) => s.profile);
  const profileInitialized = useProfileStore((s) => s.initialized);
  const problems = useProblemsStore((s) => s.problems);
  const total = useProblemsStore((s) => s.total);
  const problemsInitialized = useProblemsStore((s) => s.initialized);
  const problemsError = useProblemsStore((s) => s.error);
  const [refreshing, setRefreshing] = useState(false);

  // Shared stores fetch once — top up here only when entering
  // with an empty cache (cold deep link, fresh sign-in).
  useEffect(() => {
    if (!useProblemsStore.getState().initialized) {
      void useProblemsStore.getState().fetchProblems();
    }
  }, []);

  const topProblems = useMemo(() => problems.slice(0, 3), [problems]);

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
        <HomeHeader name={profile?.name ?? null} loading={!profileInitialized} />
        <SuggestedProblems
          problems={topProblems}
          loading={!problemsInitialized}
          error={refreshing ? null : problemsError}
          onRetry={() => useProblemsStore.getState().fetchProblems()}
        />
        <LibraryCard total={total} loading={!problemsInitialized} />
      </ScrollView>
    </Screen>
  );
}
