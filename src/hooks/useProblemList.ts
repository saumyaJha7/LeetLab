import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type ProblemSummary = {
  problem_id: number;
  title: string;
  tags: string[] | null;
  acceptance_rate: number;
};

/** Problem list summaries + total count (single query). Omit limit to fetch all. */
export function useProblemList(limit?: number) {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("problems")
      .select("problem_id, title, tags, acceptance_rate", { count: "exact" })
      .order("problem_id", { ascending: true });

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const { data, count, error: queryError } = await query;

    if (queryError) {
      console.error("Error fetching problems:", queryError);
      setProblems([]);
      setTotal(null);
      setError("Couldn't load problems. Please try again.");
    } else {
      setProblems((data ?? []) as ProblemSummary[]);
      setTotal(count);
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return { problems, total, loading, error, refetch: fetchProblems };
}
