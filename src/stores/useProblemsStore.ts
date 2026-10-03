import { create } from "zustand";
import { supabase } from "../lib/supabase";

export type ProblemSummary = {
  problem_id: number;
  title: string;
  tags: string[] | null;
  acceptance_rate: number;
};

type ProblemsState = {
  problems: ProblemSummary[];
  total: number | null;
  loading: boolean;
  /** True once the first fetch completed — screens show full
   * loaders only before this, never on refresh. */
  initialized: boolean;
  error: string | null;
  fetchProblems: () => Promise<void>;
};

/** Problem list summaries + total count (single query), fetched once
 * and shared — home slices its top 3 locally instead of querying twice. */
export const useProblemsStore = create<ProblemsState>()((set) => ({
  problems: [],
  total: null,
  loading: true,
  initialized: false,
  error: null,
  fetchProblems: async () => {
    set({ loading: true, error: null });

    const { data, count, error: queryError } = await supabase
      .from("problems")
      .select("problem_id, title, tags, acceptance_rate", { count: "exact" })
      .order("problem_id", { ascending: true });

    if (queryError) {
      console.error("Error fetching problems:", queryError);
      set({
        problems: [],
        total: null,
        loading: false,
        initialized: true,
        error: "Couldn't load problems. Please try again.",
      });
      return;
    }
    set({
      problems: (data ?? []) as ProblemSummary[],
      total: count,
      loading: false,
      initialized: true,
      error: null,
    });
  },
}));
