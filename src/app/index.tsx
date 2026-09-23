import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import Login from "./(auth)/login";
import SignUp from "./(auth)/signup";
import { supabase } from "../lib/supabase";

const AppEntry = () => {
  const [screen, setScreen] = useState<"loading" | "signup" | "login" | "tabs">(
    "loading"
  );

  useEffect(() => {
    let isMounted = true;

    const checkAuthState = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (userError || !user) {
          setScreen("signup");
          return;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError || !session) {
          setScreen("login");
          return;
        }

        router.replace("/(tabs)");
        setScreen("tabs");
      } catch {
        if (isMounted) {
          setScreen("signup");
        }
      }
    };

    checkAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session) {
        setScreen("login");
        return;
      }

      router.replace("/(tabs)");
      setScreen("tabs");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (screen === "loading") return null;
  if (screen === "login") return <Login />;
  if (screen === "tabs") return null;

  return <SignUp />;
};

export default AppEntry;