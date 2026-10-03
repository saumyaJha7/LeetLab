/** Trimmed display name with a shared fallback, so every greeting
 * across the app says the same thing for unnamed users. */
export function displayNameFor(
  name: string | null | undefined,
  fallback = "Coder",
): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed : fallback;
}
