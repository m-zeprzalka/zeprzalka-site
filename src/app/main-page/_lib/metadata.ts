import type { Metadata } from "next"

/**
 * Podgląd nowej wersji: metadane serwisu (tytuł, opis, canonical, hreflang,
 * Open Graph), ale zawsze poza indeksem wyszukiwarek. Przy przepięciu znika
 * razem z prefiksem `/main-page` — strony dostają wprost funkcje z
 * `src/i18n/page-metadata.ts`.
 */
export function preview(metadata: Metadata): Metadata {
  return { ...metadata, robots: { index: false, follow: false } }
}
