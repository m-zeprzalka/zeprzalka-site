import type { Metadata } from "next"
import { MainShell } from "@/components/layout/main-shell"
import { NotFoundPage } from "@/components/views/not-found-page"
import { DEFAULT_LOCALE } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { getSystem } from "@/i18n/content/system"

/**
 * Strona 404 dla adresów, które nie pasują do żadnej trasy.
 *
 * Serwis ma dwa układy główne — polski i angielski — więc zwykły
 * `app/not-found.tsx` nie miałby się do czego podpiąć i renderowałby się bez
 * arkusza stylów. `global-not-found` buduje własny, kompletny dokument (ta sama
 * powłoka co każda strona), więc nieznany adres dostaje pełną stronę i status 404.
 *
 * Treść jest polska: to język oryginału serwisu. Nieznany adres spod `/en`
 * też trafia tutaj — angielska 404 wymagałaby trasy renderowanej na żądanie.
 * `noindex` dokłada sam Next — jawne `robots` dawało drugi znacznik.
 */
export const metadata: Metadata = {
  // Poza układami głównymi nie działa ich szablon tytułu — sufiks dokładamy sami.
  title: getMeta(DEFAULT_LOCALE).root.titleTemplate.replace(
    "%s",
    getSystem(DEFAULT_LOCALE).notFound.title
  ),
}

export default function GlobalNotFound() {
  return (
    <MainShell locale={DEFAULT_LOCALE}>
      <NotFoundPage locale={DEFAULT_LOCALE} />
    </MainShell>
  )
}
