import { useState } from "react";
import { router } from "expo-router";
import { Input, Label, TextField } from "heroui-native";
import { supabase } from "../../lib/supabase";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { AuthScreen, type AuthMessage } from "../../components/AuthScreen";
import { PasswordField } from "../../components/PasswordField";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<AuthMessage>(null);
  const { isGoogleLoading, signInWithGoogle } = useGoogleAuth();

  const handleSignupWithEmail = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setMessage(null);

    if (!normalizedEmail || !password || !confirmPassword) {
      setMessage({
        type: "error",
        text: "Enter your email and both password fields.",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Your password must be at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });
    setIsLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    if (!data.user) {
      setMessage({ type: "error", text: "Sign up failed. Please try again." });
      return;
    }

    if (!data.session) {
      setMessage({
        type: "success",
        text: "Account created. Check your email to confirm your account.",
      });
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

  const busy = isLoading || isGoogleLoading;

  return (
    <AuthScreen
      eyebrow="START YOUR RUN"
      title="Build your edge."
      subtitle="Create an account and turn daily practice into a sharper problem-solving habit."
      formTitle="Create your account"
      submitLabel="Create account"
      isSubmitting={isLoading}
      onSubmit={handleSignupWithEmail}
      message={message}
      isGoogleLoading={isGoogleLoading}
      onGooglePress={handleGoogleLogin}
      footerPrompt="Already have an account?"
      footerActionLabel="Log in"
      onFooterPress={() => router.replace("/(auth)/login")}
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
        placeholder="Create a password"
        editable={!busy}
      />
      <PasswordField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        editable={!busy}
      />
    </AuthScreen>
  );
}
