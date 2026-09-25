import { Text, View } from "react-native";
import { Button, Spinner, useThemeColor } from "heroui-native";

/** Centered loading spinner. */
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  const muted = useThemeColor("muted");

  return (
    <View className="items-center justify-center py-10">
      <Spinner color={muted} />
      <Text className="mt-3 text-muted" style={{ fontSize: 14 }}>
        {label}
      </Text>
    </View>
  );
}

type MessageStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

function MessageState({
  title,
  description,
  actionLabel,
  onAction,
}: MessageStateProps) {
  return (
    <View className="items-center justify-center px-8 py-10">
      <Text
        className="text-center text-foreground"
        style={{ fontSize: 16, fontWeight: "700" }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          className="mt-2 text-center text-muted"
          style={{ fontSize: 14, lineHeight: 20 }}
        >
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onPress={onAction}
        >
          <Button.Label>{actionLabel}</Button.Label>
        </Button>
      ) : null}
    </View>
  );
}

/** Centered empty message, e.g. for empty lists. */
export function EmptyState(props: MessageStateProps) {
  return <MessageState {...props} />;
}

/** Centered error message with a retry action. */
export function ErrorState({
  description = "Something went wrong. Please try again.",
  onRetry,
}: {
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <MessageState
      title="Couldn't load this"
      description={description}
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}
