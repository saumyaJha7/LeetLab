import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useProfileStore } from "./useProfileStore";

type SessionState = {
  session: Session | null;
  loading: boolean;
  /** Subscribe to auth changes + resolve the initial session.
   * Call once from the root layout; returns the cleanup. */
  initialize: () => () => void;
};

/** Global session. Replaces the old AuthProvider — no provider needed,
 * screens subscribe with `useSessionStore((s) => s.session)`. */
export const useSessionStore = create<SessionState>()((set) => ({
  session: null,
  loading: true,
  initialize: () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      set({ session: nextSession, loading: false });
      if (nextSession) {
        void useProfileStore.getState().fetchProfile();
      } else {
        useProfileStore.getState().clearProfile();
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error loading auth session:", error);
        set({ session: null, loading: false });
        return;
      }
      set({ session: data.session, loading: false });
      if (data.session) {
        void useProfileStore.getState().fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  },
}));
