/**
 * Jedna reguła slugów dla kategorii i tagów — w adresach, w filtrowaniu
 * i w mapie tłumaczeń (`src/i18n/blog-map.ts`).
 *
 * Moduł jest czystą funkcją bez `fs`, więc mogą go importować zarówno
 * `lib/posts.ts` (serwer), jak i przełącznik języka (przeglądarka).
 * Wcześniej ta sama reguła była powielona w dwóch plikach.
 */
export function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-")
}
