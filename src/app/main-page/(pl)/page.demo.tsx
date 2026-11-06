import type { Metadata } from "next"
import { HomePage } from "@/app/main-page/_variants/wariant-1/home-page"
import { homeMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = {
  ...homeMetadata("pl"),
  robots: { index: false, follow: false },
}

/** Strona główna — wariant 1 (po przepięciu: `src/app/(pl)/page.tsx`). */
export default function Page() {
  return <HomePage locale="pl" />
}
