import { Redirect } from "expo-router";
import { useSessionStore } from "../stores/useSessionStore";

export default function AppEntry() {
  const session = useSessionStore((s) => s.session);
  const loading = useSessionStore((s) => s.loading);

  if (loading) return null;

  return <Redirect href={session ? "/(tabs)" : "/(auth)/login"} />;
}
