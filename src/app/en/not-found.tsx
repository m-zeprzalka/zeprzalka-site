import type { Metadata } from "next"
import { NotFoundView } from "@/components/system/NotFoundView"
import { getSystem } from "@/i18n/content/system"

export const metadata: Metadata = { title: getSystem("en").notFound.title }

/*
 * Siatka bezpieczeństwa dla `notFound()` w trasach tej wersji językowej. Nieznane
 * adresy (wszystkie trasy są statyczne, `dynamicParams = false`) obsługuje
 * `global-not-found.tsx` — dlatego `/en/*` dostaje dziś polską 404 (ROADMAP §4).
 */
export default function NotFound() {
  return <NotFoundView locale="en" />
}
