import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import { PressableScale } from "../ui";
import { colors } from "../../theme";

type LibraryCardProps = {
  total: number | null;
  loading: boolean;
};

/** Library entry: same row pattern as ProblemRow — tappable, no CTA button. */
export function LibraryCard({ total, loading }: LibraryCardProps) {
  const router = useRouter();

  return (
    <Card>
      <Card.Body>
        <PressableScale onPress={() => router.push("/(tabs)/problems")}>
          <View className="flex-row items-center gap-3 py-2">
            <View className="flex-1 gap-1">
              <Text
                className="text-foreground"
                style={{ fontSize: 16, fontWeight: "600" }}
                numberOfLines={1}
              >
                Problem library
              </Text>
              <Text
                className="text-muted"
                style={{ fontSize: 13 }}
                numberOfLines={1}
              >
                {loading
                  ? "Loading problems…"
                  : `${total ?? "–"} problems to sharpen your edge`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        </PressableScale>
      </Card.Body>
    </Card>
  );
}
