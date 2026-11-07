import type { Metadata } from "next"
import { NotFoundPage } from "@/app/main-page/_components/views/not-found-page"
import { getSystem } from "@/i18n/content/system"

export const metadata: Metadata = {
  title: getSystem("pl").notFound.title,
  robots: { index: false, follow: false },
}

/**
 * Podgląd ekranu 404 nowej wersji. Nieznane adresy (`dynamicParams = false`) obsługuje
 * dziś `global-not-found.tsx` serwisu — przy przepięciu dostaje on `MainShell` i ten widok.
 * Po przepięciu tej trasy nie ma.
 */
export default function Page() {
  return <NotFoundPage locale="pl" />
}
