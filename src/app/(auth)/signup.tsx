import { useState } from "react";
import { router } from "expo-router";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { AuthScreen, type AuthMessage } from "../../components/auth";

export default function SignupScreen() {
  const [message, setMessage] = useState<AuthMessage>(null);
  const { isGoogleLoading, signInWithGoogle } = useGoogleAuth();

  const handleGoogleSignup = async () => {
    setMessage(null);
    const { ok, errorMessage } = await signInWithGoogle();
    if (errorMessage) {
      setMessage({ type: "error", text: errorMessage });
      return;
    }
    if (ok) {
      router.replace("/(tabs)");
    }
  };

  return (
    <AuthScreen
      heading="Create account"
      message={message}
      isGoogleLoading={isGoogleLoading}
      onGooglePress={handleGoogleSignup}
      footerPrompt="Already have an account?"
      footerActionLabel="Log in"
      onFooterPress={() => router.replace("/(auth)/login")}
    />
  );
}
