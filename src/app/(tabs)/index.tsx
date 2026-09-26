import { ScrollView } from "react-native";
import { EnteringView, Screen } from "../../components/ui";
import { HomeHeader, LibraryCard, SuggestedProblems } from "../../components/home";
import { useProblemList } from "../../hooks/useProblemList";
import { useProfile } from "../../hooks/useProfile";

export default function HomeScreen() {
  const { profile } = useProfile();
  const { problems, total, loading, error, refetch } = useProblemList(3);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <EnteringView index={0}>
          <HomeHeader name={profile?.name ?? null} />
        </EnteringView>
        <EnteringView index={1}>
          <SuggestedProblems
            problems={problems}
            loading={loading}
            error={error}
            onRetry={refetch}
          />
        </EnteringView>
        <EnteringView index={2}>
          <LibraryCard total={total} loading={loading} />
        </EnteringView>
      </ScrollView>
    </Screen>
  );
}
