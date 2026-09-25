import { Redirect } from "expo-router";
import { useAuth } from "../hooks/useAuth";

export default function AppEntry() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return <Redirect href={session ? "/(tabs)" : "/(auth)/login"} />;
}