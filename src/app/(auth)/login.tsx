import { useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { AuthScreen, type AuthMessage } from "../../components/auth";

export default function LoginScreen() {
  const [message, setMessage] = useState<AuthMessage>(null);
  const { isGoogleLoading, signInWithGoogle } = useGoogleAuth();

  const handleGoogleLogin = async () => {
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
      eyebrow="Solve smarter"
      title={
        <>
          Welcome back to{"\n"}
          <Text className="text-accent">LeetLab.</Text>
        </>
      }
      subtitle={
        <>
          Pick up your <Text className="text-accent">streak</Text>, revisit
          solutions, and stay consistent.
        </>
      }
      message={message}
      isGoogleLoading={isGoogleLoading}
      onGooglePress={handleGoogleLogin}
      footerPrompt="New to LeetLab?"
      footerActionLabel="Create account"
      onFooterPress={() => router.replace("/(auth)/signup")}
    />
  );
}
