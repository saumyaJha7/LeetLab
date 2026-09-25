import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export type Profile = {
  name: string | null;
  avatar_url: string | null;
};

/** Current user's profile row (created on signup by DB trigger). */
export function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      const userId = session?.user?.id;
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { profile, loading };
}
