import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../../theme";
import { AuthBrand } from "./AuthBrand";
import { AuthDivider } from "./AuthDivider";
import { AuthFooter } from "./AuthFooter";
import { AuthFormCard } from "./AuthFormCard";
import { AuthHeadings } from "./AuthHeadings";
import { AuthMessageBanner } from "./AuthMessageBanner";
import { GoogleSignInButton } from "./GoogleSignInButton";
import type { AuthMessage } from "./authTypes";

export type { AuthMessage } from "./authTypes";

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
 * Shared shell for login + signup. Composes brand, headings, form card,
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
  const busy = isSubmitting || isGoogleLoading;
  const insets = useSafeAreaInsets();

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
            paddingTop: Math.max(insets.top, spacing.xxl),
            paddingBottom: Math.max(insets.bottom, spacing.xxl),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthBrand />
          <AuthHeadings eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <AuthFormCard
            formTitle={formTitle}
            belowFields={belowFields}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
            busy={busy}
            onSubmit={onSubmit}
          >
            {children}
          </AuthFormCard>
          <AuthMessageBanner message={message} />
          <AuthDivider />
          <GoogleSignInButton
            busy={busy}
            isGoogleLoading={isGoogleLoading}
            onPress={onGooglePress}
          />
          <AuthFooter
            prompt={footerPrompt}
            actionLabel={footerActionLabel}
            onPress={onFooterPress}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
