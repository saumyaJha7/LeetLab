import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignupScreen() {
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
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <TextInput
              placeholder="Create a password"
              placeholderTextColor="#777"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm password</Text>

            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="#777"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Pressable style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Create account</Text>
          </Pressable>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />

          <Text style={styles.orText}>OR</Text>

          <View style={styles.divider} />
        </View>

        <Pressable style={styles.googleButton}>
          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
        </Pressable>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <Pressable>
            <Text style={styles.loginLink}> Login</Text>
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
});