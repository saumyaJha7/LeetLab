import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Button, Input, Label, TextField } from "heroui-native";
import { supabase } from "../../lib/supabase";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { AuthScreen, type AuthMessage } from "../../components/auth";
import { PasswordField } from "../../components/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<AuthMessage>(null);
  const { isGoogleLoading, signInWithGoogle } = useGoogleAuth();

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setMessage(null);

    if (!normalizedEmail || !password) {
      setMessage({ type: "error", text: "Enter your email and password." });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setIsLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    router.replace("/(tabs)");
  };

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

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setMessage(null);

    if (!normalizedEmail) {
      setMessage({
        type: "error",
        text: "Enter your email first, then tap Forgot password.",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
    setMessage(
      error
        ? { type: "error", text: error.message }
        : {
            type: "success",
            text: "Password reset instructions are on their way.",
          }
    );
  };

  const busy = isLoading || isGoogleLoading;

  return (
    <AuthScreen
      eyebrow="WELCOME BACK"
      title="Keep your edge."
      subtitle="Pick up where you left off and get back to solving."
      formTitle="Log in to your account"
      submitLabel="Log in"
      isSubmitting={isLoading}
      onSubmit={handleLogin}
      message={message}
      isGoogleLoading={isGoogleLoading}
      onGooglePress={handleGoogleLogin}
      footerPrompt="New to LeetLab?"
      footerActionLabel="Create account"
      onFooterPress={() => router.replace("/(auth)/signup")}
      belowFields={
        <View className="items-end">
          <Button
            variant="ghost"
            size="sm"
            isDisabled={busy}
            onPress={handleForgotPassword}
          >
            <Button.Label>Forgot password?</Button.Label>
          </Button>
        </View>
      }
    >
      <TextField isRequired>
        <Label>Email</Label>
        <Input
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!busy}
          value={email}
          onChangeText={setEmail}
        />
      </TextField>
      <PasswordField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        editable={!busy}
      />
    </AuthScreen>
  );
}
