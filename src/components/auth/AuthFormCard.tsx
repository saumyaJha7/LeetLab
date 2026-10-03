import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { Button, Card, Spinner, useThemeColor } from "heroui-native";

type AuthFormCardProps = {
  formTitle: string;
  children: ReactNode;
  belowFields?: ReactNode;
  submitLabel: string;
  isSubmitting: boolean;
  busy: boolean;
  onSubmit: () => void;
};

/** Form card: HeroUI Card with title, fields, optional
 * below-fields slot and the primary submit button. */
export function AuthFormCard({
  formTitle,
  children,
  belowFields,
  submitLabel,
  isSubmitting,
  busy,
  onSubmit,
}: AuthFormCardProps) {
  const accentForeground = useThemeColor("accent-foreground");

  return (
    <Card>
      <Card.Body>
        <Text className="mb-4 text-foreground" style={{ fontSize: 15, fontWeight: "700" }}>
          {formTitle}
        </Text>
        <View className="gap-4">
          {children}
          {belowFields}
          <Button
            variant="primary"
            size="lg"
            className="w-full rounded-2xl"
            isDisabled={busy}
            onPress={onSubmit}
          >
            {isSubmitting ? <Spinner color={accentForeground} /> : null}
            <Button.Label className="font-bold">{submitLabel}</Button.Label>
          </Button>
        </View>
      </Card.Body>
    </Card>
  );
}
