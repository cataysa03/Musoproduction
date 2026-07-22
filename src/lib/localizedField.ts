/**
 * Resolves a bilingual DB field for the active locale, falling back to the
 * other language when the active one hasn't been translated yet (covers
 * both legacy rows that only have `en` filled and new rows that only have
 * `tr` filled).
 */
export function pickLocalized(
  locale: string,
  trValue: string | null | undefined,
  enValue: string | null | undefined
): string {
  return locale === "tr" ? trValue || enValue || "" : enValue || trValue || "";
}
