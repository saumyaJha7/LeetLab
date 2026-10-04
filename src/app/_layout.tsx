import "../../global.css";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "heroui-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
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
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Release the native splash once the session is known AND type is
  // ready. fontError counts as ready — a failed font fetch must never
  // hold the splash (screens fall back to system fonts).
  const ready = !sessionLoading && (fontsLoaded || !!fontError);
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

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
