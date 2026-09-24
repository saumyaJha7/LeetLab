import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  const handleGoogleLogin = async () => {
    setMessage(null);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      if (isSuccessResponse(response)) {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.data.idToken as string,
        });
        
        setIsLoading(false);
        if (error) {
          setMessage(error.message);
          setMessageType("error");
        } else {
          router.replace("/(tabs)");
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === statusCodes.IN_PROGRESS) {
        setMessage("Sign in is in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setMessage("Play services not available or outdated.");
      } else if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
        setMessage("Google Sign-In was cancelled by user.");
      } else {
        setMessage("An error occurred during Google Sign-In.");
      }
      setMessageType("error");
    }
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

  const inputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.backgroundAccent} />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>L</Text>
          </View>
          <Text style={styles.brandName}>LEETLAB</Text>
        </View>

        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
        </View>

        <Text style={styles.title}>Keep your edge.</Text>
        <Text style={styles.subtitle}>
          Pick up where you left off and get back to solving.
        </Text>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Log in to your account</Text>
            <Text style={styles.formStep}>01 / 01</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                keyboardType="email-address"
                onBlur={() => setFocusedField(null)}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                placeholder="Enter your email"
                placeholderTextColor="#6F8BA8"
                style={inputStyle("email")}
                value={email}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                editable={!isLoading}
                onBlur={() => setFocusedField(null)}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                placeholder="Enter your password"
                placeholderTextColor="#6F8BA8"
                secureTextEntry
                style={inputStyle("password")}
                value={password}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
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
              accessibilityState={{ disabled: isLoading }}
              disabled={isLoading}
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
                isLoading && styles.loginButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#04101D" />
              ) : (
                <Text style={styles.loginButtonText}>Log in</Text>
              )}
            </Pressable>
          </View>
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
          disabled={isLoading}
          onPress={handleGoogleLogin}
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.googleButtonPressed,
          ]}
        >
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>New to LeetLab?</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/(auth)/signup")}
            style={styles.signupLinkButton}
          >
            {({ pressed }) => (
              <Text style={[styles.signupLink, pressed && styles.pressedLink]}>
                Create account
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
    backgroundColor: "#06101D",
  },
  backgroundAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 92,
    height: "100%",
    backgroundColor: "#0A2038",
    borderLeftWidth: 1,
    borderLeftColor: "#12385F",
    opacity: 0.7,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 42,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B9BFF",
    elevation: 5,
    shadowColor: "#3B9BFF",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  brandMarkText: {
    color: "#06101D",
    fontSize: 20,
    fontWeight: "900",
  },
  brandName: {
    color: "#BBD9F7",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2.4,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#52B1FF",
  },
  eyebrow: {
    color: "#52B1FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  title: {
    color: "#F3F8FF",
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    maxWidth: 350,
    color: "#8EA7C1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  formCard: {
    borderWidth: 1,
    borderColor: "#173A61",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#0B1B2E",
    elevation: 7,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  formTitle: {
    color: "#DCEBFA",
    fontSize: 15,
    fontWeight: "700",
  },
  formStep: {
    color: "#4C82B4",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: "#AFC7DF",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#234565",
    borderRadius: 11,
    paddingHorizontal: 16,
    color: "#F3F8FF",
    backgroundColor: "#071525",
    fontSize: 15,
  },
  inputFocused: {
    borderColor: "#3B9BFF",
    backgroundColor: "#0A1D32",
    shadowColor: "#3B9BFF",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  forgotPasswordText: {
    color: "#6FA9D8",
    fontSize: 13,
    fontWeight: "600",
  },
  pressedLinkText: {
    color: "#B9E0FF",
  },
  loginButton: {
    height: 54,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    backgroundColor: "#3B9BFF",
    elevation: 5,
    shadowColor: "#3B9BFF",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  loginButtonText: {
    color: "#04101D",
    fontSize: 16,
    fontWeight: "800",
  },
  loginButtonPressed: {
    backgroundColor: "#77C0FF",
  },
  loginButtonDisabled: {
    backgroundColor: "#38678F",
  },
  errorMessage: {
    color: "#FF9A9A",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
  successMessage: {
    color: "#8FE0A8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#1A3A5B",
  },
  orText: {
    color: "#5B7D9F",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  googleButton: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#234565",
    borderRadius: 11,
    backgroundColor: "#0B1B2E",
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F8FF",
  },
  googleIconText: {
    color: "#4285F4",
    fontSize: 14,
    fontWeight: "900",
  },
  googleButtonText: {
    color: "#DCEBFA",
    fontSize: 15,
    fontWeight: "600",
  },
  googleButtonPressed: {
    borderColor: "#3B9BFF",
    backgroundColor: "#102945",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#7895B2",
    fontSize: 14,
  },
  signupLinkButton: {
    marginLeft: 4,
  },
  signupLink: {
    color: "#52B1FF",
    fontSize: 14,
    fontWeight: "800",
  },
  pressedLink: {
    color: "#A9D9FF",
  },
});
