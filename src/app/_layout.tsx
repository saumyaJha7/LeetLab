import "../../global.css";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "heroui-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useSessionStore } from "../stores/useSessionStore";
import { colors } from "../theme";

// Hold the native splash until the session is known — released below
// once loading resolves. Ignores rejections when a previous reload
// already prevented auto-hide.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // NOTE: intentionally no useReducedMotion() from Reanimated here.
  // Pulling the worklets UI runtime into the root layout contributed to
  // Android Fabric crashes (IllegalViewOperationException). Keep root
  // animations static until Reanimated is re-verified on release builds.

  useEffect(() => {
    return useSessionStore.getState().initialize();
  }, []);

  const sessionLoading = useSessionStore((s) => s.loading);

  // Release the native splash exactly when the session is known,
  // so first paint is never a blank guess.
  useEffect(() => {
    if (!sessionLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [sessionLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            // Peer switches use animation:none below; pushes use platform default.
            animation: "default",
            animationMatchesGesture: true,
          }}
        >
          {/* Tab group is a peer switch, never a push — no slide. */}
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        </Stack>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
