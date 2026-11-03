/**
 * Escapowanie znaków specjalnych dla HTML i XML. `&#39;` działa w obu
 * (w przeciwieństwie do `&apos;`, którego nie zna HTML 4), więc jeden helper
 * obsługuje i treść maila z formularza, i kanał RSS.
 */
export function escapeMarkup(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
