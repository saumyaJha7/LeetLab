import { useState } from "react";
import { Text } from "react-native";
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
      eyebrow="Start your run"
      title={
        <>
          Welcome to{"\n"}
          <Text className="text-accent">LeetLab.</Text>
        </>
      }
      subtitle={
        <>
          Turn daily practice into a sharper{" "}
          <Text className="text-accent">problem-solving habit.</Text>
        </>
      }
      message={message}
      isGoogleLoading={isGoogleLoading}
      onGooglePress={handleGoogleSignup}
      footerPrompt="Already have an account?"
      footerActionLabel="Log in"
      onFooterPress={() => router.replace("/(auth)/login")}
    />
  );
}
