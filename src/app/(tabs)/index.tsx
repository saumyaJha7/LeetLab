import { ScrollView } from "react-native";
import { Screen } from "../../components/ui";
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
        <HomeHeader name={profile?.name ?? null} />
        <SuggestedProblems
          problems={problems}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
        <LibraryCard total={total} loading={loading} />
      </ScrollView>
    </Screen>
  );
}
