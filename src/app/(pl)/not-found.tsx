import type { Metadata } from "next"
import { NotFoundPage } from "@/components/views/not-found-page"
import { getSystem } from "@/i18n/content/system"

export const metadata: Metadata = { title: getSystem("pl").notFound.title }

/** `notFound()` w trasach polskiej wersji (np. nieznany wpis). Nieznany adres — `global-not-found.tsx`. */
export default function NotFound() {
  return <NotFoundPage locale="pl" />
}
