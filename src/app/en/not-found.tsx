import type { Metadata } from "next"
import { NotFoundPage } from "@/components/views/not-found-page"
import { getSystem } from "@/i18n/content/system"

export const metadata: Metadata = { title: getSystem("en").notFound.title }

/*
 * Siatka bezpieczeństwa dla `notFound()` w trasach tej wersji językowej. Nieznane
 * adresy (wszystkie trasy są statyczne, `dynamicParams = false`) obsługuje
 * `global-not-found.tsx` — po polsku, jak cały serwis bez prefiksu.
 */
export default function NotFound() {
  return <NotFoundPage locale="en" />
}
