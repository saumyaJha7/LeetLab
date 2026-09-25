import { useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Spinner, useThemeColor } from "heroui-native";
import { supabase } from "../../lib/supabase";

/** Sign-out button with loading + error handling. */
export function SignOutButton() {
  const dangerForeground = useThemeColor("danger-foreground");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);

    const { error: signOutError } = await supabase.auth.signOut();
    setIsSigningOut(false);

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.replace("/(auth)/login");
  };

  return (
    <>
      {error ? (
        <Text
          accessibilityRole="alert"
          className="mb-3 text-center text-danger"
          style={{ fontSize: 13, lineHeight: 19 }}
        >
          {error}
        </Text>
      ) : null}
      <Button
        variant="danger-soft"
        size="lg"
        className="w-full"
        isDisabled={isSigningOut}
        onPress={handleSignOut}
      >
        {isSigningOut ? (
          <Spinner color={dangerForeground} />
        ) : (
          <Ionicons name="log-out-outline" size={18} color={dangerForeground} />
        )}
        <Button.Label>Sign out</Button.Label>
      </Button>
    </>
  );
}
