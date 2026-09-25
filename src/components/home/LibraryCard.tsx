import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Spinner, useThemeColor } from "heroui-native";

type LibraryCardProps = {
  total: number | null;
  loading: boolean;
};

/** Library overview card: real problem count + browse CTA. */
export function LibraryCard({ total, loading }: LibraryCardProps) {
  const router = useRouter();
  const accentForeground = useThemeColor("accent-foreground");

  return (
    <Card variant="secondary">
      <Card.Body>
        <View className="flex-row items-end justify-between">
          <View className="gap-1">
            <Card.Title>Problem library</Card.Title>
            <Card.Description>
              Hand-picked problems to sharpen your edge
            </Card.Description>
          </View>
          {loading ? (
            <Spinner color={accentForeground} />
          ) : (
            <Text
              className="text-accent"
              style={{ fontSize: 32, fontWeight: "800" }}
            >
              {total ?? "–"}
            </Text>
          )}
        </View>
      </Card.Body>
      <Card.Footer>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onPress={() => router.push("/(tabs)/problems")}
        >
          <Button.Label>Browse problems</Button.Label>
        </Button>
      </Card.Footer>
    </Card>
  );
}
