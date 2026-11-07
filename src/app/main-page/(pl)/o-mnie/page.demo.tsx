import type { Metadata } from "next"
import { AboutPage } from "@/app/main-page/_components/views/about-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { aboutMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(aboutMetadata("pl"))

/** Po przepięciu: `src/app/(pl)/o-mnie/page.tsx`. */
export default function Page() {
  return <AboutPage locale="pl" />
}
