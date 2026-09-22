import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../lib/supabase"
import { router } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignupWithEmail = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!normalizedEmail || !password || !confirmPassword) {
      setErrorMessage("Enter your email and both password fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Your password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (!data.session) {
      setSuccessMessage(
        "Account created. Check your email to verify your account, then log in."
      );
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create account</Text>

        <Text style={styles.subtitle}>
          Create your account and start solving problems.
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
              placeholder="Create a password"
              placeholderTextColor="#777"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm password</Text>

            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="#777"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
              style={styles.input}
            />
          </View>

          {errorMessage ? (
            <Text accessibilityRole="alert" style={styles.errorMessage}>
              {errorMessage}
            </Text>
          ) : null}

          {successMessage ? (
            <Text style={styles.successMessage}>{successMessage}</Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
            disabled={isLoading}
            onPress={handleSignupWithEmail}
            style={({ pressed }) => [
              styles.signupButton,
              pressed && styles.signupButtonPressed,
              isLoading && styles.signupButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.signupButtonText}>Create account</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />

          <Text style={styles.orText}>OR</Text>

          <View style={styles.divider} />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setErrorMessage("Google sign-in is not configured yet.")}
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.googleButtonPressed,
          ]}
        >
          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
        </Pressable>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/(auth)/login")}
            style={styles.loginLinkButton}
          >
            {({ pressed }) => (
              <Text style={[styles.loginLink, pressed && styles.pressedLink]}>
                Login
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

  signupButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  signupButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },

  signupButtonPressed: {
    backgroundColor: "#D6D6D6",
  },

  signupButtonDisabled: {
    backgroundColor: "#AAAAAA",
  },

  errorMessage: {
    color: "#FF8F8F",
    fontSize: 13,
    lineHeight: 19,
  },

  successMessage: {
    color: "#8FE0A8",
    fontSize: 13,
    lineHeight: 19,
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

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  loginText: {
    color: "#777777",
    fontSize: 14,
  },

  loginLink: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  loginLinkButton: {
    marginLeft: 4,
  },

  pressedLink: {
    color: "#AAAAAA",
  },
});