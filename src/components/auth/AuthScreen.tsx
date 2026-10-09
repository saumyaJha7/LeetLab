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
import { AuthFooter } from "./AuthFooter";
import { AuthHero } from "./AuthHero";
import { AuthMessageBanner } from "./AuthMessageBanner";
import { AuthTerms } from "./AuthTerms";
import { GoogleSignInButton } from "./GoogleSignInButton";
import type { AuthMessage } from "./authTypes";

export type { AuthMessage } from "./authTypes";

type AuthScreenProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  message: AuthMessage;
  isGoogleLoading: boolean;
  onGooglePress: () => void;
  footerPrompt: string;
  footerActionLabel: string;
  onFooterPress: () => void;
};

/**
 * Google-only welcome shell for login + signup. Composes brand, hero,
 * Google button, consent caption and footer — screens only
 * provide copy and the Google press handler.
 */
export function AuthScreen({
  eyebrow,
  title,
  subtitle,
  message,
  isGoogleLoading,
  onGooglePress,
  footerPrompt,
  footerActionLabel,
  onFooterPress,
}: AuthScreenProps) {
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
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 480,
              alignSelf: "center",
              paddingHorizontal: spacing.lg,
              paddingTop: Math.max(insets.top, spacing.xxl),
              paddingBottom: Math.max(insets.bottom, spacing.xxl),
            }}
          >
            <AuthBrand />
            <AuthHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
            <GoogleSignInButton
              busy={isGoogleLoading}
              isGoogleLoading={isGoogleLoading}
              onPress={onGooglePress}
            />
            <AuthMessageBanner message={message} />
            <AuthTerms />
            <AuthFooter
              prompt={footerPrompt}
              actionLabel={footerActionLabel}
              onPress={onFooterPress}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
