import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSessionStore } from "../../stores/useSessionStore";
import { tabBar } from "../../theme";

export default function TabsLayout() {
  const session = useSessionStore((s) => s.session);
  const loading = useSessionStore((s) => s.loading);

  if (loading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabBar.active,
        tabBarInactiveTintColor: tabBar.inactive,
        // Tab switches are peers — never slide.
        animation: "none",
        tabBarStyle: {
          backgroundColor: tabBar.background,
          borderTopColor: tabBar.border,
          borderTopWidth: 1,
          width: "100%",
          maxWidth: 680,
          alignSelf: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="problems"
        options={{
          title: "Problems",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="code-slash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Detail routes — reachable via push, hidden from the tab bar */}
      <Tabs.Screen name="[problemId]/index" options={{ href: null }} />
      <Tabs.Screen name="[problemId]/codeEditor" options={{ href: null }} />
      <Tabs.Screen name="[problemId]/result" options={{ href: null }} />
    </Tabs>
  );
}
