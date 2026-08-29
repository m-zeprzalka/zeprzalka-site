import type { Metadata } from "next"
import { RootShell } from "@/components/layout/RootShell"
import { NotFoundView } from "@/components/system/NotFoundView"
import { DEFAULT_LOCALE } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"

/**
 * Strona 404 dla adresów, które nie pasują do żadnej trasy.
 *
 * Serwis ma dwa układy główne — polski i angielski — więc zwykły
 * `app/not-found.tsx` nie miałby się do czego podpiąć i renderowałby się bez
 * arkusza stylów. `global-not-found` buduje własny, kompletny dokument, więc
 * nieznany adres dostaje pełną stronę (z nagłówkiem i stopką) i status 404.
 *
 * Treść jest polska: to język oryginału serwisu, a adresu spoza obu wersji
 * nie da się przypisać do żadnej z nich.
 */
export const metadata: Metadata = {
  title: getMeta(DEFAULT_LOCALE).root.titleDefault,
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <RootShell locale={DEFAULT_LOCALE}>
      <NotFoundView locale={DEFAULT_LOCALE} />
    </RootShell>
  )
}
