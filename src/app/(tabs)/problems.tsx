import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SearchField } from "heroui-native";
import { Screen, EmptyState, ErrorState, LoadingState } from "../../components/ui";
import { FilterChips, ProblemRow } from "../../components/problems";
import { useProblemList } from "../../hooks/useProblemList";

export default function ProblemsScreen() {
  const { problems, loading, error, refetch } = useProblemList();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const problem of problems) {
      for (const tag of problem.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
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

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading problems…" />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState description={error} onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.problem_id.toString()}
        renderItem={({ item, index }) => (
          <ProblemRow problem={item} showDivider={index < filtered.length - 1} />
        )}
        ListHeaderComponent={
          <View className="pb-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontSize: 24, fontWeight: "800" }}
            >
              Problems
            </Text>
            <Text className="mb-5 text-muted" style={{ fontSize: 14 }}>
              {isFiltering
                ? `${filtered.length} of ${problems.length} problems`
                : `${problems.length} problems`}
            </Text>
            <SearchField value={query} onChange={setQuery} className="mb-4">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search problems…" />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            {tags.length > 0 ? (
              <View className="mb-2">
                <FilterChips
                  tags={tags}
                  active={activeTag}
                  onChange={setActiveTag}
                />
              </View>
            ) : null}
          </View>
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
      />
    </Screen>
  );
}
