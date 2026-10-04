/** Trimmed display name with a shared fallback, so every greeting
 * across the app says the same thing for unnamed users. */
export function displayNameFor(
  name: string | null | undefined,
  fallback = "Coder",
): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed : fallback;
}

/** Avatar initials from a name, falling back to the email. */
export function initialsFor(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}
