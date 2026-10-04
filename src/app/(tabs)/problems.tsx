import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Screen, EmptyState, ErrorState, LoadingState } from "../../components/ui";
import { ProblemCard, ProblemsHeader } from "../../components/problems";
import { useProblemsStore } from "../../stores/useProblemsStore";
import { colors } from "../../theme";

export default function ProblemsScreen() {
  const problems = useProblemsStore((s) => s.problems);
  const initialized = useProblemsStore((s) => s.initialized);
  const error = useProblemsStore((s) => s.error);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // The list is shared with home — fetch here only when
  // entering with an empty cache (cold deep link).
  useEffect(() => {
    if (!useProblemsStore.getState().initialized) {
      void useProblemsStore.getState().fetchProblems();
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await useProblemsStore.getState().fetchProblems();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const problem of problems) {
      for (const tag of problem.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [problems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((problem) => {
      if (activeTag && !(problem.tags ?? []).includes(activeTag)) {
        return false;
      }
      if (q && !problem.title.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [problems, query, activeTag]);

  const isFiltering = query.trim() !== "" || activeTag !== null;

  // Full loader only before the first fetch completes —
  // pulls keep stale content under the refresh indicator.
  if (!initialized) {
    return (
      <Screen>
        <LoadingState label="Loading problems…" />
      </Screen>
    );
  }

  // Full error screen only when there is nothing to show;
  // a failed pull keeps the stale list in place.
  if (error && problems.length === 0) {
    return (
      <Screen>
        <ErrorState
          description={error}
          onRetry={() => useProblemsStore.getState().fetchProblems()}
        />
      </Screen>
    );
  }

  const subtitle = isFiltering
    ? `${filtered.length} of ${problems.length}`
    : `${problems.length} total`;

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.problem_id.toString()}
        renderItem={({ item }) => <ProblemCard problem={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <ProblemsHeader
            query={query}
            onQueryChange={setQuery}
            tags={tags}
            activeTag={activeTag}
            onTagChange={setActiveTag}
            countLabel={subtitle}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No problems found"
            description={
              isFiltering
                ? "Try a different search or clear the filters."
                : "New problems are on their way."
            }
            actionLabel={isFiltering ? "Clear filters" : undefined}
            onAction={
              isFiltering
                ? () => {
                    setQuery("");
                    setActiveTag(null);
                  }
                : undefined
            }
          />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.muted}
            colors={[colors.muted]}
          />
        }
      />
    </Screen>
  );
}
