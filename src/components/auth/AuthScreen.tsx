import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button, Spinner, useThemeColor } from "heroui-native";
import { colors, spacing } from "../../theme";
import { EnteringView, PressableScale } from "../ui";

export type AuthMessage = {
  type: "error" | "success";
  text: string;
} | null;

type AuthScreenProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  formTitle: string;
  children: ReactNode;
  belowFields?: ReactNode;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  message: AuthMessage;
  isGoogleLoading: boolean;
  onGooglePress: () => void;
  footerPrompt: string;
  footerActionLabel: string;
  onFooterPress: () => void;
};

/**
 * Shared shell for login + signup. Owns brand, headings, form card,
 * message banner, divider, Google button and footer — screens only
 * provide their TextFields and submit logic.
 */
export function AuthScreen({
  eyebrow,
  title,
  subtitle,
  formTitle,
  children,
  belowFields,
  submitLabel,
  isSubmitting,
  onSubmit,
  message,
  isGoogleLoading,
  onGooglePress,
  footerPrompt,
  footerActionLabel,
  onFooterPress,
}: AuthScreenProps) {
  const accentForeground = useThemeColor("accent-foreground");
  const busy = isSubmitting || isGoogleLoading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-background">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xxl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <View className="mb-10 flex-row items-center gap-2.5">
            <View className="h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent">
              <Text
                style={{
                  color: colors.onPrimary,
                  fontSize: 20,
                  fontWeight: "900",
                }}
              >
                L
              </Text>
            </View>
            <Text
              className="text-foreground"
              style={{ fontSize: 13, fontWeight: "800", letterSpacing: 2.4 }}
            >
              LEETLAB
            </Text>
          </View>

          {/* Headings */}
          <EnteringView index={0}>
            <View className="mb-2.5 flex-row items-center gap-2">
              <View className="h-1.5 w-1.5 rounded-full bg-accent" />
              <Text
                className="text-accent"
                style={{ fontSize: 11, fontWeight: "800", letterSpacing: 1.6 }}
              >
                {eyebrow}
              </Text>
            </View>
            <Text
              className="mb-2.5 text-foreground"
              style={{ fontSize: 32, fontWeight: "800", lineHeight: 38 }}
            >
              {title}
            </Text>
            <Text
              className="mb-6 text-muted"
              style={{ fontSize: 15, lineHeight: 22 }}
            >
              {subtitle}
            </Text>
          </EnteringView>

          {/* Form card */}
          <EnteringView index={1}>
            <View className="rounded-2xl border border-border bg-surface p-4">
            <Text
              className="mb-4 text-foreground"
              style={{ fontSize: 15, fontWeight: "700" }}
            >
              {formTitle}
            </Text>
            <View className="gap-4">
              {children}
              {belowFields}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                isDisabled={busy}
                onPress={onSubmit}
              >
                {isSubmitting ? <Spinner color={accentForeground} /> : null}
                <Button.Label>{submitLabel}</Button.Label>
              </Button>
            </View>
            </View>
          </EnteringView>

          {/* Message banner */}
          {message ? (
            <EnteringView index={0}>
              <Text
                accessibilityRole="alert"
                className={message.type === "error" ? "text-danger" : "text-success"}
                style={{ fontSize: 13, lineHeight: 19, marginTop: 14 }}
              >
                {message.text}
              </Text>
            </EnteringView>
          ) : null}

          {/* Divider */}
          <View className="my-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Text
              className="text-muted"
              style={{ fontSize: 11, fontWeight: "800", letterSpacing: 1 }}
            >
              OR
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Google */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            isDisabled={busy}
            onPress={onGooglePress}
          >
            {isGoogleLoading ? (
              <Spinner color={accentForeground} />
            ) : (
              <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
                <Text style={{ color: "#4285F4", fontSize: 14, fontWeight: "900" }}>
                  G
                </Text>
              </View>
            )}
            <Button.Label>Continue with Google</Button.Label>
          </Button>

          {/* Footer */}
          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-muted" style={{ fontSize: 14 }}>
              {footerPrompt}{" "}
            </Text>
            <PressableScale onPress={onFooterPress} hitSlop={8}>
              <Text
                className="text-link"
                style={{ fontSize: 14, fontWeight: "800" }}
              >
                {footerActionLabel}
              </Text>
            </PressableScale>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
