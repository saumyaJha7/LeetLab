import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Spinner } from "heroui-native";
import { colors } from "../../theme";

type SubmitFeedbackProps = {
  submitting: boolean;
  submitError: string | null;
  onRetry: () => void;
};

/** Verdict area: running indicator during submit + error banner
 * with retry. Renders nothing when idle without an error. */
export function SubmitFeedback({
  submitting,
  submitError,
  onRetry,
}: SubmitFeedbackProps) {
  return (
    <>
      {submitting ? (
        <View
          style={{ paddingTop: 14 }}
          className="flex-row items-center justify-center gap-2"
        >
          <Spinner color={colors.secondary} />
          <Text className="text-muted" style={{ fontSize: 12 }}>
            Running test cases…
          </Text>
        </View>
      ) : null}

      {submitError ? (
        <View className="mt-3 flex-row items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
          <Ionicons name="alert-circle" size={18} color={colors.danger} />
          <Text
            className="flex-1"
            style={{ fontSize: 13, color: colors.danger }}
            numberOfLines={2}
          >
            {submitError}
          </Text>
          <Button variant="secondary" size="sm" onPress={onRetry}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </View>
      ) : null}
    </>
  );
}
