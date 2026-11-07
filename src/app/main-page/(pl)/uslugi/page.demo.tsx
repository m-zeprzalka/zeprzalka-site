import type { Metadata } from "next"
import { ServicesPage } from "@/app/main-page/_components/views/services-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { servicesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(servicesMetadata("pl"))

/** Po przepięciu: `src/app/(pl)/uslugi/page.tsx`. */
export default function Page() {
  return <ServicesPage locale="pl" />
}
