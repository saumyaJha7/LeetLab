import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Signed-in users never see auth forms — mirror of the tabs guard.
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Login <-> signup are peers, not hierarchy — subtle fade, never slide.
        animation: "fade",
      }}
    />
  );
}
