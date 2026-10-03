import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useSessionStore } from "./useSessionStore";

export type Profile = {
  name: string | null;
  avatar_url: string | null;
};

type ProfileState = {
  profile: Profile | null;
  loading: boolean;
  /** True once the first fetch completed — screens show full
   * loaders only before this, never on refresh. */
  initialized: boolean;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
};

/** Current user's profile row, fetched once and shared by every
 * screen (home greeting + profile tab previously queried twice). */
export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  loading: true,
  initialized: false,
  fetchProfile: async () => {
    const userId = useSessionStore.getState().session?.user?.id;
    if (!userId) {
      set({ profile: null, loading: false, initialized: true });
      return;
    }

    set({ loading: true });
    const { data, error } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      set({ profile: null, loading: false, initialized: true });
      return;
    }
    set({ profile: data as Profile, loading: false, initialized: true });
  },
  clearProfile: () =>
    set({ profile: null, loading: false, initialized: false }),
}));
