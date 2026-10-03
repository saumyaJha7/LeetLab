import { useCallback, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Screen } from "../../components/ui";
import { HomeHeader, LibraryCard, SuggestedProblems } from "../../components/home";
import { useProblemList } from "../../hooks/useProblemList";
import { useProfile } from "../../hooks/useProfile";
import { colors } from "../../theme";

export default function HomeScreen() {
  const { profile, loading: profileLoading } = useProfile();
  const { problems, total, loading, error, refetch } = useProblemList(3);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // While pulling, keep stale content on screen under the
  // refresh indicator instead of collapsing into loaders.
  const quietLoading = loading && !refreshing;

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
        <HomeHeader name={profile?.name ?? null} loading={profileLoading} />
        <SuggestedProblems
          problems={problems}
          loading={quietLoading}
          error={refreshing ? null : error}
          onRetry={refetch}
        />
        <LibraryCard total={total} loading={quietLoading} />
      </ScrollView>
    </Screen>
  );
}
