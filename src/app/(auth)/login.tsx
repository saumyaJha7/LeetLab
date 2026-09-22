import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import type { RelativePathString } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setMessage(null);

    if (!normalizedEmail || !password) {
      setMessage("Enter your email and password.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    router.replace("/(tabs)");
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setMessage(null);

    if (!normalizedEmail) {
      setMessage("Enter your email first, then tap Forgot password.");
      setMessageType("error");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    setMessage("Password reset instructions are on their way.");
    setMessageType("success");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Login to continue solving problems.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#777"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              style={styles.input}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.forgotPasswordText,
                  pressed && styles.pressedLinkText,
                ]}
              >
                Forgot password?
              </Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleLogin}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              isLoading && styles.loginButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </Pressable>
        </View>

        {message ? (
          <Text
            accessibilityRole="alert"
            style={
              messageType === "success"
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            {message}
          </Text>
        ) : null}

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setMessage("Google sign-in is not configured yet.")}
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.googleButtonPressed,
          ]}
        >
          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don&apos;t have an account?
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/signup" as RelativePathString)}
            style={styles.signupLinkButton}
          >
            {({ pressed }) => (
              <Text
                style={[styles.signupLink, pressed && styles.pressedLink]}
              >
                Sign up
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#888888",
    marginBottom: 36,
  },

  form: {
    gap: 18,
  },

  inputGroup: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#CCCCCC",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 10,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    backgroundColor: "#181818",
    fontSize: 15,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -6,
  },

  forgotPasswordText: {
    color: "#888888",
    fontSize: 13,
  },

  pressedLinkText: {
    color: "#FFFFFF",
  },

  loginButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  loginButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },

  loginButtonPressed: {
    backgroundColor: "#D6D6D6",
  },

  loginButtonDisabled: {
    backgroundColor: "#AAAAAA",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 28,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#2A2A2A",
  },

  orText: {
    color: "#666666",
    fontSize: 12,
  },

  googleButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181818",
  },

  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },

  googleButtonPressed: {
    backgroundColor: "#242424",
    borderColor: "#666666",
  },

  errorMessage: {
    color: "#FF8F8F",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 16,
  },

  successMessage: {
    color: "#8FE0A8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 16,
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  signupText: {
    color: "#777777",
    fontSize: 14,
  },

  signupLink: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  signupLinkButton: {
    marginLeft: 4,
  },

  pressedLink: {
    color: "#AAAAAA",
  },
});