import { useEffect, useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  problem_id: number;
  title: string;
  description: string;
  tags: string[];
  examples: Example[];
  hints: string[];
  constraints: string[];
  languages: string[];
  acceptance_rate: number;
}

export function useProblem(problemId?: string) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(Boolean(problemId));
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProblem = async () => {
      if (!problemId) {
        setProblem(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("problems")
        .select(
          "problem_id, title, description, tags, examples, hints, constraints, languages, acceptance_rate"
        )
        .eq("problem_id", problemId)
        .single();

      if (cancelled) return;

      if (queryError) {
        console.error("Error fetching problem:", queryError);
        setProblem(null);
        setError(queryError);
      } else {
        setProblem(data as Problem);
      }

      setLoading(false);
    };

    fetchProblem();

    return () => {
      cancelled = true;
    };
  }, [problemId]);

  return { problem, loading, error };
}
