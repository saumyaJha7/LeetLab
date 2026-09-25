import { useState } from "react";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../lib/supabase";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

/**
 * Shared Google sign-in flow for login + signup.
 * Resolves to `{ ok: true }` only when a Supabase session was created.
 * `ok: false` with an error message means show it; `ok: false` without
 * one means the user dismissed the flow — stay put silently.
 */
export function useGoogleAuth() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const signInWithGoogle = async (): Promise<{
    ok: boolean;
    errorMessage: string | null;
  }> => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        return { ok: false, errorMessage: null };
      }

      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data.idToken as string,
      });
      setIsGoogleLoading(false);

      return error
        ? { ok: false, errorMessage: error.message }
        : { ok: true, errorMessage: null };
    } catch (error) {
      setIsGoogleLoading(false);
      console.error("Google sign-in failed:", error);

      const code =
        typeof error === "object" && error !== null && "code" in error
          ? String((error as { code: unknown }).code)
          : "";
      const message = error instanceof Error ? error.message : "";

      if (code === statusCodes.IN_PROGRESS) {
        return { ok: false, errorMessage: "Sign in is in progress." };
      }
      if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          ok: false,
          errorMessage: "Play services not available or outdated.",
        };
      }
      if (code === statusCodes.SIGN_IN_CANCELLED) {
        return { ok: false, errorMessage: null };
      }
      if (
        code === "DEVELOPER_ERROR" ||
        /GoogleService|google-services|clientId|configure/i.test(message)
      ) {
        return {
          ok: false,
          errorMessage: "Google Sign-In is not configured correctly.",
        };
      }
      return {
        ok: false,
        errorMessage: message || "An error occurred during Google Sign-In.",
      };
    }
  };

  return { isGoogleLoading, signInWithGoogle };
}
