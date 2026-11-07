import type { Metadata } from "next"
import { HomePage } from "@/app/main-page/_variants/wariant-1/home-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { homeMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(homeMetadata("pl"))

/** Strona główna — wariant 1 (po przepięciu: `src/app/(pl)/page.tsx`). */
export default function Page() {
  return <HomePage locale="pl" />
}
