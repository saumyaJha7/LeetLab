export type Difficulty = "Easy" | "Medium" | "Hard";

/**
 * Difficulty band derived from acceptance rate — the problems table
 * stores no difficulty column, so this heuristic is the single owner.
 * Thresholds follow the usual LeetCode-style split.
 */
export function difficultyFor(acceptanceRate: number): Difficulty {
  if (acceptanceRate >= 60) return "Easy";
  if (acceptanceRate >= 40) return "Medium";
  return "Hard";
}
