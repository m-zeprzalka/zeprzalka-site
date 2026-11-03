import type { Metadata } from "next"
import { RootShell } from "@/components/layout/RootShell"
import { NotFoundView } from "@/components/system/NotFoundView"
import { DEFAULT_LOCALE } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { getSystem } from "@/i18n/content/system"

/**
 * Strona 404 dla adresów, które nie pasują do żadnej trasy.
 *
 * Serwis ma dwa układy główne — polski i angielski — więc zwykły
 * `app/not-found.tsx` nie miałby się do czego podpiąć i renderowałby się bez
 * arkusza stylów. `global-not-found` buduje własny, kompletny dokument, więc
 * nieznany adres dostaje pełną stronę (z nagłówkiem i stopką) i status 404.
 *
 * Treść jest polska: to język oryginału serwisu. Nieznany adres spod `/en`
 * też trafia tutaj — angielska 404 wymagałaby trasy renderowanej na żądanie
 * (statyczny catch-all z `dynamicParams = false` i tak kończy się tą stroną).
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
    <RootShell locale={DEFAULT_LOCALE}>
      <NotFoundView locale={DEFAULT_LOCALE} />
    </RootShell>
  )
}
