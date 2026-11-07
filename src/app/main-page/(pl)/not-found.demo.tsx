import type { Metadata } from "next"
import { NotFoundPage } from "@/app/main-page/_components/views/not-found-page"
import { getSystem } from "@/i18n/content/system"

export const metadata: Metadata = { title: getSystem("pl").notFound.title }

/** `notFound()` w trasach podglądu (np. nieznany wpis) — po przepięciu: `src/app/(pl)/not-found.tsx`. */
export default function NotFound() {
  return <NotFoundPage locale="pl" />
}
