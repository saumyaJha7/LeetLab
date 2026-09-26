import "../../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "heroui-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../hooks/useAuth";
import { colors } from "../theme";

import { useReducedMotion } from "react-native-reanimated";

export default function RootLayout() {
  const reduced = useReducedMotion();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              // Platform push everywhere; fade when reduced motion is on.
              animation: reduced ? "fade" : "default",
              animationMatchesGesture: true,
            }}
          >
            {/* Tab group is a peer switch, never a push — no slide. */}
            <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
            <Stack.Screen
              name="(auth)"
              options={{ animation: reduced ? "fade" : "fade" }}
            />
          </Stack>
        </AuthProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
